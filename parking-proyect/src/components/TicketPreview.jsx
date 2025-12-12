import React, { useEffect, useRef, forwardRef } from "react";

const TicketPreview = forwardRef(({ ticket }, ref) => {
  if (!ticket) return null;

  return (
    <div ref={ref} style={{
      border: "none",
      padding: "5px",
      width: "80mm",
      fontFamily: "monospace",
      margin: "0 auto"
    }}>
      <h2>Ticket #{ticket.id}</h2>
      <p><strong>Placa:</strong> {ticket.licensePlate}</p>
      <p><strong>Tipo vehículo:</strong> {ticket.type}</p>
      <p><strong>Hora de entrada:</strong> {ticket.entryTime}</p>
      <p><strong>Detalle:</strong> {ticket.detalle}</p>
      <hr />
      {ticket.qrBase64 && (
        <img src={`data:image/png;base64,${ticket.qrBase64}`} alt="QR del ticket" />
      )}
      <hr />
      <p style={{ textAlign: "center", fontSize: "10px" }}>¡Gracias por su visita!</p>
    </div>
  );
});

export default TicketPreview;
