"use client";

import BotonAnadir from "@/components/categoria/botonAnadir";
import CategoriaItem from "@/components/categoria/CategoriaItem";
import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Categoria } from "@/lib/types/types";
import { useEffect, useState } from "react";

export default function Home() {

    const [categories, setCategories] = useState<Categoria[]>([]);
    const [queryCategoria, setQueryCategoria] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const { reload, update, ReloadContext, loading, loadingUpdate } = useReload();

    useEffect(() => {
        const fetchCategorias = async () => {
            const { data, status } = await Get("/api/categoria/list/categoria", token);
            if (status === 200) {
                setCategories(data);
            } else {
                console.error("Error al traer las categorias");
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
            fetchCategorias();
        }
    }, [reload, token]);

    const filterCategoria = categories.filter((categoria) => {
        return categoria.categoria.toLowerCase().includes(queryCategoria.toLowerCase());
    });

    return (
        <ReloadContext.Provider value={{ reload, update, loadingUpdate, loading }}>
            <main className="w-full ">
                <div className="w-full">
                    <h1 className="text-3xl font-bold text-center text-white max-md:pt-10">Categorias</h1>
                </div>
                {categories.length > 0 && (
                    <>
                        <div className="w-full md:px-20 px-10 my-5">
                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                className="w-full p-2 rounded-lg border border-gray-300"
                                onChange={(e) => setQueryCategoria(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:px-20">
                            <div className="flex flex-wrap gap-4 justify-center mt-5 h-[650px] overflow-y-auto">
                                {filterCategoria.map((categoria) => (
                                    <CategoriaItem categoria={categoria} key={categoria.idCategoria} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {categories.length === 0 && (
                    <div className="text-center text-white mt-5">
                        <p>No hay categorías disponibles.</p>
                    </div>
                )}
                <BotonAnadir categoria={true} />
            </main>
        </ReloadContext.Provider>
    )
}