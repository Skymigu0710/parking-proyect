import { Car, Motorbike, Truck, CarTaxiFront } from "lucide-react";
import { useState, useRef } from "react";
import TicketPreview from "../components/TicketPreview";

export default function ParkingTicket() {


  const [pagoAdelantado, setPagoAdelantado] = useState(false);
  const [type, setType] = useState("");
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("");
  const [spaceCount, setSpaceCount] = useState("");
  const [descuento, setDescuento] = useState("");
  const [detalle, setDetalle] = useState("");
  const [horas, setHoras] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [isSpecialTicket, setIsSpecialTicket] = useState(false);
  const [ticketGenerado, setTicketGenerado] = useState(null);
  const ticketRef = useRef();



  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setPagoAdelantado(checked);
  };
  const [pagoCamiones, setPagoCamiones] = useState(false);
  const handleBottomChange = () => {
    setPagoCamiones(!pagoCamiones)
  }
  const resetForm = () => {
    setPlate("");
    setColor("");
    setType("");
    setSpaceCount("");
    setPagoAdelantado(false);
    setHoras("");
    setDescuento("");
    setDetalle("");
    setIsSpecialTicket(false);
    setManualAmount("");
  };

  const handleTicket = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No se encontró token. El usuario no está autenticado.");
      return;
    }

    let ticketData = null;

    try {
      const url = isSpecialTicket
        ? "http://192.168.18.24:8080/api/tickets/special"
        : "http://192.168.18.24:8080/api/tickets/entry";

      const body = isSpecialTicket
        ? {
          licensePlate: plate,
          color: color,
          type: type,
          detalle: detalle,
          manualAmount: manualAmount
        }
        : {
          licensePlate: plate,
          color: color,
          type: type,
          spaceCount: spaceCount,
          pagoAdelantado: pagoAdelantado,
          horas: pagoAdelantado ? Number(horas) : null,
          exitTime: pagoAdelantado ? horas : null,
          discountAmount: pagoAdelantado ? Number(descuento) : 0,
          detalle: detalle
        };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creando ticket:", errorData);
        return;
      }

      ticketData = await response.json();
      console.log("Ticket creado:", ticketData);

      // Guardamos el ticket para el preview (y el QR)
      setTicketGenerado(ticketData);

      // Imprimir ticket automáticamente
      setTimeout(() => {
        if (ticketRef.current) {
          const printContents = ticketRef.current.innerHTML;
          const printWindow = window.open('', '', 'width=300,height=600');
          printWindow.document.write(`
          <html>
            <head>
              <title>Ticket</title>
              <style>
                @media print {
                  @page { margin: 0; size: 80mm auto; }
                  body { margin: 0; padding: 5mm; font-family: monospace; }
                }
                body { font-family: monospace; margin: 0; padding: 5px; width: 80mm; }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();

          // Limpiar formulario después de imprimir
          resetForm();
          setTicketGenerado(null); // ocultar TicketPreview
        }
      }, 300);

    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };



  return (

    <>

      <form id="ticketForm" className="bg-white rounded-xl shadow-md p-4 max-w-sm mx-auto" onSubmit={handleTicket}>
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
          <input type="text"
            value={spaceCount}
            onChange={(e) => setSpaceCount(e.target.value)}
            className=" w-full border border-gray-300" />
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
              checked={isSpecialTicket}
              onChange={(e) => setIsSpecialTicket(e.target.checked)}
            />
            Ticket especial
            <input type="text"
              placeholder="Monto"
              value={manualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              className="border border-gray-300 p-1 w-20" />
          </label>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm mt-auto">
            TICKET
          </button>
        </div>
      </form>
      {ticketGenerado && (
        <div style={{ display: "none" }}>
          <TicketPreview ref={ticketRef} ticket={ticketGenerado} />
        </div>
      )}

    </>
  )
}
