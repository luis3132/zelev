"use client";

import { Anadir, CancelIcon, Edit, SaveIcon } from "@/components/icons/icons";
import CategoriaDeleteButton from "@/components/inventario/categoriaDeleteButton";
import UnidadCard from "@/components/inventario/unidad";
import useReload from "@/lib/hooks/reload";
import { Get, Post, UploadPost } from "@/lib/scripts/fetch";
import { Articulo, ArticuloUpdate, Categoria, Imagen, ImgArtUniCreate, Unidad, UnidadCreate } from "@/lib/types/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
    const id = useParams().id;

    const [token, setToken] = useState<string>("");
    const [file, setFile] = useState<File>();
    const [articulo, setArticulo] = useState<Articulo>();
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<Categoria[]>([]);
    const [unidadEdit, setUnidadEdit] = useState<UnidadCreate[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editUnidad, setEditUnidad] = useState<boolean>(false);
    const { ReloadContext, loading, loadingUpdate, reload, update } = useReload();
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");
    const [alt, setAlt] = useState<string>("");
    const fotoRef = useRef("");
    const executingRef = useRef(false);

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
        if (!articulo) return;
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
    }, [articulo, token]);

    const fetchArticulo = useCallback(async () => {
        const { data, status } = await Get(`/api/articulo/${id}/true`, token);
        if (status === 200) {
            setArticulo(data);
            setCategoriasSeleccionadas(data.categorias);
        } else {
            console.error("Error al traer el articulo");
        }
    }, [id, token]); 

    const fetchCategorias = useCallback(async () => {
        const { data, status } = await Get("/api/categoria/list", token);
        if (status === 200) {
            setCategories(data);
        } else {
            console.error("Error al traer las categorias");
        }
    }, [token]);

    const categoriasPadre = categories.filter((categoria) => {
        return categoria.subcategoria === "";
    });

    const categoriasHijas = (categoriaS: string) => {
        return categories.filter((categoria) => {
            const idSelect = categoriasSeleccionadas.map(categoria => categoria.idCategoria);
            return categoria.categoria === categoriaS && categoria.subcategoria !== "" && !idSelect.includes(categoria.idCategoria);
        });
    }

    useEffect(() => {
        if (typeof window !== "undefined" && token === "") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        if (token !== "") {
            fetchArticulo();
            fetchCategorias();
        }
        
    }, [id, token, reload, fetchArticulo, fetchCategorias]);

    const handleEditCancelbutton = () => {
        if (editMode) {
            window.location.reload();
        }
        setEditMode(!editMode);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (articulo) {
            setArticulo({ ...articulo, [e.target.name]: e.target.value });
        }
    }

    const handleEditUnidad = () => {
        setEditUnidad(!editUnidad);
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

    const handleAddCategoria = () => {
        const categoriaId = (document.getElementById("subcategoria") as HTMLSelectElement)?.value;
        if (categoriaId) {
            const categoriaSeleccionada = categories.find(categoria => categoria.idCategoria === parseInt(categoriaId));
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

    const loadImage = async () => {
        if (file) {
            const formData = new FormData();
            const imagen = articulo?.imagenes.find((img) => img.unidad === null || img.unidad === undefined)?.imagen;
            let alt = "";
            if (imagen) {
                alt = imagen.alt;
            } else {
                alt = (document.getElementById("alt") as HTMLInputElement)?.value || "";
            }
            formData.append("imagen", file);
            formData.append("ruta", "article");
            formData.append("existe", imagen?.idImagen.toString() || "false");
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!articulo) return;
        const CategoriasNuevas = categoriasSeleccionadas.filter((categoria) => {
            const idCategoria = articulo.categorias.map(categoria => categoria.idCategoria);
            return !idCategoria.includes(categoria.idCategoria);
        });
        let ImgArtUni: ImgArtUniCreate | undefined = undefined;
        if (file) {
            const imagen = await loadImage();
            const temp = articulo?.imagenes.find((img) => img.unidad === null || img.unidad === undefined)?.imagen.url;
            if (imagen && !temp) {
                ImgArtUni = {
                    articulo: articulo.idArticulo,
                    unidad: null,
                    imagen: imagen.idImagen
                }
            }
        }
        const data: ArticuloUpdate = {
            idArticulo: articulo.idArticulo,
            nombre: articulo.nombre,
            descripcion: articulo.descripcion,
            impuesto: articulo.impuesto,
            estado: articulo.estado,
            categoriasEliminar: articulo.categorias.filter((categoria) => {
                const idSelect = categoriasSeleccionadas.map(categoria => categoria.idCategoria);
                return !idSelect.includes(categoria.idCategoria)
            }).map(categoria => categoria.idCategoria),
            categoriasNuevas: CategoriasNuevas.map(categoria => categoria.idCategoria),
            unidades: unidadEdit,
            imagen: ImgArtUni,
        }

        const { status } = await Post("/api/articulo/update", token, data);
        if (status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Artículo actualizado correctamente.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            });
            update();
            setEditMode(false);
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha podido actualizar el artículo.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            });
        }
    }

    const handleAddUnidad = () => {
        const unidad: UnidadCreate = {
            upc: unidadEdit.length + 1,
            label: "",
            precio: "",
            cantidad: 0,
            estado: "STOCK",
            descripcion: "",
            articulo: articulo?.idArticulo || 0,
            imagen: undefined,
        }
        setUnidadEdit([...unidadEdit, unidad]);
    }

    const handleDeleteUnidad = (upc: number) => {
        setUnidadEdit(unidadEdit.filter((unidad) => unidad.upc !== upc));
    }

    return (
        <ReloadContext.Provider value={{ reload, update, loading, loadingUpdate }}>
            <main className="flex justify-center md:items-center h-full">
                <section className="bg-white/5 shadow-md rounded-lg p-6 w-[95%] md:w-[80%] gap-6 max-h-[85vh] overflow-y-scroll max-md:mt-10">
                    <article className="md:flex gap-6 w-full">
                        <div className="w-full md:w-1/5 flex flex-col justify-center items-center max-h-[80vh] md:sticky md:top-0">
                            <div className='max-w-64'>
                                <Image
                                    src={foto}
                                    alt={alt}
                                    width={500}
                                    height={500}
                                    className='rounded-2xl object-cover shadow-2xl shadow-white/5'
                                />
                            </div>
                            {editMode && (
                                <div className="flex flex-col gap-4 w-full">
                                    <label className="flex flex-col">
                                        <span className="font-bold">Subir Imagen:</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="border rounded p-2"
                                            onChange={handleFileChange}
                                            disabled={!editMode}
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        <span className="font-bold">Texto Alternativo (Alt):</span>
                                        <input
                                            id="alt"
                                            name="alt"
                                            type="text"
                                            maxLength={200}
                                            className="border rounded p-2"
                                            disabled={!editMode}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className="w-full md:w-4/5 flex flex-col gap-4 max-md:mt-5">
                            <h1 className="text-2xl font-bold">Artículo #{articulo?.idArticulo}</h1>
                            {articulo && (
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
                                                    value={articulo.nombre}
                                                    onChange={(e) => handleChange(e)}
                                                    className="border rounded p-2"
                                                    disabled={!editMode}
                                                />
                                            </label>
                                            <label className="flex flex-col">
                                                <span className="font-bold">Descripción:</span>
                                                <textarea
                                                    id="descripcion"
                                                    name="descripcion"
                                                    maxLength={500}
                                                    value={articulo.descripcion}
                                                    onChange={(e) => handleChange(e)}
                                                    className="border rounded p-2"
                                                    disabled={!editMode}
                                                />
                                            </label>
                                            <label className="flex flex-col">
                                                <span className="font-bold">Impuesto:</span>
                                                <input
                                                    id="impuesto"
                                                    name="impuesto"
                                                    type="number"
                                                    value={articulo.impuesto}
                                                    onChange={(e) => handleChange(e)}
                                                    className="border rounded p-2"
                                                    disabled={!editMode}
                                                />
                                            </label>
                                            <label className="flex flex-col">
                                                <span className="font-bold">Estado:</span>
                                                <select
                                                    id="estado"
                                                    name="estado"
                                                    value={articulo.estado}
                                                    onChange={(e) => handleChange(e)}
                                                    className="border rounded p-2"
                                                    disabled={!editMode}
                                                >
                                                    <option className="text-black" value="ACTIVO">Activo</option>
                                                    <option className="text-black" value="NOACTIVO">Inactivo</option>
                                                </select>
                                            </label>
                                        </div>
                                        <div className="w-full md:w-1/2 flex flex-col gap-2 max-md:mt-2">
                                            <label className="flex flex-col">
                                                <span className="font-bold">Categorias Seleccionadas:</span>
                                                <div className="bg-black rounded-lg p-2 max-h-30 overflow-y-scroll gap-2 flex-wrap flex justify-center min-h-10">
                                                    {categoriasSeleccionadas.map((categoria) => (
                                                        <CategoriaDeleteButton
                                                            key={categoria.idCategoria}
                                                            categoria={categoria}
                                                            handleDeleteCategoria={handleDeleteCategoria}
                                                            editMode={editMode}
                                                        />
                                                    ))}
                                                </div>
                                            </label>
                                            <label className="flex flex-col">
                                                <span className="font-bold">Categoría:</span>
                                                <select
                                                    id="categoria"
                                                    name="categoria"
                                                    className="border rounded p-2"
                                                    disabled={!editMode}
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
                                                    className="border rounded p-2"
                                                    disabled={!editMode}
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
                                            {editMode && (
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
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row-reverse gap-4 w-full">
                                        <button
                                            type="button"
                                            onClick={handleEditCancelbutton}
                                            className="bg-yellow-600 text-white p-2 rounded flex gap-2 items-center"
                                        >
                                            {editMode ? (<CancelIcon />) : (<Edit />)}
                                            {editMode ? "Cancelar" : "Editar"}
                                        </button>
                                        {editMode && (
                                            <button
                                                type="submit"
                                                className="bg-blue-500 text-white p-2 rounded flex gap-2 items-center"
                                            >
                                                <SaveIcon />
                                                Guardar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </article>
                    <label className="flex flex-col">
                        <span className="font-bold">Unidades:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg bg-black/20 p-4">
                            {articulo?.unidades.map((unidad, index) => {
                                const idImagen = articulo.imagenes?.find((img) => img.unidad?.upc === unidad.upc);
                                return (
                                    <UnidadCard key={index} handleDeleteUnidad={handleDeleteUnidad} idArticulo={articulo.idArticulo} unidad={unidad} editArticulo={editMode} editUnidad={editUnidad} setEditUnidad={handleEditUnidad} token={token} nuevo={false} idImagen={idImagen?.imagen} />
                                )
                            })}
                            {articulo && unidadEdit.map((unidad, index) => {
                                const temp: Unidad = {
                                    upc: unidad.upc,
                                    label: unidad.label,
                                    precio: unidad.precio,
                                    cantidad: unidad.cantidad,
                                    estado: unidad.estado,
                                    descripcion: unidad.descripcion,
                                    fechaCreacion: new Date(),
                                }
                                return (
                                    <UnidadCard key={index} handleDeleteUnidad={handleDeleteUnidad} idImagen={undefined} idArticulo={articulo.idArticulo} unidad={temp} editArticulo={editMode} editUnidad={editUnidad} setEditUnidad={handleEditUnidad} token={token} nuevo={true} />
                                )
                            })}
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
                    </label>
                </section>
            </main>
        </ReloadContext.Provider>
    )
}