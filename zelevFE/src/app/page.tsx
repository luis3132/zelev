"use client";

import InventarioUser from "@/components/inventario/inventarioUser";
import AboutUs from "@/components/main/aboutUs";
import CarritoComponent from "@/components/main/carrito";
import FiltersComponent from "@/components/main/filters";
import ImageSlider from "@/components/main/imageSlider";
import Tecnologies from "@/components/main/tecnologies";
import MainNavbar from "@/components/navbar/MainNavbar";
import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Articulo, Carrito, Categoria } from "@/lib/types/types";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {

  const [categories, setCategories] = useState<Categoria[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [page, setPage] = useState<number>(0);
  const [carrito, setCarrito] = useState<Carrito[]>([]);
  const { ReloadContext, loading, loadingUpdate, reload, update } = useReload();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerTarget = useRef(null);
  const [nombreQuery, setNombreQuery] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<number, boolean>>({});

  const fetchCategorias = async () => {
    const { data, status } = await Get("/api/categoria/list", "");
    if (status === 200) {
      setCategories(data);
    } else {
      console.error("Error al traer las categorias");
    }
  }
  const fetchFirtsArticulos = async () => {
    const { data, status } = await Get(`/api/articulo/list/${0}/${process.env.NEXT_PUBLIC_SIZE}`, "");
    if (status === 200) {
      setArticulos(data);
      setPage(1);
    } else {
      console.error("Error al traer los articulos");
    }
  }
  const [isFetching, setIsFetching] = useState(false);

  const fetchArticulos = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    try {
      const { data, status } = await Get(`/api/articulo/list/${page}/${process.env.NEXT_PUBLIC_SIZE}`, "");

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
          fetchArticulos();
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
  }, [fetchArticulos, isFetching, hasMore]); // Elimina articulos de las dependencias

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCarrito = localStorage.getItem("carrito");
      if (storedCarrito) {
        setCarrito(JSON.parse(storedCarrito));
      }
    }
    if (categories.length === 0) {
      fetchCategorias();
    }
    fetchFirtsArticulos();
  }, [reload, categories.length]);

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

  const handleSetCarrito = (carrito: Carrito[]) => {
    localStorage.removeItem("carrito");
    setCarrito(carrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

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

  const slides = [
    {
      id: 1,
      src: '/bolsos/bolsos.webp',
      alt: 'Descripción de la primera imagen',
      caption: 'Pagina con fines educativos, no comercial'
    },
    {
      id: 2,
      src: '/bolsos/bolso1.webp',
      alt: 'Descripción de la segunda imagen',
      caption: 'Pagina con fines educativos, no comercial'
    },
    {
      id: 3,
      src: '/bolsos/bolso2.webp',
      alt: 'Descripción de la tercera imagen',
      caption: 'Pagina con fines educativos, no comercial'
    },
    {
      id: 4,
      src: '/bolsos/bolso3.webp',
      alt: 'Descripción de la tercera imagen',
      caption: 'Pagina con fines educativos, no comercial'
    },
  ];
  return (
    <ReloadContext.Provider value={{ reload, update, loading, loadingUpdate }}>
      <main className="w-full md:pt-20">
        <MainNavbar />
        <h1 className="md:hidden font-Quintessential text-5xl text-center pt-6">ZELÉV</h1>
        <h2 className="font-Quintessential text-center text-white/50 text-2xl p-4">El privilegio de lo exclusivo, ahora en tus manos.</h2>
        <aside className="w-full flex justify-center px-2 pt-4">
          <div className="w-[95%] md:w-[90%] max-h-[600px] justify-around flex max-md:flex-col gap-4 md:gap-8">
            <div className="w-full md:w-3/4">
              <ImageSlider slides={slides} />
            </div>
            <div className="w-full md:max-w-[230px] md:w-1/4 flex md:flex-col max-h-inherit items-center">
              <div className="w-full overflow-hidden md:h-[50%]">
                <AboutUs />
              </div>
              <div className="w-full md:max-w-[230px] overflow-hidden md:h-[50%]">
                <div className="flex items-center justify-center h-full">
                  <Link href="https://github.com/luis3132/zelev" target="_blank" rel="noopener noreferrer">
                    <div className="flex flex-col items-center gap-2 w-full bg-white overflow-hidden rounded-2xl">
                      <Image alt="github logo" src="/logo/github.png" height={200} width={200} />
                      <span className="text-black hover:underline">Repositorio</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <div className="w-full md:flex md:px-10 mt-10">
          <FiltersComponent toggleCategory={toggleCategory} handleSelectCategory={handleSelectCategory} expandedCategories={expandedCategories} selectedCategories={selectedCategories} categoriasPadre={categoriasPadre} categories={categories} showAnadir={false} />

          <article className="md:w-4/5 w-full overflow-y-scroll p-4">
            <div className="mb-4">
              <input
                id="nombreQuery"
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
          </article>
        </div>
        <section className="pt-4 mb-20">
          <h4 className="font-Quintessential text-center text-white/50 text-2xl py-4">Tecnologías utilizadas</h4>
          <Tecnologies />
        </section>
        {carrito.length > 0 && <CarritoComponent carrito={carrito} setCarrito={handleSetCarrito} />}
      </main>
    </ReloadContext.Provider>
  );
}
