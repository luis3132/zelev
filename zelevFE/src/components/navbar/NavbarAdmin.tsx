"use client";

import { Get } from "@/lib/scripts/fetch";
import { Usuario } from "@/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import { MenuIcon } from "../icons/icons";

interface NavbarAdminProps {
    usuario: Usuario;
}

const NavbarAdmin: FC<NavbarAdminProps> = ({ usuario }) => {
    const [openMenus, setOpenMenus] = useState(false);
    const [clickedMenu, setClickedMenu] = useState("");
    const [foto, setFoto] = useState<string>("/logo/logo.png");
    const [token, setToken] = useState<string>("");
    const fotoRef = useRef("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
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
    };

    return (
        <>
            <div className="w-full pt-2 px-2 fixed z-50 md:h-24 md:top-0 bottom-0 left-0 max-md:pb-2">
                <nav className={`flex flex-col items-end duration-500 transition-all bg-white/25 shadow-lg backdrop-blur-xs 
                    rounded-2xl shadow-white-10 w-full ${openMenus ? "max-md:h-32" : "max-md:h-16"} overflow-hidden`}>
                    <ul className={`w-full flex list-none justify-around text-lg md:hidden overflow-hidden overflow-x-scroll gap-2 px-2 transition-all duration-300 
                        ${openMenus ? "pt-4 pb-1" : "h-0"}`}>
                        <li>
                            <Link
                                href="/admin/pedidos"
                                className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "PEDIDOS" ? "bg-white/20" : "bg-white/5"}`}
                                onClick={() => clicked("PEDIDOS")}
                            >
                                PEDIDOS
                            </Link>
                        </li>
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
                        {usuario.roles.find((rol) => rol.rol === "ADMIN") && (
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
                                <li>
                                    <Link
                                        href="/admin/pedidos"
                                        className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "PEDIDOS" ? "bg-white/20" : "bg-white/5"}`}
                                        onClick={() => clicked("PEDIDOS")}
                                    >
                                        PEDIDOS
                                    </Link>
                                </li>
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
                                <li>
                                    <Link
                                        href="/admin/usuarios"
                                        className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "USUARIOS" ? "bg-white/20" : "bg-white/5"}`}
                                        onClick={() => clicked("USUARIOS")}
                                    >
                                        USUARIOS
                                    </Link>
                                </li>
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