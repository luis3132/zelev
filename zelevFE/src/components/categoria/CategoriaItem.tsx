import { Categoria } from "@/lib/types/types";
import Link from "next/link";
import { FC, FormEvent, useContext, useEffect, useState } from "react";
import { CancelIcon, Edit, InfoIcon, SaveIcon } from "../icons/icons";
import { ReloadContext } from "@/lib/hooks/reload";
import { Put } from "@/lib/scripts/fetch";
import Swal from "sweetalert2";

interface CategoriaItemProps {
    categoria: Categoria;
}

const CategoriaItem: FC<CategoriaItemProps> = ({ categoria }) => {
    const [token, setToken] = useState<string>("");
    const [editar, setEditar] = useState<boolean>(false);
    const { update } = useContext(ReloadContext);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
    }, []);

    const handleEdit = () => {
        setEditar(!editar);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            idCategoria: categoria.idCategoria,
            subcategoria: categoria.subcategoria,
            categoria: formData.get("categoria"),
        }
        if (formData.get("categoria") !== "" && formData.get("categoria") !== categoria.categoria) {
            const { status } = await Put("/api/categoria/update", token, data);
            if (status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Subcategoría actualizada",
                    showConfirmButton: false,
                    background: "#1A1A1A",
                    color: "#fff",
                    timer: 1500,
                });
                setEditar(false);
                update();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al actualizar la subcategoría",
                    background: "#1A1A1A",
                    color: "#fff",
                    text: "Inténtalo de nuevo más tarde",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    }

    return (
        <>
            <div className="bg-gray-800 hover:bg-gray-700/50 text-white p-4 rounded-lg shadow-lg w-80 h-40">
                {!editar ? (
                    <>
                        <h2 className="text-3xl font-bold text-center">{categoria.categoria}</h2>
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded flex gap-2 items-center"
                                onClick={handleEdit}>
                                <Edit />
                                Modificar
                            </button>
                            <Link
                                href={`/admin/categoria/${categoria.categoria}`}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded flex gap-2 items-center">
                                <InfoIcon />
                                Más info
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                            <input
                                name="categoria"
                                type="text"
                                defaultValue={categoria.categoria}
                                autoFocus
                                className="bg-gray-700 text-white p-2 rounded-lg"
                            />
                            <div className="flex gap-2 items-center justify-center">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 flex gap-2 items-center"
                                >
                                    <SaveIcon />
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex gap-2 items-center"
                                >
                                    <CancelIcon />
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    )
}

export default CategoriaItem;