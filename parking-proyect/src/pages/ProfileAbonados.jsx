import Header from "../components/Header";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";

export default function Profile() {
    const { id } = useParams();
    const [abonado, setAbonado] = useState(null);

    useEffect(() => {
        // Llamada al backend
        const fetchAbonado = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/abonado/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAbonado(data);
                }
            } catch (err) {
                console.error("Error al obtener datos del abonado", err);
            }
        };
        fetchAbonado();
    }, [id]);

    if (!abonado) {
        return <div className="p-10 text-center text-gray-500">Cargando...</div>;
    }



    return (
        <div className="min-h-screen bg-gray-200">
            <section>
                <Header />
            </section>

            <div className="flex flex-col p-10 gap-3">
                <label className="text-black">Nombre</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="nombre"
                        value={profile.nombre}
                        onChange={handleChange}
                        className="border rounded-lg p-3 text-black"
                    />
                ) : (
                    <label className="border rounded-lg p-3 text-black">
                        {profile.nombre}
                    </label>
                )}

                <label className="text-black">Correo electrónico</label>
                {isEditing ? (
                    <input
                        type="email"
                        name="correo"
                        value={profile.correo}
                        onChange={handleChange}
                        className="border rounded-lg p-3 text-black"
                    />
                ) : (
                    <label className="border rounded-lg p-3 text-black">
                        {profile.correo}
                    </label>
                )}

                <label className="text-black">Contraseña</label>
                {isEditing ? (
                    <input
                        type="password"
                        name="contraseña"
                        value={profile.contraseña}
                        onChange={handleChange}
                        className="border rounded-lg p-3 text-black flex justify-between"
                    />
                ) : (
                    <label className="border rounded-lg p-3 text-black flex justify-between">
                        {profile.contraseña} <Eye />
                    </label>
                )}

                <label className="text-black">Teléfono</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="telefono"
                        value={profile.telefono}
                        onChange={handleChange}
                        className="border rounded-lg p-3 text-black flex justify-between"
                    />
                ) : (
                    <label className="border rounded-lg p-3 text-black flex justify-between">
                        {profile.telefono}
                    </label>
                )}

                {/* Botones */}
                {isEditing ? (
                    <div className="flex gap-3">
                        <button

                            className="border border-black rounded-lg p-3 bg-black text-white flex-1"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="border border-gray-400 rounded-lg p-3 bg-gray-300 text-black flex-1"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="border border-black rounded-lg p-3 bg-black text-white"
                    >
                        Modificar
                    </button>
                )}
            </div>
        </div>
    );
}