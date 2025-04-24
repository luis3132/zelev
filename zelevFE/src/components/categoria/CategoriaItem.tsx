import { Categoria } from "@/lib/types/types";
import Link from "next/link";
import { FC } from "react";

interface CategoriaItemProps {
    categoria: Categoria;
}

const CategoriaItem: FC<CategoriaItemProps> = ({ categoria }) => {
    return (
        <>
            <div className="bg-gray-800 hover:bg-gray-700/50 text-white p-4 rounded-lg shadow-lg w-80 h-40">
                <h2 className="text-3xl font-bold text-center">{categoria.categoria}</h2>
                <div className="flex flex-col items-center justify-end mt-4">
                    <Link
                        href={`/admin/categoria/${categoria.categoria}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Más información
                    </Link>
                </div>
            </div>
        </>
    )
}

export default CategoriaItem;