import { Carrito, Usuario } from "@/lib/types/types";
import { FC, useEffect, useState } from "react";
import { CancelIcon, CartIcon } from "../icons/icons";
import ItemCarrito from "./itemCarrito";
import DecodeUsr from "@/lib/scripts/decodeUser";
import Swal from "sweetalert2";

interface CarritoProps {
    carrito: Carrito[];
    setCarrito: (carrito: Carrito[]) => void;
}

const CarritoComponent: FC<CarritoProps> = ({ carrito, setCarrito }) => {

    const [showCarrito, setShowCarrito] = useState(false);
    const [usuario, setUsuario] = useState<Usuario>();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCarrito = localStorage.getItem("carrito");
            const storedUsuario = sessionStorage.getItem("usuario");
            if (storedCarrito) {
                setCarrito(JSON.parse(storedCarrito));
            }
            if (storedUsuario) {
                const decodedUsuario = DecodeUsr(storedUsuario);
                if (decodedUsuario && decodedUsuario.usuario) {
                    setUsuario(decodedUsuario.usuario);
                }
            }
        }
    }, [showCarrito]);

    const toggleCarrito = () => {
        setShowCarrito(!showCarrito);
    }

    const handleEliminarItem = (upc: number) => {
        localStorage.removeItem("carrito");
        const updatedCarrito = carrito.filter(item => item.upc !== upc);
        setCarrito(updatedCarrito);
        localStorage.setItem("carrito", JSON.stringify(updatedCarrito));
    }

    const handleComprar = () => {
        if (!usuario) {
            Swal.fire({
                title: "Inicia sesión",
                text: "Debes iniciar sesión para realizar la compra",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Iniciar sesión",
                cancelButtonText: "Cancelar",
                background: "#0f0f0f",
                color: "#fff",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/auth/login";
                }
            });
            return;
        }
        if (usuario.ciudad === "" || !usuario.ciudad) {
            Swal.fire({
                title: "Completa tu información",
                text: "Debes completar tu información para realizar la compra",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Completar información",
                cancelButtonText: "Cancelar",
                background: "#0f0f0f",
                color: "#fff",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/profile";
                }
            });
            return;
        }
    }

    return (
        <>
            <button
                onClick={toggleCarrito}
                className="fixed md:bottom-4 bottom-20 right-4 bg-blue-500 text-white py-2 px-4 flex items-center gap-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
                <CartIcon />
                Carrito
            </button>
            <div className={`fixed md:top-0 bg-white/50 shadow-lg rounded-lg p-4 md:w-[400px] w-full backdrop-blur-sm transition-all duration-300 h-dvh overflow-y-auto z-50 ${showCarrito ? 'md:right-0 max-md:bottom-0' : 'md:-right-full max-md:-bottom-full'}`}>
                <button
                    onClick={toggleCarrito}
                    className="absolute top-4 right-4 p-1 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-800 transition duration-300"
                >
                    <CancelIcon />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center text-black">Carrito</h2>
                <main className="flex flex-col gap-4 max-h-[82vh] h-[82vh] overflow-y-scroll ">
                    {carrito.length > 0 && carrito.map((item, index) => (
                        <ItemCarrito
                            key={index}
                            item={item}
                            eliminarItem={handleEliminarItem}
                        />
                    ))}
                </main>
                <article className="">
                    <h2 className="text-xl font-bold mt-4 text-center text-black">Total: ${carrito.reduce((acc, item) => acc + item.subtotal, 0)}</h2>
                    <button
                        className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-300"
                        onClick={handleComprar}
                    >
                        Comprar
                    </button>
                </article>
            </div>
        </>
    )
}

export default CarritoComponent;