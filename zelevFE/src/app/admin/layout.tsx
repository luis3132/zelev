"use client";

import NavbarAdmin from "@/components/navbar/NavbarAdmin";
import EncodeUsr from "@/lib/scripts/encodeUser";
import { Post } from "@/lib/scripts/fetch";
import { Usuario } from "@/lib/types/types";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
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
        if (typeof window !== 'undefined') {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) {
                fetchUsuario(token);
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
        }
    }, []);
    return (
        <>
            {usuario && <NavbarAdmin usuario={usuario} />}
            <div className="w-full h-full md:pt-24">
                {children}
            </div>
        </>
    );
}