"use client";

import Ciudades from '@/components/profile/ciudades';
import Departamentos from '@/components/profile/departamentos';
import DecodeUsr from '@/lib/scripts/decodeUser';
import { Usuario, UsuarioUpdate } from '@/lib/types/types';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Home() {
    const [isEditing, setIsEditing] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [usuarioEdit, setUsuarioEdit] = useState<UsuarioUpdate | null>(null);
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");

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
            const parsedUsuario = DecodeUsr(usuarioString ? usuarioString : "");
            if (parsedUsuario) {
                setUsuario(parsedUsuario.usuario);
                if (parsedUsuario.usuario) {
                    setUsuarioEdit({
                        nombres: parsedUsuario.usuario.nombres,
                        apellidos: parsedUsuario.usuario.apellidos,
                        email: parsedUsuario.usuario.email,
                        fechaNacimiento: parsedUsuario.usuario.fechaNacimiento,
                        departamento: parsedUsuario.usuario.departamento,
                        ciudad: parsedUsuario.usuario.ciudad,
                        telefono: parsedUsuario.usuario.telefono,
                        zipcode: parsedUsuario.usuario.zipcode,
                        direccion: parsedUsuario.usuario.direccion,
                    } as UsuarioUpdate);
                }
            }
        }
    }, []);

    useEffect(() => {
        console.log(usuario);
        if (usuario && usuario.imagen !== "" && usuario.imagen !== null && usuario.imagen !== undefined) {
            setFoto(usuario.imagen);
        }
    }, [usuario]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUsuarioEdit({
            ...usuarioEdit,
            [e.target.name]: e.target.value
        } as UsuarioUpdate);
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
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                if (event.target?.result) {
                                                    console.log(event.target.result);
                                                    setFoto(event.target.result as string);
                                                }
                                            };
                                            reader.readAsDataURL(e.target.files[0]);
                                        }
                                    }}
                                    className='p-2 border border-gray-400 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
                                            name="nombres"
                                            type="text"
                                            value={usuarioEdit?.nombres ?? ""}
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
                <div>
                    <button onClick={handleEditToggle}>
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                    <button >Change Password</button>
                </div>
            </section>
        </main>
    );
};