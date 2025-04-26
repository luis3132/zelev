"use client";

import FiltersComponent from "@/components/main/filters";
import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Categoria } from "@/lib/types/types";
import { useEffect, useState } from "react";

export default function Home() {
    const [token, setToken] = useState<string>("");
    const [categories, setCategories] = useState<Categoria[]>([]);
    const { ReloadContext, loading, loadingUpdate, reload, update } = useReload();
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const [selectedCategories, setSelectedCategories] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchCategorias = async () => {
            const { data, status } = await Get("/api/categoria/list", token);
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

    const categoriasPadre = categories.filter((categoria) => {
        return categoria.subcategoria === "";
    });

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => ({
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleSelectCategory = (categoryId: number) => {
        setSelectedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    }

    return (
        <ReloadContext.Provider value={{ reload, update, loadingUpdate, loading }}>
            <div className="w-full h-full md:flex">
                <FiltersComponent toggleCategory={toggleCategory} handleSelectCategory={handleSelectCategory} expandedCategories={expandedCategories} selectedCategories={selectedCategories} categoriasPadre={categoriasPadre} categories={categories} />

                <div className="md:w-4/5 w-full h-min p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Example of an article card */}
                        <div className="border rounded-lg p-4 shadow-md">
                            <h2 className="font-bold text-lg mb-2">Artículo 1</h2>
                            <p className="text-sm text-gray-600 mb-4">Descripción breve del artículo.</p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded">Acción</button>
                        </div>
                        <div className="border rounded-lg p-4 shadow-md">
                            <h2 className="font-bold text-lg mb-2">Artículo 2</h2>
                            <p className="text-sm text-gray-600 mb-4">Descripción breve del artículo.</p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded">Acción</button>
                        </div>
                        <div className="border rounded-lg p-4 shadow-md">
                            <h2 className="font-bold text-lg mb-2">Artículo 3</h2>
                            <p className="text-sm text-gray-600 mb-4">Descripción breve del artículo.</p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded">Acción</button>
                        </div>
                    </div>
                </div>
            </div>
        </ReloadContext.Provider>
    )
}