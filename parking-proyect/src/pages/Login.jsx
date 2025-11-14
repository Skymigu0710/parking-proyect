import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // hook para redireccionar

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dash");
      } else {
        setMessage("Error: Credenciales incorrectas");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al conectarse al servidor");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión
        </h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="usuario"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D62828] text-white py-2 rounded-lg text-sm font-semibold hover:bg-black transition-colors">
            Ingresar
          </button>
          {message && <p className="mt-4 text-center">{message}</p>}
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Best Parking{" "}
        </p>
      </div>
    </div>
  );
}

