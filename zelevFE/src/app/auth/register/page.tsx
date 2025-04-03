"use client";

import { Post } from "@/lib/scripts/fetch";
import { token } from "@/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Login() {

    const [url, setUrl] = useState("");

    useEffect(() => {
        if (window.location !== undefined) {
            setUrl(sessionStorage.getItem("currentPath") ?? "/");
        }
    },[]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const jsonData = {
            cedula: formData.get("cedula") as string,
            nombres: formData.get("nombres") as string,
            apellidos: formData.get("apellidos") as string,
            nombreUsuario: formData.get("username") as string,
            fechaNacimiento: formData.get("fechaNacimiento") as string,
            telefono: formData.get("telefono") as string,
            email: formData.get("email") as string,
            direccion: formData.get("direccion") as string,
            contrasena: formData.get("password") as string,
        }

        const confirmPassword = formData.get("confirmPassword");

        if (jsonData.contrasena !== confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Error",
                text: "Las contraseñas no coinciden",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            }).then(() => {
                (document.getElementById("password") as HTMLInputElement)!.value = "";
                (document.getElementById("confirmPassword") as HTMLInputElement)!.value = "";
            });
            return;
        }

        const { data, status } = await Post("/auth/register", "", jsonData);

        if (status !== 200) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al crear la cuenta, por favor intenta nuevamente",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
                background: "#1A1A1A",
                color: "#fff",
            });
            return;
        }

        const userData: token = data.data;
        document.cookie = `token=${userData.token}; path=/;`;

        Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Tu cuenta ha sido creada con éxito",
            timer: 1000,
            timerProgressBar: true,
            background: "#1A1A1A",
            color: "#fff",
            showConfirmButton: false,
        }).then(() => {
            window.location.href = url || "/";
        });

    };

    return (
        <>
            <div className="fixed top-0 left-0 z-50 hover:font-bold p-4 md:p-8">
                <Link href="/" className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z" /></svg>
                    <h1>Inicio</h1>
                </Link>
            </div>
            <main className="w-full h-dvh flex items-center justify-center">
                <section className="md:w-[60%] w-[90%] flex max-md:flex-col gap-6">
                    <header className="w-full md:w-1/2 flex flex-col items-center justify-center">
                        <h1 className="font-Quintessential text-5xl text-center pt-16 md:pt-6">ZELÉV</h1>
                        <p className="font-Quintessential text-center text-white/50 text-2xl p-4">Haz parte de este exclusivo mundo</p>
                        <figure className="max-w-[50%] rounded-4xl overflow-hidden shadow-2xl shadow-white/20">
                            <Image
                                src="/logo/largeLogo.webp"
                                alt="Logo de ZELÉV"
                                height={1000}
                                width={1000}
                                className="object-cover object-center"
                            />
                        </figure>
                    </header>
                    <article className="w-full md:w-1/2 flex flex-col items-center justify-center rounded-4xl shadow-2xl shadow-white/5 pb-4">
                        <h2 className="font-Quintessential text-center text-white/80 text-2xl p-4">Registrate</h2>
                        <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
                            <div id="step-1" className="flex flex-col items-center gap-4">
                                <label htmlFor="cedula" className="sr-only">Cédula</label>
                                <input
                                    id="cedula"
                                    name="cedula"
                                    type="number"
                                    placeholder="Cédula"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <label htmlFor="nombres" className="sr-only">Nombres</label>
                                <input
                                    id="nombres"
                                    name="nombres"
                                    type="text"
                                    placeholder="Nombres"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <label htmlFor="apellidos" className="sr-only">Apellidos</label>
                                <input
                                    id="apellidos"
                                    name="apellidos"
                                    type="text"
                                    placeholder="Apellidos"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <label htmlFor="fechaNacimiento" className="sr-only">Fecha de Nacimiento</label>
                                <input
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    type="date"
                                    title="Fecha de Nacimiento"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <label htmlFor="telefono" className="sr-only">Número Telefónico</label>
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    placeholder="Número Telefónico"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById('step-1')!.style.display = 'none';
                                        document.getElementById('step-2')!.style.display = 'flex';
                                    }}
                                    className="w-full max-w-[300px] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    Siguiente
                                </button>
                            </div>
                            <div id="step-2" className="flex-col items-center gap-4 hidden">
                                <label htmlFor="username" className="sr-only">Nombre de Usuario</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Nombre de Usuario"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <label htmlFor="email" className="sr-only">Correo electrónico</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Correo electrónico"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <label htmlFor="direccion" className="sr-only">Dirección</label>
                                <input
                                    id="direccion"
                                    name="direccion"
                                    type="text"
                                    placeholder="Dirección"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <label htmlFor="password" className="sr-only">Contraseña</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Contraseña"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <label htmlFor="confirmPassword" className="sr-only">Confirmar Contraseña</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirmar Contraseña"
                                    required
                                    className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <div className="flex items-center gap-4 w-full">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            document.getElementById('step-1')!.style.display = 'flex';
                                            document.getElementById('step-2')!.style.display = 'none';
                                        }}
                                        className="w-full max-w-[300px] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        className="w-full max-w-[300px] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            </div>
                        </form>
                        <footer className="text-white/50 text-sm mt-4">
                            ¿Ya tienes una cuenta? <Link href="/auth/login" className="text-blue-500 hover:underline">Inicia sesión</Link>
                        </footer>
                    </article>
                </section>
            </main>
        </>
    );
}