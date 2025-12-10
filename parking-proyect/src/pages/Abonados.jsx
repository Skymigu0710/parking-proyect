import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function Abonados() {
  const [abonados, setAbonados] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", placa: "", celular: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [abonadoSeleccionado, setAbonadoSeleccionado] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [monto, setMonto] = useState("");
  const [mes, setMes] = useState("");


  const openModal = (id) => {
    setAbonadoSeleccionado(id);
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };
  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => {
      setShowModal(false);
      setFechaInicio("");
      setFechaFin("");
      setMonto("");
    }, 300);
  };


  // Traer abonados desde backend
  const fetchAbonados = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/abonado/getAbonados", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
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
  const handleAbonado = async (e) => {
    if (!nuevo.nombre || !nuevo.placa || !nuevo.celular) {
      alert("Completa todos los campos");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/abonado/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevo.nombre,
          placa: nuevo.placa,
          celular: nuevo.celular,
        }),
      });

      if (!res.ok) throw new Error("Error registrando abonado");

      alert("Abonado registrado correctamente");

      // limpiar formulario
      setNuevo({ nombre: "", placa: "", celular: "" });

      // recargar tabla
      fetchAbonados();

    } catch (err) {
      console.error(err);
      alert("Hubo un error registrando el abonado");
    }
  };
  const afiliar = async (abonadoId) => {
    try {
      const res = await fetch("http://localhost:8080/api/abonado/afiliar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          abonadoId: abonadoSeleccionado,
          fechaInicio,
          fechaFin,
          mes,
          monto,
        }),
      });
      if (!res.ok) throw new Error("Error al afiliar");
      closeModal();
      await fetchAbonados(); // recargar tabla
    } catch (err) {
      console.error(err);
    }
  };
  const desafiliar = async (abonadoId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/abonado/desafiliar/${abonadoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (!res.ok) throw new Error("Error al desafiliar");
      alert("Desafiliado");
      await fetchAbonados(); // refrescar
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-4 mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Gestión de Abonados
        </h2>

        {/* Formulario de abonado  */}
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
            className="border p-2 rounded-md w-full mb-2 text-sm"
            onChange={(e) => setNuevo({ ...nuevo, placa: e.target.value })}
          />
          <input
            type="text"
            placeholder="Celular"
            value={nuevo.celular}
            onChange={(e) => setNuevo({ ...nuevo, celular: e.target.value })}
            className="border p-2 rounded-md w-full mb-2 text-sm"
          />
          <div className="flex justify-between">
            <button
              onClick={handleAbonado}
              className="bg-[#D62828] text-white px-4 py-2 rounded-lg text-sm "
            >
              Agregar
            </button>
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm "
              disabled
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Tabla de abonados */}
        <table className="w-full bg-white rounded-lg shadow-md text-sm " >
          <thead>
            <tr className="bg-black text-white">
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Placa</th>
              <th className="p-2 text-left">Celular</th>
              <th className="p-2 text-left">Accion</th>
            </tr>
          </thead>
          <tbody>
            {abonados.map((a) => {
              const afiliacionActiva = a.afiliaciones?.some(af => af.activa);

              return (
                <tr
                  key={a.id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/abonado/${a.id}`)}
                >
                  <td className="p-2">{a.nombre}</td>
                  <td className="p-2">{a.placa}</td>
                  <td className="p-2">{a.celular}</td>
                  <td className="p-2">
                    {afiliacionActiva ? (
                      <button
                        onClick={() => desafiliar(a.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Desafiliar
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal(a.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Afiliar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center transition-opacity duration-300 ease-in-out">
          <div className={`bg-white p-5 rounded-lg shadow-lg w-80 transform transition-all duration-300 ease-in-out
        ${animateModal ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <h2 className="text-lg  mb-4">Nueva Afiliación</h2>

            <label className="block mb-1 text-sm ">Fecha Inicio</label>
            <input
              type="date"
              className="border p-2 rounded-md w-full mb-3"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <label className="block mb-1 text-sm ">Fecha Fin</label>
            <input
              type="date"
              className="border p-2 rounded-md w-full mb-3"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <label className="block mb-1 text-sm font-semibold">Monto</label>
            <input
              type="number"
              className="border p-2 rounded-md w-full mb-4"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />

            <div className="flex justify-between mt-2">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-3 py-1 rounded-md"
              >
                Cancelar
              </button>

              <button
                onClick={afiliar}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Abonados;
