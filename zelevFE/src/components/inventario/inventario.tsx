import { Articulo } from "@/lib/types/types";
import { FC } from "react";

interface InventarioProps {
    articulo: Articulo;
}

const Inventario: FC<InventarioProps> = ({ articulo }) => {
    return (
        <article className="border rounded-lg p-4 shadow-md flex flex-col md:flex-row">
            <aside className="w-full md:w-2/3">
                <h2 className="font-bold text-lg mb-2">{articulo.nombre}</h2>
                <p className="text-sm text-gray-600 mb-4">{articulo.descripcion}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Acción</button>
            </aside>
            <main className="w-full md:w-1/3 flex justify-center items-center">
                <img
                    src="https://via.placeholder.com/150"
                    alt="Imagen del artículo"
                    className="w-full h-auto rounded"
                />
            </main>
        </article>
    )
}

export default Inventario;