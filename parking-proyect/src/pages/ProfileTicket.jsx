import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TicketDetail() {
    const { id } = useParams(); // viene de la URL
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagar, setPagar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No hay sesión activa. Inicia sesión nuevamente.");
            setLoading(false);
            return;
        }

        const fetchTicket = async () => {
            try {
                const res = await fetch(`http://192.168.18.24:8080/api/tickets/${id}`, {
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
                setTicket(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    const handlePay = async () => {
        const token = localStorage.getItem("token");

        if (!ticket || ticket.status === "CLOSED") return;

        try {
            setPagar(true);
            const res = await fetch(`http://192.168.18.24:8080/api/tickets/exit/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("No se pudo procesar el pago");

            const updatedTicket = await res.json();
            setTicket(updatedTicket);
            alert(" Ticket pagado correctamente");
        } catch (err) {
            alert(" Error: " + err.message);
        } finally {
            setPagar(false);
        }
    };


    //Estado de carga
    if (loading) {
        return <p className="text-center mt-4 text-gray-600">Cargando ticket...</p>;
    }

    //error
    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-2">Error</h2>
                <p>{error}</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">

            <div className=" relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-[90%]">

                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-100 rounded-full transform -translate-y-1/2 shadow-inner"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-100 rounded-full transform -translate-y-1/2 shadow-inner"></div>

                <h2 className="text-2xl font-bold mb-2 text-[#D62828]">Detalles del Ticket</h2>
                <div className="border-t border-dashed border-gray-400 my-4"></div>
                <div className="space-y-2">
                    <p><strong>ID:</strong> {ticket.id}</p>
                    <p><strong>Placa:</strong> {ticket.licensePlate}</p>
                    <p><strong>Tipo:</strong> {ticket.type}</p>
                    <p><strong>Color:</strong> {ticket.color}</p>
                    <p><strong>Hora de ingreso:</strong> {ticket.entryTime}</p>
                    <p><strong>Hora de salida:</strong> {ticket.exitTime ?? "En curso"}</p>
                    <p><strong>Monto total:</strong> {ticket.totalAmount ?? "—"}</p>
                    <p><strong>Estado:</strong> {ticket.status}</p>
                    <p><strong>Detalle:</strong> {ticket.detalle}</p>
                    <p><strong>Creado por:</strong> {ticket.createdBy}</p>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handlePay}
                        disabled={ticket.status === "CLOSED" || pagar}
                        className={`px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-blue-600 transition ${ticket.status === "Pagado"
                            ? "bg-green-500 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    > {pagar
                        ? "Procesando..."
                        : ticket.status === "CLOSED"
                            ? "Pagado"
                            : "Pagar"}
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}
