export default function TicketPreview({ ticket }) {
  if (!ticket) return null;

  return (
    <div style={{ border: "1px solid #000", padding: "15px", width: "250px", fontFamily: "Arial" }}>
      <h2>Ticket #{ticket.id}</h2>
      <p><strong>Placa:</strong> {ticket.licensePlate}</p>
      <p><strong>Tipo vehículo:</strong> {ticket.type}</p>
      <p><strong>Hora de entrada:</strong> {ticket.entryTime}</p>
      <p><strong>Detalle:</strong> {ticket.detalle}</p>

      {ticket.qrBase64 && (
        <img 
          src={`data:image/png;base64,${ticket.qrBase64}`} 
          alt="QR del ticket" 
          style={{ width: "150px", marginTop: "10px" }}
        />
      )}
    </div>
  );
}
