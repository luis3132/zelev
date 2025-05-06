"use client";

import { Anadir, BackIcon } from "@/components/icons/icons";
import ImageSlider from "@/components/main/imageSlider";
import { Get } from "@/lib/scripts/fetch";
import { Articulo, Carrito, Imagen, Slide } from "@/lib/types/types";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const Home = () => {
    const { id } = useParams();
    const fotoRef = useRef("");
    const [articulo, setArticulo] = useState<Articulo>();
    const [slides, setSlides] = useState<Slide[]>([]);
    const defaultImage: Slide = {
        id: 1,
        src: "/logo/largeLogo.webp",
        alt: "Imagen 1",
        caption: "Logo de la tienda, No hay imagenes disponibles",
    }
    const [unidadSeleccionada, setUnidadSeleccionada] = useState<number>(0);

    const fetchArticulo = async () => {
        const { data, status } = await Get(`/api/articulo/${id}`, "");
        if (status === 200) {
            setArticulo(data);
        } else {
            console.error("Error al obtener el articulo");
        }
    }

    useEffect(() => {
        if (id) {
            fetchArticulo();
        }
    }, [id]);

    useEffect(() => {
        const fetchImagenes = async (id: Imagen) => {
            try {
                const { data, status } = await Get(`/api/imagen/${id.idImagen}`, "", undefined, true);
                if (status === 200 && data instanceof Blob) {
                    const imageUrl = URL.createObjectURL(data);
                    if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
                    fotoRef.current = imageUrl;
                    setSlides((prevSlides) => [
                        ...prevSlides,
                        {
                            id: id.idImagen,
                            src: imageUrl,
                            alt: id.alt,
                        }
                    ]);
                }
            } catch (error) {
                console.warn("Error cargando imagen:", error);
                setSlides([]);
            }
        }
        if (articulo) {
            const fetchImagesWithDelay = async () => {
                for (const imagen of articulo.imagenes) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    await fetchImagenes(imagen.imagen);
                }
            };
            fetchImagesWithDelay();
        } else {
            setSlides([]);
        }
        return () => {
            if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
        };
    }, [articulo]);

    const handleShowPrecio = (index: number) => {
        setUnidadSeleccionada(index);
    }

    const handleAddCarrito = () => {
        if (unidadSeleccionada === 0) {
            Swal.fire({
                icon: "warning",
                title: "Seleccione un color",
                text: "Por favor, seleccione un color antes de agregar al carrito.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#4CAF50",
                background: "#0f0f0f",
                color: "#FFFFFF",
            });
            return;
        }
        const unidad = articulo?.unidades.find(u => u.upc === unidadSeleccionada);
        const imagen = articulo?.imagenes.find(i => i.unidad?.upc === unidadSeleccionada);
        if (unidad && articulo) {
            const cantidad = document.getElementById("cantidad") as HTMLSelectElement;
            const data: Carrito = {
                upc: unidad.upc,
                nombre: articulo.nombre,
                cantidad: parseInt(cantidad.value),
                imagen: imagen?.imagen.idImagen,
                precio: unidad.precio,
                subtotal: parseInt(unidad.precio) * parseInt(cantidad.value),
                url: window.location.pathname,
            }
            console.log(data);
        }
    }

    return (
        <main className="flex flex-col items-center justify-center w-full h-full">
            <button
                onClick={() => window.history.back()}
                className="fixed top-20 left-5 text-white p-4 cursor-pointer flex items-center gap-2"
            >
                <BackIcon />
                Volver
            </button>
            <section className="w-[90%] md:w-[80%] rounded-2xl bg-black p-4 shadow-2xl shadow-white/20 max-h-[80vh] md:flex-row flex flex-col items-center overflow-y-scroll">
                <aside className='w-full md:w-[50%] md:p-4'>
                    <ImageSlider key={1} slides={slides.length > 0 ? slides : [defaultImage]} />
                </aside>
                <article className="flex flex-col justify-center p-4 max-md:mt-5">
                    <h1 className="text-6xl font-bold text-white font-Quintessential">{articulo?.nombre}</h1>
                    <p className="mt-10 text-white ">{articulo?.descripcion}</p>
                    <h2 className="mt-10 text-2xl gap-2">Precio: {unidadSeleccionada === 0 ? "Seleccione un color" : articulo?.unidades.find(u => u.upc === unidadSeleccionada)?.precio}</h2>
                    <div className="flex-wrap flex h-min gap-10 mt-5 max-md:justify-center">
                        {articulo?.unidades.map((unidad, index) => (
                            <button
                                key={index}
                                className={`${unidadSeleccionada === unidad.upc ? "bg-white/40" : "bg-white/20"} rounded-lg p-2 gap-2 flex items-center transition duration-300`}
                                onClick={() => handleShowPrecio(unidad.upc)}
                            >
                                Color:
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: unidad.label }}></div>
                            </button>
                        ))}
                    </div>
                    <div className="mt-5">
                        <label htmlFor="cantidad" className="text-white">Cantidad:</label>
                        <select
                            id="cantidad"
                            name="cantidad"
                            className="ml-2 p-2 rounded-lg bg-white/20 text-white"
                            onChange={(e) => console.log(`Cantidad seleccionada: ${e.target.value}`)}
                        >
                            {unidadSeleccionada === 0 ? (
                                <option className="text-black" defaultValue="">Seleccione un color</option>
                            ) : ([...Array(articulo?.unidades.find(u => u.upc === unidadSeleccionada)?.cantidad)].map((_, i) => (
                                <option className="text-black" key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            )))}
                        </select>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-5">
                        <button
                            className="mt-5 bg-emerald-600/40 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600/90 transition duration-300"
                            onClick={handleAddCarrito}
                        >
                            <Anadir />
                            Agregar al carrito
                        </button>
                    </div>
                </article>
            </section>
        </main>
    )
}

export default Home;