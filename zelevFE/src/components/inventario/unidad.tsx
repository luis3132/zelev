import { Imagen, ImgArtUniCreate, Unidad, UnidadCreate } from "@/lib/types/types";
import { ChangeEvent, FC, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { CancelIcon, DeleteIcon, Edit, SaveIcon } from "../icons/icons";
import Swal from "sweetalert2";
import { ReloadContext } from "@/lib/hooks/reload";
import { Get, Post, Put, UploadPost } from "@/lib/scripts/fetch";
import Image from "next/image";

interface UnidadProps {
    unidad: Unidad;
    editArticulo: boolean;
    editUnidad: boolean;
    setEditUnidad: () => void;
    token: string;
    idArticulo: number;
    nuevo: boolean;
    idImagen: Imagen | undefined;
}

const UnidadCard: FC<UnidadProps> = ({ unidad, editArticulo, editUnidad, setEditUnidad, token, idArticulo, nuevo, idImagen }) => {

    const [editMode, setEditMode] = useState(false);
    const { update } = useContext(ReloadContext);
    const [file, setFile] = useState<File>();
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");
    const [alt, setAlt] = useState<string>("");
    const fotoRef = useRef("");
    const [unidadState, setUnidadState] = useState<UnidadCreate>({
        upc: unidad.upc,
        label: unidad.label,
        precio: unidad.precio,
        cantidad: unidad.cantidad,
        estado: unidad.estado,
        descripcion: unidad.descripcion,
        articulo: idArticulo
    } as UnidadCreate);

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
        if (idImagen) {
            fetchImagenes(idImagen.idImagen);
            setAlt(idImagen.alt);
        } else {
            setFoto("/logo/largeLogo.webp");
        }
        return () => {
            if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
        };
    }, []);

    const handleEdit = () => {
        if (editArticulo || editUnidad) {
            Swal.fire({
                title: "No se puede editar la unidad",
                text: "Primero guarda los cambios del artículo o de la unidad",
                icon: "warning",
                timer: 2000,
                showConfirmButton: false,
                background: "#000000",
                color: "#fff",
            });
            return;
        }
        setEditMode(!editMode);
        setEditUnidad();
    }

    const handleCancelar = () => {
        setUnidadState({
            upc: unidad.upc,
            label: unidad.label,
            precio: unidad.precio,
            cantidad: unidad.cantidad,
            estado: unidad.estado,
            descripcion: unidad.descripcion,
            articulo: idArticulo
        } as UnidadCreate);
        setEditMode(false);
        setEditUnidad();
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
            const imagen = idImagen;
            let alt = "";
            if (imagen) {
                alt = imagen.alt;
            } else {
                alt = (document.getElementById("alt") as HTMLInputElement)?.value || "";
            }
            formData.append("imagen", file);
            formData.append("ruta", "article/unid");
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
        if (editArticulo) {
            Swal.fire({
                title: "No se puede editar la unidad",
                text: "Primero guarda los cambios del artículo o de la unidad",
                icon: "warning",
                timer: 2000,
                showConfirmButton: false,
                background: "#000000",
                color: "#fff",
            });
            return;
        }

        if (unidadState.descripcion === "" || unidadState.cantidad <= 0 || unidadState.label === "" || parseInt(unidadState.precio) <= 0) {
            Swal.fire({
                title: "Error",
                text: "Por favor completa todos los campos",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
                background: "#000000",
                color: "#fff",
            });
            return;
        }
        let ImgArtUni: ImgArtUniCreate | undefined = undefined;
        if (file) {
            const imagen = await loadImage();
            const temp = idImagen?.url;
            if (imagen && !temp) {
                ImgArtUni = {
                    articulo: idArticulo,
                    unidad: unidad.upc,
                    imagen: imagen.idImagen
                }
            }
        }

        const data: UnidadCreate = {
            upc: unidad.upc,
            label: unidadState.label,
            precio: unidadState.precio,
            cantidad: unidadState.cantidad,
            estado: unidadState.estado,
            descripcion: unidadState.descripcion,
            articulo: idArticulo,
            imagen: ImgArtUni
        }
        let status1;
        if (nuevo) {
            const { status } = await Post(`/api/unidad/new`, token, data);
            status1 = status;
        } else {
            const { status } = await Put(`/api/unidad/${unidad.upc}`, token, data);
            status1 = status;
        }

        if (status1 === 200) {
            await Swal.fire({
                title: "Unidad actualizada",
                text: "La unidad se ha actualizado correctamente",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                background: "#000000",
                color: "#fff",
            });
            setEditMode(false);
            setEditUnidad();
            update();
        } else {
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar la unidad",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
                background: "#000000",
                color: "#fff",
            });
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === "cantidad") {
            setUnidadState({
                ...unidadState,
                cantidad: parseInt(e.target.value)
            })
        }
        setUnidadState({
            ...unidadState,
            [e.target.name]: e.target.value
        })
    }

    return (
        <form className="flex flex-col gap-2 bg-gray-700 p-2 rounded-lg" onSubmit={handleSubmit}>
            <h1 className="text-lg font-bold">{unidadState.upc}</h1>
            <div className="w-full flex flex-col justify-center items-center max-h-[80vh]">
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
            <label className="flex flex-col">
                <span className="font-bold">Descripción:</span>
                <input
                    id="descripcion"
                    name="descripcion"
                    type="text"
                    maxLength={200}
                    value={unidadState.descripcion || ""}
                    onChange={(e) => handleChange(e)}
                    className="border rounded p-2"
                    disabled={!editMode}
                    autoFocus
                />
            </label>
            <label className="flex flex-col">
                <span className="font-bold">Cantidad:</span>
                <input
                    id="cantidad"
                    name="cantidad"
                    type="number"
                    value={unidadState.cantidad}
                    onChange={(e) => handleChange(e)}
                    className="border rounded p-2"
                    disabled={!editMode}
                />
            </label>
            <label className="flex flex-col">
                <span className="font-bold">Etiqueta:</span>
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: unidadState.label }}
                    ></div>
                    <input
                        id="label"
                        name="label"
                        type="color"
                        value={unidadState.label}
                        onChange={(e) => handleChange(e)}
                        className="border rounded p-2"
                        disabled={!editMode}
                    />
                </div>
            </label>
            <label className="flex flex-col">
                <span className="font-bold">Precio:</span>
                <input
                    id="precio"
                    name="precio"
                    type="number"
                    value={unidadState.precio}
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
                    value={unidadState.estado}
                    onChange={(e) => handleChange(e)}
                    className="border rounded p-2"
                    disabled={!editMode}
                >
                    <option className="text-black" value="STOCK">STOCK</option>
                    <option className="text-black" value="NOSTOCK">NOSTOCK</option>
                    <option className="text-black" value="SOLICITADO">SOLICITADO</option>
                </select>
            </label>
            <div className={`flex ${editMode ? "justify-around" : "justify-end"} items-center`}>
                {editMode && (
                    <>
                        <button
                            type="submit"
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex gap-2 items-center"
                        >
                            <SaveIcon />
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex gap-2 items-center"
                        >
                            <DeleteIcon />
                            Eliminar
                        </button>
                        <button
                            type="button"
                            onClick={() => { handleCancelar() }}
                            className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 flex gap-2 items-center"
                        >
                            <CancelIcon />
                            Cancelar
                        </button>
                    </>
                )}
                {!editMode && (
                    <button
                        onClick={handleEdit}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex gap-2 items-center"
                    >
                        <Edit />
                        Editar
                    </button>
                )}
            </div>
        </form>
    )
}

export default UnidadCard;