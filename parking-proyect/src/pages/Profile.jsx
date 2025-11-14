import Header from "../components/Header";
import { CircleUserRound, Edit, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function () {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const handleLogout = () => {
        // Eliminar datos de la sesión actuaall
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");

        // Redirigir al login
        navigate("/");
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const userData = localStorage.getItem("userData");

        if (!isLoggedIn || !userData) {
            navigate("/"); // si no hay sesión, redirige al login
            return;
        }
        setUser(JSON.parse(userData)); // carga datos del usuario
    }, [navigate]);
    if (!user) return null; // evita renderizar antes de cargar
    return (
        <div className="min-h-screen bg-[#D62828]">
            <section><Header /></section>
            <div className="flex items-center justify-center bg-white w-full h-40 gap-3 ">
                <div className="flex justify-center items-center bg-gray-300 w-25 h-25 border border-gray-400 rounded-full "><CircleUserRound size={50} /></div>
                <div>
                    <label>{user.username}</label>
                    <h1>{user.roles}</h1>
                    <Edit size={20} />
                </div>
            </div>
            <div className=" flex flex-col p-10 gap-3">
                <label className="text-white">Nombre</label>
                <label className="border rounded-lg p-3 text-white">{user.name}</label>
                <label className="text-white">Correo electrónico</label>
                <label className="border rounded-lg p-3 text-white">{user.correo}</label>
                <label className="text-white">Contraseña</label>
                <div className="flex justify-between items-center border rounded-lg p-3 text-white ">
                    <span className="truncate">{showPassword ? user.password : "••••••••"}</span>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-gray-300 hover:text-white"
                    >
                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff />}
                    </button>
                </div>
                <label className="text-white">Direccion</label>
                <label className="border rounded-lg p-3 text-white flex justify-between ">{user.direccion}</label>
                <button  onClick={handleLogout} className="border border-black rounded-lg p-3 bg-black text-white "> Exit </button>
            </div>

        </div>
    );
}