import { Get } from "@/lib/scripts/fetch";
import { Articulo } from "@/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";

interface InventarioProps {
    articulo: Articulo;
}

const InventarioUser: FC<InventarioProps> = ({ articulo }) => {
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");
    const [alt, setAlt] = useState<string>("");
    const fotoRef = useRef("");

    useEffect(() => {
        const fetchImagenes = async (id: number) => {
            try {
                const { data, status } = await Get(`/api/imagen/${id}`, "", undefined, true);
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
    }, [articulo]);

    const handlePrevius = () => {
        sessionStorage.setItem("currentPath", window.location.pathname);
    }

    return (
        <Link onClick={handlePrevius} href={`/${articulo.idArticulo}`} className="border rounded-lg p-4 shadow-md flex flex-col hover:bg-black items-center justify-center ">
            <main className="w-full flex justify-center items-center mb-2">
                <div className="w-[250px] flex justify-center items-center">
                    <Image
                        src={foto}
                        alt={alt}
                        width={250}
                        height={250}
                        className="h-min object-cover rounded-lg shadow-md shadow-white/30"
                    />
                </div>
            </main>
            <aside className="w-full flex flex-col">
                <h2 className="font-bold text-lg mb-2">{articulo.nombre}</h2>
                <p className="text-sm text-gray-600">{articulo.descripcion}</p>
            </aside>
        </Link>
    )
}

export default InventarioUser;