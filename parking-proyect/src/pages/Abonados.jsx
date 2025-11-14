import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
function Abonados() {
  const [abonados, setAbonados] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", placa: "" });

  const handleAdd = () => {
    if (!nuevo.nombre || !nuevo.placa) return;
    const nuevoAbonado = {
      id: Date.now(),
      nombre: nuevo.nombre,
      placa: nuevo.placa,
      estado: "Activo",
    };
    setAbonados([...abonados, nuevoAbonado]);
    setNuevo({ nombre: "", placa: "" });
  };

  const handleDelete = (id) => {
    setAbonados(abonados.filter((a) => a.id !== id));
  };


const navigate = useNavigate();

  // Navegar al perfil del abonado
  const handleRowClick = (id) => {
    navigate(`/abonado/${id}`);
  };
  return (
    <div className="min-h-screen bg-gray-100">

      <Header />

      <div className="p-4 mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Gestión de Abonados
        </h2>

        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium mb-2">Abonado</h3>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            className="border p-2 rounded-md w-full mb-2 text-sm"
          />
          <input
            type="text"
            placeholder="Placa"
            value={nuevo.placa}
            onChange={(e) => setNuevo({ ...nuevo, placa: e.target.value })}
            className="border p-2 rounded-md w-full mb-2 text-sm"
          />
          <input
            type="text"
            placeholder="Celular"
            value={nuevo.placa}
            onChange={(e) => setNuevo({ ...nuevo, placa: e.target.value })}
            className="border p-2 rounded-md w-full mb-2 text-sm"
          />
           <input
            type="text"
            placeholder="Monto mensual"
            value={nuevo.placa}
            onChange={(e) => setNuevo({ ...nuevo, placa: e.target.value })}
            className="border p-2 rounded-md w-full mb-2 text-sm"
          />
           <input
            type="date"
            placeholder="Fecha de pago"
            value={nuevo.placa}
            onChange={(e) => setNuevo({ ...nuevo, placa: e.target.value })}
            className="border p-2 rounded-md w-full mb-2 text-sm"
          />
          <div className="flex justify-between">
              <button
            onClick={handleAdd}
            className="bg-[#D62828] text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
          >
            Agregar
          </button>
          <button
             className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-black"
          >
            Buscar
          </button>
          </div>
        
        </div>

        <table className="w-full bg-white rounded-lg shadow-md text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Placa</th>
              <th className="p-2 text-left">Estado</th>
              <th className="p-2 text-center">Accion</th>
            </tr>
          </thead>
          <tbody>
            {abonados.map((a) => (
              <tr key={a.id} onClick={() => handleRowClick(a.id)} className="border-b">
                <td className="p-2">{a.nombre}</td>
                <td className="p-2">{a.placa}</td>
                <td className="p-2">{a.estado}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Abonados;