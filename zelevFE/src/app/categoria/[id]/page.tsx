"use client";

import InventarioUser from "@/components/inventario/inventarioUser";
import CarritoComponent from "@/components/main/carrito";
import FiltersComponent from "@/components/main/filters";
import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Articulo, Carrito, Categoria } from "@/lib/types/types";
import { useParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
    const { id } = useParams();
    const [idCategoria, setIdCategoria] = useState<number>(1);
    const [token, setToken] = useState<string>("");
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [carrito, setCarrito] = useState<Carrito[]>([]);
    const [page, setPage] = useState<number>(0);
    const { ReloadContext, loading, loadingUpdate, reload, update } = useReload();
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observerTarget = useRef(null);
    const [nombreQuery, setNombreQuery] = useState<string>("");
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const [selectedCategories, setSelectedCategories] = useState<Record<number, boolean>>({});

    const fetchCategorias = async () => {
        const { data, status } = await Get("/api/categoria/list", token ? token : "");
        if (status === 200) {
            setCategories(data);
        } else {
            console.error("Error al traer las categorias");
        }
    }
    const fetchFirtsArticulos = async (categoria: number) => {
        const { data, status } = await Get(`/api/articulo/${categoria}/list/${0}/${process.env.NEXT_PUBLIC_SIZE}`, "");
        if (status === 200) {
            setArticulos(data);
            setPage(1);
        } else {
            console.error("Error al traer los articulos");
        }
    }
    const [isFetching, setIsFetching] = useState(false);

    const fetchArticulos = useCallback(async (categoria: number) => {
        if (isFetching || !hasMore) return;

        setIsFetching(true);
        try {
            const { data, status } = await Get(`/api/articulo/${categoria}/list/${page}/${process.env.NEXT_PUBLIC_SIZE}`, "");

            if (status === 200) {
                const articulos: Articulo[] = data;
                setArticulos(prev => {
                    // Evita duplicados usando un Set
                    const existingIds = new Set(prev.map(item => item.idArticulo));
                    const newItems = articulos.filter(item => !existingIds.has(item.idArticulo));
                    return [...prev, ...newItems];
                });

                setPage(prev => prev + 1);
                setHasMore(data.length >= Number(process.env.NEXT_PUBLIC_SIZE));
            }
        } catch (error) {
            console.error("Error al traer los articulos:", error);
        } finally {
            setIsFetching(false);
        }
    }, [page, isFetching, hasMore]);

    // Efecto para infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !isFetching && hasMore) {
                    fetchArticulos(idCategoria);
                }
            },
            { threshold: 1.0 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [fetchArticulos, isFetching, hasMore, idCategoria]); // Elimina articulos de las dependencias

    useEffect(() => {
        if (typeof window !== "undefined" && token === "") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
            const storedCarrito = localStorage.getItem("carrito");
            if (storedCarrito) {
                setCarrito(JSON.parse(storedCarrito));
            }
        }
        if (id) {
            if (categories.length === 0) {
                fetchCategorias();
            }
            if (id === "hombre") {
                fetchFirtsArticulos(62);
                setIdCategoria(62);
            }
            if (id === "mujer") {
                fetchFirtsArticulos(61);
                setIdCategoria(61);
            }
            if (id === "nino") {
                fetchFirtsArticulos(64);
                setIdCategoria(64);
            }
            if (id === "outlet") {
                fetchFirtsArticulos(90);
                setIdCategoria(90);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, token, id]);

    const categoriasPadre = categories.filter((categoria) => {
        return categoria.subcategoria === "";
    });

    const articulosFiltrados = articulos.filter((articulo) => {
        const idCategoria = Object.entries(selectedCategories)
            .filter(([, value]) => value)
            .map(([key]) => parseInt(key));
        const categoriaSelect = articulo.categorias.filter((categoria) => {
            return idCategoria.includes(categoria.idCategoria);
        });
        if (idCategoria.length === 0) {
            if (nombreQuery === "") {
                return true;
            }
            const nombreMatch = articulo.nombre.toLowerCase().includes(nombreQuery.toLowerCase());
            return nombreMatch;
        }
        if (nombreQuery === "") {
            return articulo.categorias.some((categoria) => {
                return categoriaSelect.some((cat) => {
                    return cat.idCategoria === categoria.idCategoria || cat.subcategoria === categoria.subcategoria || cat.categoria === categoria.categoria;
                });
            });
        }
        const nombreMatch = articulo.nombre.toLowerCase().includes(nombreQuery.toLowerCase());
        const categoriaMatch = articulo.categorias.some((categoria) => {
            return categoriaSelect.some((cat) => {
                return cat.idCategoria === categoria.idCategoria || cat.subcategoria === categoria.subcategoria || cat.categoria === categoria.categoria;
            });
        });
        return nombreMatch && categoriaMatch;
    });

    const handleNombreQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNombreQuery(e.target.value);
    };

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

    const handleSetCarrito = (carrito: Carrito[]) => {
        localStorage.removeItem("carrito");
        setCarrito(carrito);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    return (
        <ReloadContext.Provider value={{ reload, update, loadingUpdate, loading }}>
            <div className="w-full h-full md:flex">
                <FiltersComponent toggleCategory={toggleCategory} handleSelectCategory={handleSelectCategory} expandedCategories={expandedCategories} selectedCategories={selectedCategories} categoriasPadre={categoriasPadre} categories={categories} showAnadir={false} />

                <main className="md:w-4/5 w-full max-h-full overflow-y-scroll p-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => handleNombreQueryChange(e)}
                            value={nombreQuery}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-10">
                        {articulosFiltrados.map((articulo) => (
                            <InventarioUser key={articulo.idArticulo} articulo={articulo} />
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
                    {carrito.length > 0 && <CarritoComponent carrito={carrito} setCarrito={handleSetCarrito} />}
                </main>
            </div>
        </ReloadContext.Provider>
    )
}