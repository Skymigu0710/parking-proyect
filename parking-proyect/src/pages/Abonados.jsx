import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function Abonados() {
  const [abonados, setAbonados] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", placa: "", celular: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Traer abonados desde backend
  const fetchAbonados = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/abonado/getAbonados", {
        headers: { "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json" },
      });
      const data = await res.json();
      setAbonados(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAbonados();
  }, []);

  // Click en fila para ir al perfil
  /*const handleRowClick = (id) => {
    navigate(`/abonado/${id}`);
  };*/

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-4 mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Gestión de Abonados
        </h2>

        {/* Formulario de abonado - solo placeholder */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium mb-2">Abonado</h3>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevo.nombre}
            className="border p-2 rounded-md w-full mb-2 text-sm"
            readOnly
          />
          <input
            type="text"
            placeholder="Placa"
            value={nuevo.placa}
            className="border p-2 rounded-md w-full mb-2 text-sm"
            readOnly
          />
          <input
            type="text"
            placeholder="Celular"
            value={nuevo.celular}
            className="border p-2 rounded-md w-full mb-2 text-sm"
            readOnly
          />
          <div className="flex justify-between">
            <button
              className="bg-[#D62828] text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed"
              disabled
            >
              Agregar
            </button>
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed"
              disabled
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Tabla de abonados */}
        <table className="w-full bg-white rounded-lg shadow-md text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Placa</th>
              <th className="p-2 text-left">Celular</th>
              <th className="p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {abonados.map((a) => (
              <tr
                key={a.id}
                className="border-b hover:bg-gray-100 cursor-pointer"
              >
                <td className="p-2">{a.nombre}</td>
                <td className="p-2">{a.placa}</td>
                <td className="p-2">{a.celular}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Abonados;
