"use client";

import { Usuario } from "@/lib/types/types";
import { useEffect, useState } from "react";
import NavbarLogOut from "./NavbarLogOut";
import { Post } from "@/lib/scripts/fetch";
import Swal from "sweetalert2";
import NavbarLogIn from "./NavbarLogIn";
import EncodeUsr from "@/lib/scripts/encodeUser";

export default function MainNavbar() {
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
            const usr: Usuario = data.data;
            setUsuario(usr);
            sessionStorage.setItem("usuario", EncodeUsr(usr));
        }
        if (typeof window !== 'undefined') {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) {
                fetchUsuario(token);
            }
        }
    }, []);

    return (
        <>
            {!usuario && <NavbarLogOut />}
            {usuario && <NavbarLogIn usuario={usuario} />}
        </>
    );
}