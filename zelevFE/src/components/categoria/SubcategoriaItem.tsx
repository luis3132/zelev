import { Categoria } from "@/lib/types/types";
import { FC, FormEvent, useContext, useEffect, useState } from "react";
import { CancelIcon, DeleteIcon, Edit, SaveIcon } from "../icons/icons";
import { ReloadContext } from "@/lib/hooks/reload";
import { Delete, Put } from "@/lib/scripts/fetch";
import Swal from "sweetalert2";

interface SubcategoriaItemProps {
    categoria: Categoria;
}

const SubcategoriaItem: FC<SubcategoriaItemProps> = ({ categoria }) => {
    const [editar, setEditar] = useState(false);
    const { update } = useContext(ReloadContext);
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
    }, []);

    const handleEditar = () => {
        setEditar(!editar);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            idCategoria: categoria.idCategoria,
            subcategoria: formData.get("subcategoria"),
            categoria: categoria.categoria,
        }
        if (formData.get("subcategoria") !== "" && formData.get("subcategoria") !== categoria.subcategoria) {
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
                    text: "Inténtalo de nuevo más tarde",
                    showConfirmButton: false,
                    background: "#1A1A1A",
                    color: "#fff",
                    timer: 1500,
                });
            }
        }
    }

    const handleDelete = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás recuperar esta subcategoría después de eliminarla",
            icon: "warning",
            showCancelButton: true,
            background: "#1A1A1A",
            color: "#fff",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { status } = await Delete(`/api/categoria/delete/${categoria.idCategoria}`, token);
                if (status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Subcategoría eliminada",
                        background: "#1A1A1A",
                        color: "#fff",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    update();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error al eliminar la subcategoría",
                        text: "Inténtalo de nuevo más tarde",
                        background: "#1A1A1A",
                        color: "#fff",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        })
    }
    return (
        <>
            <div className="bg-gray-800 hover:bg-gray-700/50 text-white p-4 rounded-lg shadow-lg w-80 h-40">
                {!editar ? (
                    <>
                        <h2 className="text-3xl font-bold text-center">{categoria.subcategoria}</h2>
                        <div className="flex gap-2 items-center justify-center mt-4">
                            <button
                                onClick={handleEditar}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 flex gap-2 items-center"
                            >
                                <Edit />
                                Modificar
                            </button>
                            <button onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded flex gap-2 items-center">
                                <DeleteIcon />
                                Eliminar
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                            <input
                                name="subcategoria"
                                type="text"
                                defaultValue={categoria.subcategoria}
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
                                    onClick={handleEditar}
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

export default SubcategoriaItem;