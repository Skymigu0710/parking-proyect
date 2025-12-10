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
                        afiliacionId: a.id,
                        fechaInicioA: a.fechaInicio,
                        fechaFinA: a.fechaFin,
                        fechaInicio: p.fechaInicio,
                        fechaFin: p.fechaFin
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
                    fechaInicio: p.fechaInicio,
                    fechaFin: p.fechaFin
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
            fechaInicio: p.fechaInicio,
            fechaFin: p.fechaFin
        }));

        setPagosFiltrados(filtrados);
    };
    const confirmarPago = async (pagoId) => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:8080/api/pagos/confirmar/${pagoId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Error al confirmar el pago");
        }
        setPagosFiltrados(prev =>
            prev.map(p =>
                p.id === pagoId ? { ...p, pagado: true } : p
            )
        );

        alert("Pago realizado correctamente");

    } catch (error) {
        console.error("Error al confirmar pago:", error);
        alert("No se pudo completar el pago");
    }
};
    if (!abonado) {
        return <div className="p-10 text-center text-gray-500">Cargando...</div>;
    };

    return (
        <div className="min-h-screen bg-gray-200">
            <section>
                <Header />
            </section>
            <div className="pt-auto  h-screen">
                <div className="flex flex-col p-3 gap-3">
                    <h2 className="text-lg font-semibold text-gray-700 mb-auto">Datos del Abonado:</h2>
                    <div className=" bg-white rounded-lg space-y-2 p-3 ">
                        <p><strong>Nombre:</strong> {abonado.nombre}</p>
                        <p><strong>Placa:</strong> {abonado.placa}</p>
                        <p><strong>Celular:</strong> {abonado.celular}</p>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 ">Filtros:</h2>
                    <div className="bg-white rounded-lg p-3 mt-auto">
                        <label className="font-semibold">Filtrar pagos por ID de afiliación:</label>
                        <input
                            type="number"
                            className="ml-2 border-b px-2 py-1 rounded"
                            placeholder="Ej: 22"
                            value={filtroAfiliacion}
                            onChange={(e) => filtrarPagos(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto
                     w-full ">
                        <table className="min-w-full bg-white rounded-lg shadow-md text-sm">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-2 text-left">ID</th>
                                    <th className="p-2 text-left">ID Afiliación</th>
                                    <th className="p-2 text-left">Fecha Inicio</th>
                                    <th className="p-2 text-left">Fecha Fin</th>
                                    <th className="p-2 text-left">Mes</th>
                                    <th className="p-2 text-left">Monto</th>
                                    <th className="p-2 text-left">Estado</th>
                                    <th className="p-2 text-left">Opción</th>

                                </tr>
                            </thead>

                            <tbody>
                                {pagosFiltrados.length > 0 ? (
                                    pagosFiltrados.map((p) => (
                                        <tr key={p.id} className="border-b hover:bg-gray-100 cursor-pointer">
                                            <td className="p-2">{p.id}</td>
                                            <td className="p-2">{p.afiliacionId}</td>
                                            <td className="p-2">{p.fechaInicio}</td>
                                            <td className="p-2">{p.fechaFin}</td>
                                            <td className="p-2">{p.mes}</td>
                                            <td className="p-2">S/{p.monto}</td>

                                            <td
                                                className="p-2"
                                                style={{ color: p.pagado ? "green" : "red" }}
                                            >
                                                {p.pagado ? "Pagado" : "Pendiente"}
                                            </td>
                                            <td>
                                                <button
                                                    className={`px-3 py-1 rounded text-white ${p.pagado ? " bg-gray-400 cursor-not-allowed" : " w-17 bg-green-600 hover:bg-green-700"
                                                        }`}
                                                    disabled={p.pagado}
                                                    onClick={() => confirmarPago(p.id)}
                                                >
                                                    {p.pagado ? "Pagado" : "Pagar"}
                                                </button>
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