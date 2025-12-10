import { Car, Motorbike, Truck, CarTaxiFront } from "lucide-react";
import { useState } from "react";
import SpecialTicket from "./TableTicket";
export default function ParkingTicket() {


  const [pagoAdelantado, setPagoAdelantado] = useState(false);
  
  const handleCheckboxChange = (event) => {
    setPagoAdelantado(event.target.checked);
  };

  const [pagoCamiones, setPagoCamiones] = useState(false);
  const handleBottomChange = () => {
    setPagoCamiones(!pagoCamiones)
  }

  const [type, setType] = useState("");
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("");
  const [spaceCount, setSpaceCount] = useState("");
  const [descuento, setDescuento] = useState("");
  const [detalle, setDetalle] = useState("");
  const [horas, setHoras] = useState('');

  const handleTicket = async (e) => {
    e.preventDefault();


    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No se encontró token. El usuario no está autenticado.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/tickets/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          licensePlate: plate,
          color: color,
          type: type,
          spaceCount: spaceCount,
          pagoAdelantado: pagoAdelantado,
          horas: pagoAdelantado ? Number(horas) : null,
          exitTime: pagoAdelantado ? (horas) : null,
          discountAmount: pagoAdelantado ? Number(descuento) : 0,
          detalle: detalle
        })
      });
    } catch (error) {
      console.error(error);
    }

  }
  return (
    <form className="bg-white rounded-xl shadow-md p-4 max-w-sm mx-auto" onSubmit={handleTicket}>
      <h2 className="text-gray-700 font-semibold mb-3">TICKET DE PARKING</h2>
      <div className="flex justify-between">
        <div className="h-auto">
          <h1 className="text-xs text-gray-600">PLACA</h1>
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="w-auto border border-gray-300 rounded-lg p-2 mt-1 mb-3 text-sm"
            placeholder="Ingrese la placa"
          />
        </div>
        <div className="grid grid-cols-2 gap-1 w-auto">
          <button className={`bg-[#D62828] text-white px-2 py-2 rounded-lg text-sm ${type === "CAR" ? "opacity-80 ring-2 ring-white" : ""}`}
            type="button"
            onClick={() => setType("CAR")}>
            <Car strokeWidth={1} />
          </button>
          <button className={`bg-[#D62828] text-white px-2 py-2 rounded-lg text-sm ${type === "MOTORCYCLE" ? "opacity-80 ring-2 ring-white" : ""}`}
            type="button"
            onClick={() => setType("MOTORCYCLE")}>
            <Motorbike strokeWidth={1} />
          </button>
          <button className={`bg-[#D62828] text-white px-2 py-2 rounded-lg text-sm ${type === "CAMIONETA" ? "opacity-80 ring-2 ring-white" : ""}`}
            type="button"
            onClick={() => setType("CAMIONETA")}>
            <CarTaxiFront strokeWidth={1} />
          </button>
          <button className="bg-[#D62828] text-white px-2 py-2 rounded-lg text-sm"
            type="button"
            onClick={() => {
              handleBottomChange(); // hace el cambio visual o funcional
              setType("LARGE");     // cambia el tipo
            }}>
            <Truck strokeWidth={1} />
          </button>
        </div>
      </div>
      <section className={`flex flex-col w-20 ml-auto pt-2 overflow-hidden transition-all duration-500 ease-in-out ${pagoCamiones ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}>
        <h1>Espacios</h1>
        <input type="text" className=" w-full border border-gray-300" />
      </section>
      <div className="flex items-center gap-2 mb-3">
        {[
          { name: "Rojo", value: "#D62828" },
          { name: "Negro", value: "black" },
          { name: "Azul", value: "#041031ff" },
          { name: "Gris", value: "#dcdcdcff" }
        ].map((c) => (
          <div
            key={c.value}
            onClick={() => setColor(c.value)}
            style={{ backgroundColor: c.value }}
            className={`w-5 h-5 rounded-full cursor-pointer border border-gray-300 transition-transform duration-150 ${color === c.value ? "ring-2 ring-white scale-110" : ""
              }`}
          />
        ))}
      </div>

      <div className="flex flex-col tems-end justify-between mb-3">
        <section className="Pago_adelantado">
          <label className="flex items-center gap-2 text-sm text-gray-600 pb-3">
            <input
              type="checkbox"
              checked={pagoAdelantado}
              onChange={handleCheckboxChange}
            />
            Pago adelantado
          </label>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${pagoAdelantado ? "max-h-30 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <h1>Horas</h1>
            <input
              type="text"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              className="w-auto border border-gray-300"
            />
            <h1>*Descuento</h1>
            <input
              type="text"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className="w-auto border border-gray-300"
            />
          </div>
        </section>
        <div className="pb-3">
          <h1>Detalle</h1>
          <input type="text"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            className="w-full border border-gray-300 py-3" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 pb-3">
          <input
            type="checkbox"
          />
          Ticket especial
          <input type="text" placeholder="Monto" className="border border-gray-300 p-1 w-20" />
        </label>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm mt-auto">
          TICKET
        </button>
      </div>
    </form>

  );
}
