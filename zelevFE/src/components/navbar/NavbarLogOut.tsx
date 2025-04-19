"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, MenuIcon } from "../icons/icons";

export default function NavbarLogOut() {
    const [openMenus, setOpenMenus] = useState(false);
    const [clickedMenu, setClickedMenu] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.location.pathname === "/profile") {
                setClickedMenu("Perfil");
            }
            if (window.location.pathname === "/categoria/hombre") {
                setClickedMenu("HOMBRE");
            }
            if (window.location.pathname === "/categoria/mujer") {
                setClickedMenu("MUJER");
            }
            if (window.location.pathname === "/categoria/nino") {
                setClickedMenu("NINOS");
            }
            if (window.location.pathname === "/categoria/outlet") {
                setClickedMenu("OUTLET");
            }
            if (window.location.pathname === "/") {
                setClickedMenu("");
            }
        }
    }, []);

    const getCurrentPath = () => {
        if (typeof window !== "undefined") {
            return window.location.pathname;
        }
        return "";
    };

    const handleOpenMenus = () => {
        setOpenMenus(!openMenus);
    };

    const clicked = (id: string) => {
        setClickedMenu(id);
        setOpenMenus(false);
    };

    const handleLogin = () => {
        const currentPath = getCurrentPath();
        sessionStorage.setItem("currentPath", currentPath);
        clicked("LogIn");
    }

    return (
        <>
            <div className="w-full pt-2 px-2 fixed z-50 md:h-32 md:top-0 bottom-0 left-0 max-md:pb-2">
                <nav className={`flex flex-col items-end duration-500 transition-all bg-white/25 shadow-lg backdrop-blur-xs 
                    rounded-2xl shadow-white-10 w-full ${openMenus ? "max-md:h-28" : "max-md:h-16"} overflow-hidden`}>
                    <ul className={`w-full flex list-none justify-around text-lg md:hidden overflow-hidden transition-all duration-300 
                        ${openMenus ? "pt-4 pb-1" : "h-0"}`}>
                        <li>
                            <Link
                                href="/categoria/hombre"
                                className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "HOMBRE" ? "bg-white/20" : "bg-white/5"}`}
                                onClick={() => clicked("HOMBRE")}
                            >
                                HOMBRE
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/categoria/mujer"
                                className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "MUJER" ? "bg-white/20" : "bg-white/5"}`}
                                onClick={() => clicked("MUJER")}
                            >
                                MUJER
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/categoria/nino"
                                className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "NINOS" ? "bg-white/20" : "bg-white/5"}`}
                                onClick={() => clicked("NINOS")}
                            >
                                NIÑOS
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/categoria/outlet"
                                className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "OUTLET" ? "bg-white/20" : "bg-white/5"}`}
                                onClick={() => clicked("OUTLET")}
                            >
                                OUTLET
                            </Link>
                        </li>
                    </ul>
                    <div className="w-full flex max-md:flex-row-reverse items-center justify-between min-h-16 overflow-auto">
                        <section className="w-full max-md:flex max-md:justify-end">
                            <ul className="flex list-none gap-4 pl-4 mr-4 text-lg max-md:hidden">
                                <li>
                                    <Link
                                        href="/categoria/hombre"
                                        className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "HOMBRE" ? "bg-white/20" : "bg-white/5"}`}
                                        onClick={() => clicked("HOMBRE")}
                                    >
                                        HOMBRE
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/categoria/mujer"
                                        className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "MUJER" ? "bg-white/20" : "bg-white/5"}`}
                                        onClick={() => clicked("MUJER")}
                                    >
                                        MUJER
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/categoria/nino"
                                        className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "NINOS" ? "bg-white/20" : "bg-white/5"}`}
                                        onClick={() => clicked("NINOS")}
                                    >
                                        NIÑOS
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/categoria/outlet"
                                        className={`cursor-pointer p-2 rounded-lg ${clickedMenu === "OUTLET" ? "bg-white/20" : "bg-white/5"}`}
                                        onClick={() => clicked("OUTLET")}
                                    >
                                        OUTLET
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
                                href="/"
                                onClick={() => clicked("")}
                            >
                                <h1 className="font-Quintessential text-4xl w-min">ZELÉV</h1>
                            </Link>
                        </section>
                        <section className="w-full flex md:justify-end md:pr-4 pl-4">
                            <Link
                                href="/auth/login"
                                className={`flex items-center cursor-pointer p-2 rounded-lg ${clickedMenu === "LogIn" ? "bg-white/20" : "bg-white/5"}`}
                                onClick={handleLogin}
                            >
                                <LogIn />
                                LogIn
                            </Link>
                        </section>
                    </div>
                </nav>
            </div>
        </>
    )
}