"use client";

import { Admin, CancelIcon, DeleteIcon, Edit, LogOut, SaveIcon } from '@/components/icons/icons';
import Ciudades from '@/components/profile/ciudades';
import Departamentos from '@/components/profile/departamentos';
import DecodeUsr from '@/lib/scripts/decodeUser';
import { Delete, Put, UploadPost, Get } from '@/lib/scripts/fetch';
import { Imagen, Usuario, UsuarioUpdate } from '@/lib/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function Home() {
    const [isEditing, setIsEditing] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [usuarioEdit, setUsuarioEdit] = useState<UsuarioUpdate | null>(null);
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");
    const [token, setToken] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const fotoRef = useRef("");

    useEffect(() => {
        if (typeof window !== undefined) {
            const usuarioString = sessionStorage.getItem("usuario");
            if (!usuarioString) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se ha encontrado el usuario, por favor inicie sesión nuevamente.',
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3085d6",
                    background: "#1A1A1A",
                    color: "#fff",
                }).then(() => {
                    sessionStorage.setItem("currentPath", window.location.pathname);
                    document.cookie = "token=; path=/;";
                    window.location.href = "/auth/login";
                });
            }
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
            const parsedUsuario = DecodeUsr(usuarioString ? usuarioString : "");
            if (parsedUsuario) {
                setUsuario(parsedUsuario.usuario);
                if (parsedUsuario.usuario) {
                    setUsuarioEdit({
                        cedula: parsedUsuario.usuario.cedula,
                        nombres: parsedUsuario.usuario.nombres,
                        apellidos: parsedUsuario.usuario.apellidos,
                        email: parsedUsuario.usuario.email,
                        fechaNacimiento: parsedUsuario.usuario.fechaNacimiento,
                        departamento: parsedUsuario.usuario.departamento,
                        ciudad: parsedUsuario.usuario.ciudad,
                        telefono: parsedUsuario.usuario.telefono,
                        zipcode: parsedUsuario.usuario.zipcode,
                        direccion: parsedUsuario.usuario.direccion,
                        estado: parsedUsuario.usuario.estado,
                    } as UsuarioUpdate);
                }
            }
        }
    }, []);

    useEffect(() => {
        const fetchImagen = async () => {
            try {
                const { data, status } = await Get(`/api/imagen/${usuario?.imagen.idImagen}`, token, undefined, true);

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

        if (usuario?.imagen?.idImagen) {
            fetchImagen();
        }

        return () => {
            if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
        };
    }, [token, usuario]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUsuarioEdit({
            ...usuarioEdit,
            [e.target.name]: e.target.value
        } as UsuarioUpdate);
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

    const handleLogOut = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Podrás volver a acceder a tu cuenta mas tarde!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            background: "#1A1A1A",
            color: "#fff",
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("usuario");
                document.cookie = "token=; path=/;";
                window.location.href = "/";
            }
        });
    }

    const loadImage = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("imagen", file);
            formData.append("ruta", "profile");
            formData.append("existe", usuario?.imagen ? usuario.imagen.idImagen.toString() : "false");
            formData.append("alt", "Imagen de perfil de " + usuario?.nombres);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Verificar si hay cambios reales
        const hasChanges = !(
            usuario?.nombres === usuarioEdit?.nombres &&
            usuario?.apellidos === usuarioEdit?.apellidos &&
            usuario?.email === usuarioEdit?.email &&
            usuario?.fechaNacimiento === usuarioEdit?.fechaNacimiento &&
            usuario?.departamento === usuarioEdit?.departamento &&
            usuario?.ciudad === usuarioEdit?.ciudad &&
            usuario?.telefono === usuarioEdit?.telefono &&
            usuario?.zipcode === usuarioEdit?.zipcode &&
            usuario?.direccion === usuarioEdit?.direccion
        );

        if (!hasChanges && !file) {
            await Swal.fire({
                icon: 'info',
                title: 'Sin cambios',
                text: 'No se han realizado cambios en el perfil.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            });
            return;
        }

        // Validar código postal
        if (usuarioEdit && !usuarioEdit.zipcode) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El código postal no es válido.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            });
            return;
        }

        let idImagen: number | null = null;

        // Procesar imagen si existe
        if (file) {
            try {
                const data = await loadImage();
                if (data) {
                    idImagen = data.idImagen;
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se ha podido cargar la imagen.',
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#3085d6",
                        background: "#1A1A1A",
                        color: "#fff",
                    });
                    return;
                }
            } catch (error) {
                console.error("Error cargando imagen:", error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar la imagen.',
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3085d6",
                    background: "#1A1A1A",
                    color: "#fff",
                });
                return;
            }
        }

        // Actualizar usuario
        if (usuarioEdit) {
            try {
                const { status } = await Put("/api/usuario/update", token, {
                    ...usuarioEdit,
                    imagen: idImagen ?? usuario?.imagen?.idImagen ?? null,
                });

                if (status !== 200) {
                    throw new Error('Error en la actualización');
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Perfil actualizado correctamente.',
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3085d6",
                    background: "#1A1A1A",
                    color: "#fff",
                });

                window.location.reload();
            } catch (error) {
                console.error("Error actualizando perfil:", error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se ha podido actualizar el perfil.',
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3085d6",
                    background: "#1A1A1A",
                    color: "#fff",
                });
            }
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás recuperar tu cuenta después de esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar cuenta',
            background: "#1A1A1A",
            color: "#fff",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = `/api/usuario/delete/${usuario?.cedula}`;
                const { status } = await Delete(url, token);
                if (status !== 200) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se ha podido eliminar la cuenta.',
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#3085d6",
                        background: "#1A1A1A",
                        color: "#fff",
                    });
                    return;
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Cuenta eliminada correctamente.',
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3085d6",
                    background: "#1A1A1A",
                    color: "#fff",
                }).then(() => {
                    sessionStorage.removeItem("usuario");
                    document.cookie = "token=; path=/;";
                    window.location.href = "/";
                });
            }
        });
    }

    return (
        <main className='w-full h-full flex flex-col items-center md:justify-center pt-5'>
            <section className='w-[90%] md:w-[80%] max-md:max-h-[90%] overflow-y-scroll rounded-2xl shadow-2xl shadow-white/10 p-5'>
                {usuario ? (
                    <h1 className='text-center font-Quintessential text-4xl md:text-6xl'>Bienvendido {usuario.nombres}</h1>
                ) : (
                    <h1 className='text-center font-Quintessential text-6xl'>Perfil</h1>
                )}
                {!isEditing ? (
                    <div className='w-full flex max-md:flex-col justify-between'>
                        <div className='w-full h-inherit md:w-1/4 p-2 flex items-center justify-center'>
                            <div className='max-w-52'>
                                <Image
                                    src={foto}
                                    alt="Foto de perfil"
                                    width={500}
                                    height={500}
                                    className='rounded-2xl object-cover shadow-2xl shadow-white/5'
                                />
                            </div>
                        </div>
                        <div className='w-full md:w-3/4 p-2'>
                            <form className='flex flex-col gap-2 w-full'>
                                <div className='flex max-md:flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="name" className='font-medium text-gray-300'>Nombres:</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={usuario?.nombres ?? ""}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="lastname" className='font-medium text-gray-300'>Apellidos:</label>
                                        <input
                                            id="lastname"
                                            type="text"
                                            value={usuario?.apellidos ?? ""}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                </div>
                                <div className='flex max-md:flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="email" className='font-medium text-gray-300'>Correo:</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={usuario?.email ?? ""}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="birthdate" className='font-medium text-gray-300'>Fecha de Nacimiento:</label>
                                        <input
                                            id="birthdate"
                                            type="date"
                                            value={usuario?.fechaNacimiento.toString().split("T")[0] ?? ""}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                </div>
                                <div className='flex max-md:flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="departament" className='font-medium text-gray-300'>Departamento:</label>
                                        <input
                                            id="departament"
                                            type="text"
                                            value={usuario?.departamento ?? "Agrega este campo!"}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="citie" className='font-medium text-gray-300'>Ciudad:</label>
                                        <input
                                            id="citie"
                                            type="text"
                                            value={usuario?.ciudad ?? "Agrega este campo!"}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                </div>
                                <div className='flex max-md:flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="phone" className='font-medium text-gray-300'>Teléfono:</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={usuario?.telefono ?? ""}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="zipcode" className='font-medium text-gray-300'>Codigo Postal:</label>
                                        <input
                                            id="zipcode"
                                            type="number"
                                            value={usuario?.zipcode ?? 0}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="adress" className='font-medium text-gray-300'>Direccion:</label>
                                        <input
                                            id="adress"
                                            type="text"
                                            value={usuario?.direccion ?? ""}
                                            disabled
                                            className='p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400'
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className='w-full flex max-md:flex-col justify-between'>
                        <div className='w-full h-inherit md:w-1/4 p-2 flex flex-col items-center justify-center'>
                            <div className='max-w-52'>
                                <Image
                                    src={foto}
                                    alt="Foto de perfil"
                                    width={500}
                                    height={500}
                                    className='rounded-2xl object-cover shadow-2xl shadow-white/5'
                                />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="profileImage" className='font-medium text-gray-300'>Foto de Perfil:</label>
                                <input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e)}
                                    className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>
                        </div>
                        <div className='w-full md:w-3/4 p-2'>
                            <form
                                id="formUpate"
                                className='flex flex-col gap-2 w-full'
                                onSubmit={(e) => handleSubmit(e)}
                            >
                                <div className='flex max-md:flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="name" className='font-medium text-gray-300'>Nombres:</label>
                                        <input
                                            id="name"
                                            name="nombres"
                                            type="text"
                                            value={usuarioEdit?.nombres ?? ""}
                                            required
                                            autoFocus
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="lastname" className='font-medium text-gray-300'>Apellidos:</label>
                                        <input
                                            id="lastname"
                                            name="apellidos"
                                            type="text"
                                            required
                                            autoFocus
                                            value={usuarioEdit?.apellidos ?? ""}
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                </div>
                                <div className='flex max-md:flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="email" className='font-medium text-gray-300'>Correo:</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoFocus
                                            value={usuarioEdit?.email ?? ""}
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="birthdate" className='font-medium text-gray-300'>Fecha de Nacimiento:</label>
                                        <input
                                            id="birthdate"
                                            name="fechaNacimiento"
                                            type="date"
                                            required
                                            autoFocus
                                            value={usuarioEdit?.fechaNacimiento.toString().split("T")[0] ?? ""}
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                </div>
                                <div className='flex max-md:flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="departament" className='font-medium text-gray-300'>Departamento:</label>
                                        <select
                                            id="departament"
                                            name="departamento"
                                            required
                                            autoFocus
                                            value={usuarioEdit?.departamento}
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        >
                                            <Departamentos />
                                        </select>
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="citie" className='font-medium text-gray-300'>Ciudad:</label>
                                        <select
                                            id="citie"
                                            name="ciudad"
                                            required
                                            autoFocus
                                            value={usuarioEdit?.ciudad}
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        >
                                            <Ciudades departamento={usuarioEdit?.departamento} />
                                        </select>
                                    </div>
                                </div>
                                <div className='flex max-md:flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="phone" className='font-medium text-gray-300'>Teléfono:</label>
                                        <input
                                            id="phone"
                                            name="telefono"
                                            type="tel"
                                            required
                                            autoFocus
                                            value={usuarioEdit?.telefono ?? ""}
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="zipcode" className='font-medium text-gray-300'>Codigo Postal:</label>
                                        <input
                                            id="zipcode"
                                            name="zipcode"
                                            type="number"
                                            required
                                            autoFocus
                                            value={usuarioEdit?.zipcode ?? 0}
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="adress" className='font-medium text-gray-300'>Direccion:</label>
                                        <input
                                            id="adress"
                                            name="direccion"
                                            type="text"
                                            required
                                            autoFocus
                                            value={usuarioEdit?.direccion ?? ""}
                                            onChange={(e) => handleChange(e)}
                                            className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className='w-full flex md:justify-end pt-4'>
                    <div className='w-full md:w-3/4 md:flex md:justify-end gap-4'>
                        {usuario && usuario?.roles.length > 1 && (
                            <Link
                                href={"/admin"}
                                className='bg-cyan-300/50 hover:bg-cyan-400/50 text-white font-bold py-2 gap-1 px-3 mb-3 rounded-lg max-md:w-full shadow-md shadow-cyan-300/50 transition duration-300 ease-in-out flex items-center justify-center'
                            >
                                <Admin />
                                Administrar
                            </Link>
                        )}
                        {isEditing ? (
                            <>
                                <button
                                    className='bg-red-500/50 hover:bg-red-600/50 text-white font-bold py-2 gap-1 px-3 mb-3 rounded-lg max-md:w-full shadow-md shadow-red-500/50 transition duration-300 ease-in-out flex items-center justify-center'
                                    onClick={handleDelete}
                                >
                                    <DeleteIcon />
                                    Borrar Cuenta
                                </button>
                                <button
                                    className='bg-amber-300/50 hover:bg-amber-400/50 text-white font-bold py-2 gap-1 px-3 mb-3 rounded-lg max-md:w-full shadow-md shadow-amber-300/50 transition duration-300 ease-in-out flex items-center justify-center'
                                    onClick={handleEditToggle}
                                >
                                    <CancelIcon />
                                    Cancelar
                                </button>
                                <button
                                    className='bg-green-400/50 hover:bg-green-500/50 text-white font-bold py-2 gap-1 px-3 mb-3 rounded-lg max-md:w-full shadow-md shadow-green-400/50 transition duration-300 ease-in-out flex items-center justify-center'
                                    form='formUpate'
                                    type='submit'
                                >
                                    <SaveIcon />
                                    Guardar
                                </button>
                            </>
                        ) : (
                            <button
                                className='bg-amber-300/50 hover:bg-amber-400/50 text-white font-bold py-2 gap-1 px-3 mb-3 rounded-lg max-md:w-full shadow-md shadow-amber-300/50 transition duration-300 ease-in-out flex items-center justify-center'
                                onClick={handleEditToggle}
                            >
                                <Edit />
                                Editar
                            </button>
                        )}
                        <button
                            className='bg-red-500/50 hover:bg-red-600/50 text-white font-bold py-2 gap-1 px-3 mb-3 rounded-lg max-md:w-full shadow-md shadow-red-500/50 transition duration-300 ease-in-out flex items-center justify-center'
                            onClick={handleLogOut}
                        >
                            <LogOut />
                            LogOut
                        </button>
                    </div>
                </div>
            </section>
        </main >
    );
};