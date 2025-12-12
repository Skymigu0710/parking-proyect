import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts";

const DailyGraphic = () => {
  const [data, setData] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("2025-11-01");
  const [fechaFin, setFechaFin] = useState("2025-12-12");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = `http://192.168.18.24:8080/api/tickets/ingresos/diarios?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
      }

      const result = await response.json();

      // Convertimos a array y ordenamos por fecha
      const chartData = Object.keys(result)
        .map(key => ({ date: key, amount: result[key] }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setData(chartData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fechaInicio, fechaFin]); // Refresca cada vez que cambie el rango

  return (
    <div>
      <h2>Ingresos diarios</h2>

      {/* Selección de fechas */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Desde:{" "}
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "20px" }}>
          Hasta:{" "}
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>
      </div>

      {/* Contenedor con scroll horizontal si hay muchas fechas */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <ResponsiveContainer width={Math.max(data.length * 50, 800)} height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={10} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Brush dataKey="date" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyGraphic;
