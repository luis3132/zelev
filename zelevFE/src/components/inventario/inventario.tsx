import { Get } from "@/lib/scripts/fetch";
import { Articulo } from "@/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";

interface InventarioProps {
    articulo: Articulo;
    token: string;
}

const Inventario: FC<InventarioProps> = ({ articulo, token }) => {
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");
    const [alt, setAlt] = useState<string>("");
    const fotoRef = useRef("");

    useEffect(() => {
        const fetchImagenes = async (id: number) => {
            try {
                const { data, status } = await Get(`/api/imagen/${id}`, token, undefined, true);
                if (status === 200 && data instanceof Blob) {
                    const imageUrl = URL.createObjectURL(data);
                    if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
                    fotoRef.current = imageUrl;
                    setFoto(imageUrl);
                }
            } catch (error) {
                console.warn("Error cargando imagen:", error);
                setFoto("/logo/largeLogo.webp");
            }
        }
        const singleImg = articulo.imagenes.find((img) => !img.unidad);
        if (singleImg) {
            fetchImagenes(singleImg.imagen.idImagen);
            setAlt(singleImg.imagen.alt);
        } else {
            setFoto("/logo/largeLogo.webp");
        }
        return () => {
            if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
        };
    }, [articulo.imagenes, token]);

    const total = articulo.unidades.reduce((acc, unidad) => {
        const unidadTotal = unidad.cantidad === undefined ? 0 : unidad.cantidad;
        return acc + unidadTotal;
    }, 0);

    return (
        <article className="border rounded-lg p-4 shadow-md flex flex-col md:flex-row hover:bg-black ">
            <main className="w-[200px] max-md:w-full flex justify-center items-center max-md:mb-2">
                <Image
                    src={foto}
                    alt={alt}
                    width={110}
                    height={110}
                    className="h-min object-cover rounded-lg shadow-md shadow-white/30"
                />
            </main>
            <aside className="w-full">
                <h2 className="font-bold text-lg mb-2">{articulo.nombre}</h2>
                <p className="text-sm text-gray-600 mb-4">{articulo.descripcion}</p>
                <div className="flex justify-end items-center mb-4 gap-2 text-white">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold">{total}</span>
                </div>
                <div className="flex justify-end">
                    <Link href={`/admin/inventario/${articulo.idArticulo}`} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Más información</Link>
                </div>
            </aside>
        </article>
    )
}

export default Inventario;