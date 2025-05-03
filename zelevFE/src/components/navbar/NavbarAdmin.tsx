"use client";

import { Get, Post } from "@/lib/scripts/fetch";
import { Usuario } from "@/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "../icons/icons";
import Swal from "sweetalert2";
import EncodeUsr from "@/lib/scripts/encodeUser";

const NavbarAdmin = () => {
    const [openMenus, setOpenMenus] = useState(false);
    const [clickedMenu, setClickedMenu] = useState("");
    const [foto, setFoto] = useState<string>("/logo/logo.png");
    const [token, setToken] = useState<string>("");
    const fotoRef = useRef("");
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    const fetchUsuario = async (token: string) => {
        const { data, status } = await Post("/auth/verify", "", {
            token: token
        })
        if (status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La sesión ha expirado, por favor inicie sesión nuevamente.',
                timer: 3000,
                timerProgressBar: true,
                background: "#1A1A1A",
                color: "#fff",
            }).then(() => {
                sessionStorage.removeItem("currentPath");
                if (window.location.pathname === "/profile") {
                    sessionStorage.setItem("currentPath", "/");
                } else {
                    sessionStorage.setItem("currentPath", window.location.pathname);
                }
                sessionStorage.removeItem("usuario");
                document.cookie = "token=; path=/;";
                window.location.href = "/auth/login";
            });
        }
        const usr: Usuario = data;
        if (!usr || usr.estado !== "ACTIVO") {
            if (!usr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La sesión ha expirado, por favor inicie sesión nuevamente.',
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#1A1A1A",
                    color: "#fff",
                }).then(() => {
                    sessionStorage.removeItem("currentPath");
                    document.cookie = "token=; path=/;";
                    window.location.href = "/";
                });
                return;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El usuario se encuentra inactivo, por favor contacte al administrador.',
                timer: 3000,
                timerProgressBar: true,
                background: "#1A1A1A",
                color: "#fff",
            }).then(() => {
                sessionStorage.removeItem("currentPath");
                document.cookie = "token=; path=/;";
                window.location.href = "/";
            });
        }
        setUsuario(usr);
        sessionStorage.setItem("usuario", EncodeUsr(usr));
        if (usr.roles.length === 1 && usr.roles[0].rol !== "ADMIN") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El usuario no tiene permisos para acceder a esta sección.',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#1A1A1A",
                color: "#fff",
            }).then(() => {
                sessionStorage.removeItem("currentPath");
                window.location.href = "/";
            });
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) {
                fetchUsuario(token);
                setToken(token);
            } else {
                sessionStorage.removeItem("usuario");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El usuario no tiene permisos para acceder a esta sección.',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    background: "#1A1A1A",
                    color: "#fff",
                }).then(() => {
                    sessionStorage.removeItem("currentPath");
                    window.location.href = "/";
                });
            }
            if (window.location.pathname.startsWith("/admin/profile")) {
                setClickedMenu("Perfil");
            }
            if (window.location.pathname.startsWith("/admin/pedidos")) {
                setClickedMenu("PEDIDOS");
            }
            if (window.location.pathname.startsWith("/admin/inventario")) {
                setClickedMenu("INVENTARIO");
            }
            if (window.location.pathname.startsWith("/admin/categoria")) {
                setClickedMenu("CATEGORIA");
            }
            if (window.location.pathname.startsWith("/admin/usuarios")) {
                setClickedMenu("USUARIOS");
            }
            if (window.location.pathname === "/") {
                setClickedMenu("");
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

    const handleOpenMenus = () => {
        setOpenMenus(!openMenus);
    };

    const clicked = (id: string) => {
        setClickedMenu(id);
        setOpenMenus(false);
        const tempToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (tempToken) {
            fetchUsuario(tempToken);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La sesión ha expirado, por favor inicie sesión nuevamente.',
                timer: 3000,
                timerProgressBar: true,
                background: "#1A1A1A",
                color: "#fff",
            }).then(() => {
                sessionStorage.removeItem("currentPath");
                if (window.location.pathname === "/profile") {
                    sessionStorage.setItem("currentPath", "/");
                } else {
                    sessionStorage.setItem("currentPath", window.location.pathname);
                }
                sessionStorage.removeItem("usuario");
                document.cookie = "token=; path=/;";
                window.location.href = "/auth/login";
            });
        }
    };

    const ADMIN = usuario?.roles.find((rol) => rol.rol === "ADMIN");
    const PEDIDOS = usuario?.roles.find((rol) => rol.rol === "PEDIDOS");
    const INVENTARIO = usuario?.roles.find((rol) => rol.rol === "INVENTARIO");

    return (
        <>
            <div className="w-full pt-2 px-2 fixed z-50 md:h-24 md:top-0 bottom-0 left-0 max-md:pb-2">
                <nav className={`flex flex-col items-end duration-500 transition-all bg-white/25 shadow-lg backdrop-blur-xs 
                    rounded-2xl shadow-white-10 w-full ${openMenus ? "max-md:h-32" : "max-md:h-16"} overflow-hidden`}>
                    <ul className={`w-full flex list-none justify-around text-lg md:hidden overflow-hidden overflow-x-scroll gap-2 px-2 transition-all duration-300 
                        ${openMenus ? "pt-4 pb-1" : "h-0"}`}>
                        {(ADMIN || PEDIDOS) && (
                            <li>
                                <Link
                                    href="/admin/pedidos"
                                    className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "PEDIDOS" ? "bg-white/20" : "bg-white/5"}`}
                                    onClick={() => clicked("PEDIDOS")}
                                >
                                    PEDIDOS
                                </Link>
                            </li>
                        )}
                        {(ADMIN || INVENTARIO) && (
                            <>
                                <li>
                                    <Link
                                        href="/admin/inventario"
                                        className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "INVENTARIO" ? "bg-white/20" : "bg-white/5"}`}
                                        onClick={() => clicked("INVENTARIO")}
                                    >
                                        INVENTARIO
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/categoria"
                                        className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "CATEGORIA" ? "bg-white/20" : "bg-white/5"}`}
                                        onClick={() => clicked("CATEGORIA")}
                                    >
                                        CATEGORIA
                                    </Link>
                                </li></>
                        )}
                        {ADMIN && (
                            <li>
                                <Link
                                    href="/admin/usuarios"
                                    className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "USUARIOS" ? "bg-white/20" : "bg-white/5"}`}
                                    onClick={() => clicked("USUARIOS")}
                                >
                                    USUARIOS
                                </Link>
                            </li>
                        )}
                    </ul>
                    <div className="w-full flex max-md:flex-row-reverse items-center justify-between min-h-16 overflow-auto">
                        <section className="w-full max-md:flex max-md:justify-end">
                            <ul className="flex list-none gap-4 pl-4 mr-4 text-lg max-md:hidden">
                                {(ADMIN || PEDIDOS) && (
                                    <li>
                                        <Link
                                            href="/admin/pedidos"
                                            className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "PEDIDOS" ? "bg-white/20" : "bg-white/5"}`}
                                            onClick={() => clicked("PEDIDOS")}
                                        >
                                            PEDIDOS
                                        </Link>
                                    </li>
                                )}
                                {(ADMIN || INVENTARIO) && (
                                    <>
                                        <li>
                                            <Link
                                                href="/admin/inventario"
                                                className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "INVENTARIO" ? "bg-white/20" : "bg-white/5"}`}
                                                onClick={() => clicked("INVENTARIO")}
                                            >
                                                INVENTARIO
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/admin/categoria"
                                                className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "CATEGORIA" ? "bg-white/20" : "bg-white/5"}`}
                                                onClick={() => clicked("CATEGORIA")}
                                            >
                                                CATEGORIA
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {ADMIN && (
                                    <li>
                                        <Link
                                            href="/admin/usuarios"
                                            className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "USUARIOS" ? "bg-white/20" : "bg-white/5"}`}
                                            onClick={() => clicked("USUARIOS")}
                                        >
                                            USUARIOS
                                        </Link>
                                    </li>
                                )}
                            </ul>
                            <button
                                className={`md:hidden mx-4 flex items-center cursor-pointer w-min duration-300 transition-transform transform 
                                ${openMenus ? "rotate-90" : "rotate-0"}`}
                                onClick={handleOpenMenus}
                            >
                                <MenuIcon />
                            </button>
                        </section>
                        <section className="w-min">
                            <Link
                                className="w-full flex justify-center"
                                href="/admin"
                                onClick={() => clicked("")}
                            >
                                <h1 className="font-Quintessential text-4xl w-min">ZELÉV</h1>
                            </Link>
                        </section>
                        <section className="w-full flex md:justify-end md:pr-4 pl-4">
                            <Link
                                href="/admin/profile"
                                className={`flex items-center cursor-pointer p-2 rounded-lg ${clickedMenu === "Perfil" ? "bg-white/20" : "bg-white/5"}`}
                                onClick={() => clicked("Perfil")}
                            >
                                <Image
                                    src={foto}
                                    alt="Foto del usuario"
                                    width={10}
                                    height={10}
                                    className="w-4 h-4 rounded-full overflow-hidden"
                                    priority
                                />
                                Perfil
                            </Link>
                        </section>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default NavbarAdmin;