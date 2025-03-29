"use client";

import Image from "next/image";
import Link from "next/link";

export default function Login() {
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
                    <header className="w-full md:w-1/2 flex flex-col items-center justify-center pb-4">
                        <h1 className="font-Quintessential text-5xl text-center pt-6 md:pt-10">ZELÉV</h1>
                        <p className="font-Quintessential text-center text-white/50 text-2xl p-4">El privilegio de lo exclusivo, ahora en tus manos.</p>
                        <figure className="max-w-[50%] rounded-4xl overflow-hidden shadow-xl shadow-white/20">
                            <Image
                                src="/logo/largeLogo.webp"
                                alt="Logo de ZELÉV"
                                height={1000}
                                width={1000}
                                className="object-cover object-center"
                            />
                        </figure>
                    </header>
                    <article className="w-full md:w-1/2 flex flex-col items-center justify-center rounded-4xl shadow-2xl shadow-white/10 pb-4">
                        <h2 className="font-Quintessential text-center text-white/80 text-2xl p-4">Iniciar sesión</h2>
                        <form className="flex flex-col items-center gap-4">
                            <label htmlFor="email" className="sr-only">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Correo electrónico"
                                className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Contraseña"
                                className="w-full max-w-[300px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <button
                                className="w-full max-w-[300px] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Iniciar sesión
                            </button>
                        </form>
                        <footer className="text-white/50 text-sm mt-4">
                            ¿No tienes una cuenta? <Link href="/auth/register" className="text-blue-500 hover:underline">Regístrate aquí</Link>
                        </footer>
                    </article>
                </section>
            </main>
        </>
    );
}