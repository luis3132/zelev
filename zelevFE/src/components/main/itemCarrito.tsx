import { Get } from "@/lib/scripts/fetch";
import { Carrito } from "@/lib/types/types"
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";

interface ItemCarritoProps {
    item: Carrito;
    eliminarItem: (upc: number) => void;
}

const ItemCarrito: FC<ItemCarritoProps> = ({ item, eliminarItem }) => {
    const [foto, setFoto] = useState<string>("/logo/logo.png");
    const fotoRef = useRef("");

    useEffect(() => {
        const fetchImagen = async () => {
            try {
                const { data, status } = await Get(`/api/imagen/${item.imagen}`, "", undefined, true);

                if (status === 200 && data instanceof Blob) {
                    const imageUrl = URL.createObjectURL(data);
                    if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
                    fotoRef.current = imageUrl;
                    setFoto(imageUrl);
                }
            } catch (error) {
                console.error("Error cargando imagen:", error);
                setFoto("/logo/logo.png");
            }
        };

        if (item.imagen) {
            fetchImagen();
        }

        return () => {
            if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
        };
    }, [item]);

    const handleRemoveItem = () => {
        eliminarItem(item.upc);
    }

    return (
        <div className="w-full bg-black rounded-lg p-2 items-center">
            <main className="flex gap-3 items-center w-full">
                <div className="min-w-20 max-w-20 min-h-20 max-h-20 flex items-center justify-center">
                    <Image
                        src={foto}
                        alt={item.nombre}
                        width={80}
                        height={80}
                        className="rounded-lg"
                    />
                </div>
                <div className="w-full">
                    <h2 className="text-lg font-bold text-white">{item.nombre}</h2>
                    <p className="text-sm text-gray-400">Cantidad: {item.cantidad}</p>
                    <p className="text-sm text-gray-400">Precio: ${item.precio}</p>
                    <p className="text-sm text-gray-400">Subtotal: ${item.subtotal}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Color:</span>
                        <span
                            className="w-4 h-4 rounded-full border-2 border-white"
                            style={{ backgroundColor: item.label }}
                            title={item.label}
                        ></span>
                    </div>
                </div>
            </main>
            <div className="p-1 mt-3 flex justify-between">
                <Link className="p-1 rounded-lg bg-amber-600" href={item.url}>Información</Link>
                <button
                    className="p-1 rounded-lg bg-red-600 hover:bg-red-800 transition duration-300"
                    onClick={handleRemoveItem}
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
}

export default ItemCarrito;