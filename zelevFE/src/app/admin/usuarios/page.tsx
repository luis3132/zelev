"use client";

import BotonAnadir from "@/components/usuarios/botonAnadir";
import UsuarioCard from "@/components/usuarios/usuario";
import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Usuario } from "@/lib/types/types";
import { useEffect, useState } from "react";

export default function Home() {
    const [token, setToken] = useState<string>("");
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [queryUsuario, setQueryUsuario] = useState<string>("");

    const { update, ReloadContext, loading, loadingUpdate, reload } = useReload();

    useEffect(() => {
        const fetchUsuarios = async () => {
            const { data, status } = await Get("/api/usuario/list", token);
            if (status === 200) {
                setUsuarios(data);
            } else {
                console.error("Error al traer los usuarios");
            }
        }
        if (typeof window !== "undefined") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        if (token !== "") {
            fetchUsuarios();
        }
    }, [reload, token]);

    const filterUsuario = usuarios.filter((usuario) => usuario.nombres.toLowerCase().includes(queryUsuario.toLowerCase())
        || usuario.email.toLowerCase().includes(queryUsuario.toLowerCase())
        || usuario.cedula.toLowerCase().includes(queryUsuario.toLowerCase())
        || usuario.apellidos.toLowerCase().includes(queryUsuario.toLowerCase()));

    return (
        <ReloadContext.Provider value={{ reload, update, loadingUpdate, loading }}>
            <main className="w-full h-full flex flex-col items-center">
                <div className="w-full">
                    <h1 className="text-3xl font-bold text-center text-white max-md:pt-10">Usuarios</h1>
                </div>
                {usuarios.length > 1 && (
                    <>
                        <div className="w-full md:px-20 px-10 my-5">
                            <input
                                type="text"
                                placeholder="Buscar usuario..."
                                className="w-full p-2 rounded-lg border border-gray-300"
                                onChange={(e) => setQueryUsuario(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:px-20">
                            <div className="flex flex-wrap gap-4 justify-center mt-5 h-[650px] overflow-y-auto">
                                {filterUsuario.map((usuario) => (
                                    <UsuarioCard key={usuario.cedula} usuario={usuario} token={token} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {usuarios.length === 1 && (
                    <div className="text-center text-white mt-5">
                        <p>No hay Usuarios disponibles.</p>
                    </div>
                )}
                <BotonAnadir />
            </main>
        </ReloadContext.Provider>
    )
}