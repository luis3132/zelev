"use client";
import PedidoCard from "@/components/pedido/pedidoCard";
import { Get } from "@/lib/scripts/fetch";
import { Pedido } from "@/lib/types/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { id } = useParams();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        const fetchPedidos = async () => {
            const { status, data } = await Get(`/api/pedido/list/${id}`, token);
            if (status === 200) {
                setPedidos(data);
            }
        };

        if (typeof window !== "undefined" && token === "") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }

        if (token && id) {
            fetchPedidos();
        }
    }, [token, id]);

    return (
        <>
            <div className="w-full h-full flex flex-col justify-center items-center">
                <h1 className="text-6xl font-bold text-white mb-6 font-Quintessential">Pedidos</h1>
                <aside className="w-full max-md:mx-2 md:w-1/2 flex flex-col justify-center items-center p-3 mb-5">
                    <div className="bg-black shadow-lg rounded-lg p-6 flex w-full gap-6">
                        <Link href="/admin/pedidos" className="flex justify-center items-center rounded-lg p-2 bg-gray-700 w-full">
                            <p>Proceso</p>
                        </Link>
                        <Link href="/admin/pedidos/ENVIADO" className={`flex justify-center items-center rounded-lg p-2 ${id === "ENVIADO" ? "bg-gray-600" : "bg-gray-700"} w-full`}>
                            <p>Enviado</p>
                        </Link>
                        <Link href="/admin/pedidos/ENTREGADO" className={`flex justify-center items-center rounded-lg p-2 ${id === "ENTREGADO" ? "bg-gray-600" : "bg-gray-700"} w-full`}>
                            <p>Entregado</p>
                        </Link>
                        <Link href="/admin/pedidos/CANCELADO" className={`flex justify-center items-center rounded-lg p-2 ${id === "CANCELADO" ? "bg-gray-600" : "bg-gray-700"} w-full`}>
                            <p>Cancelado</p>
                        </Link>
                    </div>
                </aside>
                <main className="max-h-[70vh] h-[70vh] p-5 bg-black rounded-lg w-full max-md:mx-2 md:w-8/10 overflow-y-scroll">
                    {pedidos.length > 0 && (
                        pedidos.reverse().map((pedido) => (
                            <PedidoCard key={pedido.idPedido} pedido={pedido} />
                        ))
                    )}
                </main>
            </div>
        </>
    )
}