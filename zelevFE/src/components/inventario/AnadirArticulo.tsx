import { ArticuloCreate, Categoria, Imagen, ImgArtUniCreate } from "@/lib/types/types";
import Image from "next/image";
import { ChangeEvent, FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import CategoriaDeleteButton from "./categoriaDeleteButton";
import { Get, Post, UploadPost } from "@/lib/scripts/fetch";
import { CancelIcon, SaveIcon } from "../icons/icons";
import { ReloadContext } from "@/lib/hooks/reload";

interface AnadirArticuloProps {
    closeModal: () => void;
}

const AnadirArticulo: FC<AnadirArticuloProps> = ({ closeModal }) => {
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");
    const [token, setToken] = useState<string>("");
    const [file, setFile] = useState<File>();
    const [show, setShow] = useState(false);
    const executingRef = useRef(false);
    const { update } = useContext(ReloadContext);

    const fetchCategorias = useCallback(async () => {
        const { data, status } = await Get("/api/categoria/list", token);
        if (status === 200) {
            setCategorias(data);
        } else {
            console.error("Error al traer las categorias");
        }
    }, [token]);

    useEffect(() => {
        setShow(true);
        if (typeof window !== "undefined" && token === "") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        if (token !== "") {
            fetchCategorias();
        }

    }, [token, fetchCategorias]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 1) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Solo puedes subir una imagen.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            });
            return;
        }
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFoto(URL.createObjectURL(e.target.files[0]));
        }
    }

    const handleEditCancelbutton = () => {
        setShow(false);
        setTimeout(() => {
            closeModal();
        }, 300);
    }

    const handleDeleteCategoria = (id: number) => {
        if (executingRef.current) return;
        executingRef.current = true;

        if (categoriasSeleccionadas.length > 1) {
            setCategoriasSeleccionadas((prevCategorias) =>
                prevCategorias.filter((categoria) => categoria.idCategoria !== id)
            );
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No puedes eliminar todas las categorías",
                color: "#fff",
                background: "#000",
            });
        }

        setTimeout(() => { executingRef.current = false }, 0);
    };

    const categoriasPadre = categorias.filter((categoria) => {
        return categoria.subcategoria === "";
    });

    const categoriasHijas = (categoriaS: string) => {
        return categorias.filter((categoria) => {
            const idSelect = categoriasSeleccionadas.map(categoria => categoria.idCategoria);
            return categoria.categoria === categoriaS && categoria.subcategoria !== "" && !idSelect.includes(categoria.idCategoria);
        });
    }

    const handleAddCategoria = () => {
        const categoriaId = (document.getElementById("subcategoria") as HTMLSelectElement)?.value;
        if (categoriaId) {
            const categoriaSeleccionada = categorias.find(categoria => categoria.idCategoria === parseInt(categoriaId));
            if (categoriaSeleccionada && !categoriasSeleccionadas.includes(categoriaSeleccionada)) {
                setCategoriasSeleccionadas([...categoriasSeleccionadas, categoriaSeleccionada]);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Selecciona una categoría o subcategoría válida",
                color: "#fff",
                background: "#000",
            });
        }
    }

    const loadImage = async () => {
        if (file) {
            const alt = (document.getElementById("alt") as HTMLInputElement).value;
            const formData = new FormData();
            formData.append("imagen", file);
            formData.append("ruta", "article");
            formData.append("existe", "false");
            formData.append("alt", alt);
            const { data, status } = await UploadPost("/api/imagen/upload", token, formData);
            if (status !== 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se ha podido actualizar la imagen.',
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3085d6",
                    background: "#1A1A1A",
                    color: "#fff",
                });
                return;
            }
            return data as Imagen;
        }
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (categoriasSeleccionadas.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Selecciona al menos una categoría",
                color: "#fff",
                background: "#000",
            });
            return;
        }
        let ImgArtUni: ImgArtUniCreate | undefined = undefined;
        if (file) {
            const imagen = await loadImage();
            if (imagen) {
                ImgArtUni = {
                    articulo: 0,
                    unidad: null,
                    imagen: imagen.idImagen
                }
            }
        }
        const data: ArticuloCreate = {
            categorias: categoriasSeleccionadas.map(categoria => categoria.idCategoria),
            descripcion: (document.getElementById("descripcion") as HTMLInputElement).value,
            estado: (document.getElementById("estado") as HTMLSelectElement).value,
            impuesto: parseFloat((document.getElementById("impuesto") as HTMLInputElement).value),
            nombre: (document.getElementById("nombre") as HTMLInputElement).value,
            unidades: [],
            imagen: ImgArtUni,
        }
        const { status } = await Post("/api/articulo/new", token, data);
        if (status === 200) {
            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Artículo creado correctamente.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            });
            update();
            handleEditCancelbutton();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha podido crear el artículo.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            });
        }
    }

    return (
        <div className={`absolute w-full h-dvh flex flex-col items-center justify-center top-0 left-0 z-20 backdrop-blur-sm opacity-0 ${show && "opacity-100"} transition-all duration-300`}>
            <main className="flex justify-center md:items-center h-min md:w-[80%] w-[90%]">
                <section className="rounded-lg p-6 w-[95%] md:w-[80%] gap-6 max-h-[85vh] bg-black overflow-y-scroll max-md:mt-10">
                    <article className="md:flex gap-6 w-full">
                        <div className="w-full md:w-1/5 flex flex-col justify-center items-center max-h-[80vh] md:sticky md:top-0">
                            <div className='max-w-64 p-2'>
                                <Image
                                    src={foto}
                                    alt="Imagen del Artículo"
                                    width={500}
                                    height={500}
                                    className='rounded-2xl object-cover shadow-2xl shadow-white/10'
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                <label className="flex flex-col">
                                    <span className="font-bold">Subir Imagen:</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border rounded p-2 h-10"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="font-bold">Texto Alternativo (Alt):</span>
                                    <input
                                        id="alt"
                                        name="alt"
                                        type="text"
                                        maxLength={200}
                                        className="border rounded p-2 h-10"
                                        required={file !== undefined}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="w-full md:w-4/5 flex flex-col gap-4 max-md:mt-5">
                            <h1 className="text-2xl font-bold">Artículo nuevo</h1>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div className="w-full md:flex gap-4">
                                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                                        <label className="flex flex-col">
                                            <span className="font-bold">Nombre:</span>
                                            <input
                                                id="nombre"
                                                name="nombre"
                                                type="text"
                                                maxLength={100}
                                                required
                                                className="border rounded p-2 h-10"
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <span className="font-bold">Descripción:</span>
                                            <textarea
                                                id="descripcion"
                                                name="descripcion"
                                                maxLength={500}
                                                required
                                                className="border rounded p-2 h-10"
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <span className="font-bold">Impuesto (en decimal):</span>
                                            <input
                                                id="impuesto"
                                                name="impuesto"
                                                type="number"
                                                className="border rounded p-2 h-10"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                required
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <span className="font-bold">Estado:</span>
                                            <select
                                                id="estado"
                                                name="estado"
                                                required
                                                className="border rounded p-2 h-10"
                                            >
                                                <option className="text-black" value="ACTIVO">Activo</option>
                                                <option className="text-black" value="NOACTIVO">Inactivo</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="w-full md:w-1/2 flex flex-col gap-2 max-md:mt-2">
                                        <label className="flex flex-col">
                                            <span className="font-bold">Categorias Seleccionadas:</span>
                                            <div className="bg-white/10 rounded-lg p-2 max-h-30 overflow-y-scroll gap-2 flex-wrap flex justify-center min-h-10">
                                                {categoriasSeleccionadas.map((categoria) => (
                                                    <CategoriaDeleteButton
                                                        key={categoria.idCategoria}
                                                        categoria={categoria}
                                                        handleDeleteCategoria={handleDeleteCategoria}
                                                        editMode={true}
                                                    />
                                                ))}
                                            </div>
                                        </label>
                                        <label className="flex flex-col">
                                            <span className="font-bold">Categoría:</span>
                                            <select
                                                id="categoria"
                                                name="categoria"
                                                className="border rounded p-2 h-10"
                                                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                            >
                                                <option defaultValue="" className="text-black">Selecciona una categoría</option>
                                                {categoriasPadre.map((categoria) => (
                                                    <option
                                                        className="text-black"
                                                        key={categoria.idCategoria}
                                                        value={categoria.categoria}
                                                    >
                                                        {categoria.categoria}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="flex flex-col">
                                            <span className="font-bold">Subcategoría:</span>
                                            <select
                                                id="subcategoria"
                                                name="subcategoria"
                                                className="border rounded p-2 h-10"
                                            >
                                                {categoriaSeleccionada === "" ? (
                                                    <option defaultValue="" className="text-black">Selecciona una categoría</option>
                                                ) : (
                                                    <option defaultValue="" className="text-black">Selecciona una subcategoría</option>
                                                )}
                                                {categoriaSeleccionada && categoriasHijas(categoriaSeleccionada).map((categoria) => (
                                                    <option
                                                        className="text-black"
                                                        key={categoria.idCategoria}
                                                        value={categoria.idCategoria}
                                                    >
                                                        {categoria.subcategoria}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <div className="flex justify-center mt-4">
                                            <button
                                                type="button"
                                                className="bg-green-500 text-white p-2 rounded flex gap-2 items-center"
                                                onClick={handleAddCategoria}
                                            >
                                                <SaveIcon />
                                                Guardar Categoría
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row-reverse gap-4 w-full">
                                    <button
                                        type="button"
                                        onClick={handleEditCancelbutton}
                                        className="bg-yellow-600 text-white p-2 rounded flex gap-2 items-center"
                                    >
                                        <CancelIcon />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white p-2 rounded flex gap-2 items-center"
                                    >
                                        <SaveIcon />
                                        Terminar y Guardar Articulo
                                    </button>
                                </div>
                            </form>
                        </div>
                    </article>
                    {/* <label className="flex flex-col">
                        <span className="font-bold">Unidades:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg bg-white/10 p-4">
                            {unidadList.map((unidad, index) => (<></>))}
                            <div className="flex justify-center items-center">
                                <button
                                    type="button"
                                    onClick={handleAddUnidad}
                                    className="bg-green-500 text-white p-2 rounded flex gap-2 items-center"
                                >
                                    <Anadir />
                                    Agregar Unidad
                                </button>
                            </div>
                        </div>
                    </label> */}
                </section>
            </main>
        </div>
    )
}

export default AnadirArticulo;