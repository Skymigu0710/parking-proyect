import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function TableTicket() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/tickets/getTicket", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error("error al cargar el ticket", err));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Id</th>
            <th className="px-4 py-2 text-left">Placa</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Hora. Ingreso</th>
            <th className="px-4 py-2 text-left">Hora. Salida</th>
            <th className="px-4 py-2 text-left">Monto</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Usuario</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-blue-100 transition-colors"  onClick={() => navigate(`/ticket/${t.id}`)}>
              <td className="border-t px-4 py-2">{t.id}</td>
              <td className="border-t px-4 py-2">{t.licensePlate}</td>
              <td className="border-t px-4 py-2">{t.type}</td>
              <td className="border-t px-4 py-2">{t.entryTime}</td>
              <td className="border-t px-4 py-2">{t.exitTime}</td>
              <td className="border-t px-4 py-2">{t.totalAmount}</td>
              <td className="border-t px-4 py-2">{t.status}</td>
              <td className="border-t px-4 py-2">{t.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
