"use client";

import Inventario from "@/components/inventario/inventario";
import FiltersComponent from "@/components/main/filters";
import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Articulo, Categoria } from "@/lib/types/types";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [token, setToken] = useState<string>("");
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [page, setPage] = useState<number>(0);
    const { ReloadContext, loading, loadingUpdate, reload, update } = useReload();
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observerTarget = useRef(null);
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const [selectedCategories, setSelectedCategories] = useState<Record<number, boolean>>({});

    const fetchCategorias = async () => {
        const { data, status } = await Get("/api/categoria/list", token);
        if (status === 200) {
            setCategories(data);
        } else {
            console.error("Error al traer las categorias");
        }
    }
    const fetchArticulos = async () => {
        const { data, status } = await Get(`/api/articulo/list/${page}/${10}`, token);
        if (status === 200) {
            setArticulos(prev => [...prev, ...data]);
            setPage(prev => prev + 1);
            if (data.length < 10) {
                setHasMore(false);
            }
        } else {
            console.error("Error al traer los articulos");
        }
    }

    useEffect(() => {
        loadingUpdate(true);
        if (typeof window !== "undefined" && token === "") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        if (token !== "") {
            if (categories.length === 0) {
                fetchCategorias();
            }
            fetchArticulos();
            loadingUpdate(false);
        }
    }, [reload, token]);

    useEffect(() => {
        if (page < 1) {
            return;
        }
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchArticulos();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, articulos]);

    const categoriasPadre = categories.filter((categoria) => {
        return categoria.subcategoria === "";
    });

    const articulosFiltrados = articulos.filter((articulo) => {
        const idCategoria = Object.entries(selectedCategories)
            .filter(([_, value]) => value)
            .map(([key, _]) => parseInt(key));
        if (idCategoria.length === 0) {
            return true;
        }
        return articulo.categorias.some((categoria) => {
            return idCategoria.includes(categoria.idCategoria);
        });
    });

    console.log("articulos filtrados", articulosFiltrados);

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
                <FiltersComponent toggleCategory={toggleCategory} handleSelectCategory={handleSelectCategory} expandedCategories={expandedCategories} selectedCategories={selectedCategories} categoriasPadre={categoriasPadre} categories={categories} showAnadir={true} />

                <main className="md:w-4/5 w-full max-h-full overflow-y-scroll p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {articulosFiltrados.map((articulo) => (
                            <Inventario key={articulo.idArticulo} articulo={articulo} />
                        ))}
                    </div>
                    <div ref={observerTarget} className="h-10 my-4">
                        {loading && (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                        {!hasMore && (
                            <p className="text-center text-gray-500">No hay más elementos para mostrar</p>
                        )}
                    </div>
                </main>
            </div>
        </ReloadContext.Provider>
    )
}