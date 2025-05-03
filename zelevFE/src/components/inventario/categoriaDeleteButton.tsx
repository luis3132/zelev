import { Categoria } from "@/lib/types/types";
import { DeleteIcon } from "../icons/icons";
import { FC } from "react";

interface CategoriaDeleteButtonProps {
    categoria: Categoria;
    handleDeleteCategoria: (id: number) => void;
    editMode: boolean;
}

const CategoriaDeleteButton: FC<CategoriaDeleteButtonProps> = ({ categoria, handleDeleteCategoria, editMode }) => {
    return (
        <button
            type="button"
            className={`${editMode ? "bg-red-500" : "bg-gray-700"} text-white p-2 rounded-lg mb-2 flex gap-2 items-center`}
            onClick={() => handleDeleteCategoria(categoria.idCategoria)}
            disabled={!editMode}
        >
            <DeleteIcon />
            {categoria.subcategoria === "" ? categoria.categoria : `${categoria.categoria} - ${categoria.subcategoria}`}
        </button>
    )
}

export default CategoriaDeleteButton;