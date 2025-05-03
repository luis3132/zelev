"use client";

import { CancelIcon, DeleteIcon, Edit, SaveIcon } from '@/components/icons/icons';
import { Put, Get } from '@/lib/scripts/fetch';
import { Rol, Usuario, UsuarioUpdate } from '@/lib/types/types';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function Home() {
    const id = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [usuario, setUsuario] = useState<Usuario>();
    const [roles, setRoles] = useState<Rol[]>([]);
    const [usuarioEdit, setUsuarioEdit] = useState<UsuarioUpdate>();
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");
    const [token, setToken] = useState<string>("");
    const fotoRef = useRef("");

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const { data, status } = await Get(`/api/usuario/${id.id}`, token);
                if (status === 200) {
                    const usr = data as Usuario;
                    setUsuario(usr);
                    const edit = {
                        ...usr,
                        imagen: usr.imagen.idImagen,
                        nuevosRoles: [],
                        eliminarRoles: []
                    }
                    setUsuarioEdit(edit);
                } else {
                    throw new Error('Error al cargar el usuario');
                }
            } catch (error) {
                console.error("Error cargando usuario:", error);
            }
        }
        if (typeof window !== undefined) {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        if (token && id) {
            fetchUsuario();
        }
    }, [token, id]);

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
            try {
                const { data, status } = await Get(`/api/rol/list`, token);
                if (status === 200) {
                    setRoles(data);
                } else {
                    throw new Error('Error al cargar los roles');
                }
            } catch (error) {
                console.error("Error cargando roles:", error);
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
        if (id.id === "123456") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No puedes editar este usuario',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                background: "#1A1A1A",
                color: "#fff",
            });
            return;
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === "rol") {
            const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions);
            const selectedValues = selectedOptions.map(option => parseInt(option.value));

            setUsuarioEdit(prevState => {
                const currentRoleIds = usuario?.roles.map(r => r.idRol) || [];
                return {
                    ...prevState,
                    roles: roles.filter(rol => selectedValues.includes(rol.idRol)),
                    nuevosRoles: selectedValues
                        .filter(id => !currentRoleIds.includes(id))
                        .map(Number),
                    eliminarRoles: currentRoleIds
                        .filter(id => !selectedValues.includes(id))
                        .map(Number)
                } as UsuarioUpdate;
            });
            return;
        }
        setUsuarioEdit({
            ...usuarioEdit,
            [e.target.name]: e.target.value
        } as UsuarioUpdate);
    }

    const deleteImage = async () => {
        let usr = usuarioEdit as UsuarioUpdate;
        usr.imagen = 0;
        const { status} = await Put(`/api/usuario/update`, token, usr);
        if (status === 200) {
            setFoto("/logo/logo.png");
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Imagen eliminada correctamente',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                background: "#1A1A1A",
                color: "#fff",
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar la imagen',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                background: "#1A1A1A",
                color: "#fff",
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (usuarioEdit) {
            const { status } = await Put(`/api/usuario/update`, token, usuarioEdit);
            if (status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Usuario actualizado correctamente',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                    background: "#1A1A1A",
                    color: "#fff",
                }).then(() => {
                    window.location.href = "/admin/usuarios";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al actualizar el usuario',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                    background: "#1A1A1A",
                    color: "#fff",
                });
            }
        }
    };

    return (
        <main className='w-full h-full flex flex-col items-center md:justify-center pt-5'>
            <section className='w-[90%] md:w-[80%] max-md:max-h-[90%] overflow-y-scroll rounded-2xl shadow-2xl shadow-white/10 p-5'>
                {usuario ? (
                    <h1 className='text-center font-Quintessential text-4xl md:text-6xl'>Perfil de {usuario.nombres}</h1>
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
                                <div>
                                    <label htmlFor='estado' className='text-lg font-bold'>Estado:</label>
                                    <input
                                        id="estado"
                                        type="text"
                                        name="estado"
                                        value={usuario?.estado || ""}
                                        disabled
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    />
                                </div>
                                <div>
                                    <label htmlFor='rol' className='text-lg font-bold'>Roles:</label>
                                    <select
                                        id="rol"
                                        name="rol"
                                        multiple
                                        disabled
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    >
                                        {usuario?.roles.map((rol, i) => (
                                            <option key={i}>
                                                {rol.rol}
                                            </option>
                                        ))}
                                    </select>
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
                        </div>
                        <div className='w-full md:w-3/4 p-2'>
                            <form
                                id="formUpate"
                                className='flex flex-col gap-2 w-full'
                                onSubmit={(e) => handleSubmit(e)}
                            >
                                <div>
                                    <label htmlFor='estado' className='text-lg font-bold'>Estado:</label>
                                    <select
                                        id="estado"
                                        name="estado"
                                        value={usuarioEdit?.estado}
                                        onChange={handleChange}
                                        className='w-full p-2 border border-gray-300 rounded-md bg-black'
                                    >
                                        <option value="ACTIVO">Activo</option>
                                        <option value="INACTIVO">Inactivo</option>
                                        <option value="BLOQUEADO">Bloqueado</option>
                                        <option value="ELIMINADO">Eliminado</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor='rol' className='text-lg font-bold'>Roles:</label>
                                    <select
                                        id="rol"
                                        name="rol"
                                        multiple
                                        value={usuarioEdit?.roles?.map(rol => String(rol.idRol))}
                                        onChange={handleChange}
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                    >
                                        {roles?.map((rol, i) => (
                                            <option key={i} value={rol.idRol}>
                                                {rol.rol}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className='w-full flex md:justify-end pt-4'>
                    <div className='w-full md:w-3/4 md:flex md:justify-end gap-4'>
                        {isEditing ? (
                            <>
                                <button
                                    className='bg-red-500/50 hover:bg-red-600/50 text-white font-bold py-2 gap-1 px-3 mb-3 rounded-lg max-md:w-full shadow-md shadow-red-500/50 transition duration-300 ease-in-out flex items-center justify-center'
                                    onClick={deleteImage}
                                >
                                    <DeleteIcon />
                                    Borrar Foto
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
                    </div>
                </div>
            </section>
        </main >
    );
};