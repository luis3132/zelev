"use client";

import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Articulo } from "@/lib/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const id = useParams().id;

    const [token, setToken] = useState<string>("");
    const [articulo, setArticulo] = useState<Articulo>();
    const { ReloadContext, loading, loadingUpdate, reload, update } = useReload();

    const fetchArticulo = async () => {
        const { data, status } = await Get(`/api/articulo/${id}`, token);
        if (status === 200) {
            setArticulo(data);
        } else {
            console.error("Error al traer el articulo");
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined" && token === "") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        if (token !== "") {
            fetchArticulo();
        }
    }, [id, token]);

    return (
        <ReloadContext.Provider value={{ reload, update, loading, loadingUpdate }}>
            <main>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Articulo</h1>
                    {articulo && (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-bold">{articulo.nombre}</h2>
                            <p>{articulo.descripcion}</p>
                            <p>Precio: {articulo.impuesto}</p>
                            <p>Stock: {articulo.descripcion}</p>
                        </div>
                    )}
                </div>
            </main>
        </ReloadContext.Provider>
    )
}