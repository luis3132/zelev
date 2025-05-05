import { FC, FormEvent, useContext, useEffect, useState } from "react";
import { CancelIcon, SaveIcon } from "../icons/icons";
import { ReloadContext } from "@/lib/hooks/reload";
import { Post } from "@/lib/scripts/fetch";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";

interface AnadirCategoriaProps {
    closeModal: () => void;
    categoria: boolean;
}

const AnadirCategoria: FC<AnadirCategoriaProps> = ({ closeModal, categoria }) => {
    const [show, setShow] = useState(false);
    const [token, setToken] = useState<string>("");

    const { id } = useParams();
    const categoriaID = Array.isArray(id) ? id.join(" ").replace(/%20/g, " ") : id?.replace(/%20/g, " ");

    const { update } = useContext(ReloadContext);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        setShow(true);
    }, []);

    const handleclose = () => {
        setShow(false);
        setTimeout(() => {
            closeModal();
        }, 300);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        document.getElementById("btn-aggregar")?.setAttribute("disabled", "true");
        const formData = new FormData(e.currentTarget);
        let data;
        if (categoria) {
            data = {
            categoria: normalizeText(formData.get("categoria")),
            subcategoria: "",
            };
        } else {
            data = {
            categoria: `${categoriaID}`,
            subcategoria: normalizeText(formData.get("categoria")),
            };
        }
        const { status } = await Post("/api/categoria/new", token, data);
        if (status === 200) {
            Swal.fire({
                icon: "success",
                title: `${categoria ? "Categoria" : "Subcategoria"} creada`,
                text: `${categoria ? "Categoria" : "Subcategoria"} creada correctamente`,
                showConfirmButton: false,
                timer: 1000,
                toast: true,
                position: "bottom-right",
                customClass: {
                    popup: "bg-gray-800 text-white rounded-lg shadow-lg",
                    title: "text-white",
                    icon: "text-green-500",
                },
            }).then(() => {
                update();
                handleclose();
            });
        } else {
            console.error("Error al crear la categoria");
        }
    }

    const normalizeText = (text: string | FormDataEntryValue | null) => {
        if (typeof text === "string") {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "");
        }
        return text;
    };

    return (
        <>
            <section className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm transition-all duration-300 opacity-0 ${show && "opacity-100"} flex items-center justify-center z-20`}>
                <form onSubmit={handleSubmit}>
                    <div className="bg-black rounded-lg p-5 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {categoria ? "Añadir Categoria" : "Añadir Subcategoria"}
                            </h2>
                            <button
                                type="button"
                                onClick={handleclose}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Cerrar"
                            >
                                <CancelIcon />
                            </button>
                        </div>
                        <input
                            name="categoria"
                            type="text"
                            required
                            maxLength={20}
                            placeholder="Nombre de la categoria"
                            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                id="btn-aggregar"
                                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1"
                            >
                                <SaveIcon />
                                Añadir
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </>
    )
}

export default AnadirCategoria;