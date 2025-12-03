import Header from "../components/Header";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

export default function Profile() {
    const { id } = useParams();
    const [abonado, setAbonado] = useState(null);
    const [pagosFiltrados, setPagosFiltrados] = useState("");
    const [filtroAfiliacion, setFiltroAfiliacion] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No hay sesión activa. Inicia sesión nuevamente.");
            setLoading(false);
            return;
        }
        // Llamada al backend
        const fetchAbonado = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/abonado/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("El ticket no existe o fue eliminado.");
                    } else if (res.status === 403) {
                        throw new Error("No tienes permisos para ver este ticket.");
                    } else {
                        throw new Error("Error al obtener el ticket.");
                    }
                }

                const data = await res.json();
                setAbonado(data);


                const todosLosPagos = data.afiliaciones.flatMap(a =>
                    a.pagos.map(p => ({
                        ...p,
                        afiliacionId: a.id   ,
                        fechaInicio: a.fechaInicio,
                        fechaFin: a.fechaFin
                    }))
                );

                setPagosFiltrados(todosLosPagos);

            } catch (err) {
                console.error("Error al obtener datos del abonado", err);
            }
        };
        fetchAbonado();
    }, [id]);

    const filtrarPagos = (value) => {
        setFiltroAfiliacion(value);

        if (value === "") {
            const todos = abonado.afiliaciones.flatMap(a =>
                a.pagos.map(p => ({
                    ...p,
                    afiliacionId: a.id,
                    fechaInicio: a.fechaInicio,
                    fechaFin: a.fechaFin
                }))
            );
            setPagosFiltrados(todos);
            return;
        }

        const afiliacion = abonado.afiliaciones.find(a => a.id === Number(value));
        if (!afiliacion) {
            setPagosFiltrados([]);
            return;
        }

        const filtrados = afiliacion.pagos.map(p => ({
            ...p,
            afiliacionId: afiliacion.id,
            fechaInicio: afiliacion.fechaInicio,
            fechaFin: afiliacion.fechaFin
        }));

        setPagosFiltrados(filtrados);
    };

    if (!abonado) {
        return <div className="p-10 text-center text-gray-500">Cargando...</div>;
    };

    return (
        <div className="min-h-screen bg-gray-200">
            <section>
                <Header />
            </section>
            <div className="pt-24 bg-white  h-screen">
                <div className="flex flex-col p-3 gap-3">
                    <h1><strong>ABONADO:</strong></h1>
                    <div className="space-y-2">
                        <p><strong>Nombre:</strong> {abonado.nombre}</p>
                        <p><strong>Placa:</strong> {abonado.placa}</p>
                        <p><strong>Celular:</strong> {abonado.celular}</p>
                    </div>
                    <div className="mt-6">
                        <label className="font-semibold">Filtrar pagos por ID de afiliación:</label>
                        <input
                            type="number"
                            className="ml-2 border px-2 py-1 rounded"
                            placeholder="Ej: 22"
                            value={filtroAfiliacion}
                            onChange={(e) => filtrarPagos(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto
                     w-full ">
                        <table className="min-w-full border border-gray-300 rounded-lg mt-6">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-4 py-2">ID Pago</th>
                                    <th className="px-4 py-2">ID Afiliación</th>
                                    <th className="px-4 py-2">Fecha Inicio</th>
                                    <th className="px-4 py-2">Fecha Fin</th>
                                    <th className="px-4 py-2">Mes</th>
                                    <th className="px-4 py-2">Monto</th>
                                    <th className="px-4 py-2">Pagado</th>

                                </tr>
                            </thead>

                            <tbody>
                                {pagosFiltrados.length > 0 ? (
                                    pagosFiltrados.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-100">
                                            <td className="border px-4 py-2">{p.id}</td>
                                            <td className="border px-4 py-2">{p.afiliacionId}</td>
                                            <td className="border px-4 py-2">{p.fechaInicio}</td>
                                            <td className="border px-4 py-2">{p.fechaFin}</td>
                                            <td className="border px-4 py-2">{p.mes}</td>
                                            <td className="border px-4 py-2">S/{p.monto}</td>

                                            <td
                                                className="border px-4 py-2 font-bold"
                                                style={{ color: p.pagado ? "green" : "red" }}
                                            >
                                                {p.pagado ? "Pagado" : "Pendiente"}
                                            </td>


                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-3 text-gray-500">
                                            No hay pagos disponibles
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div >
    );
}