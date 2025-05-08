"use client";
import PedidoCard from "@/components/pedido/pedidoCard";
import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Pedido } from "@/lib/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [token, setToken] = useState<string>("");
    const { ReloadContext, loading, loadingUpdate, reload, update } = useReload();

    useEffect(() => {
        const fetchPedidos = async () => {
            const { status, data } = await Get("/api/pedido/list/PROCESO", token);
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

        if (token) {
            fetchPedidos();
        }
    }, [token, reload]);

    return (
        <ReloadContext.Provider value={{ loading, loadingUpdate, reload, update }}>
            <div className="w-full h-full flex flex-col justify-center items-center max-md:pb-20">
                <h1 className="text-6xl font-bold text-white mb-6 mt-5 font-Quintessential">Pedidos</h1>
                <aside className="w-full min-w-min max-md:mx-2 md:w-1/2 flex flex-col justify-center items-center p-3 mb-5">
                    <div className="bg-black shadow-lg rounded-lg p-6 flex max-md:flex-col w-full gap-6">
                        <Link href="/admin/pedidos" className="flex justify-center items-center rounded-lg p-2 bg-gray-600 w-full">
                            <p>Proceso</p>
                        </Link>
                        <Link href="/admin/pedidos/ENVIADO" className="flex justify-center items-center rounded-lg p-2 bg-gray-700 w-full">
                            <p>Enviado</p>
                        </Link>
                        <Link href="/admin/pedidos/ENTREGADO" className="flex justify-center items-center rounded-lg p-2 bg-gray-700 w-full">
                            <p>Entregado</p>
                        </Link>
                        <Link href="/admin/pedidos/CANCELADO" className="flex justify-center items-center rounded-lg p-2 bg-gray-700 w-full">
                            <p>Cancelado</p>
                        </Link>
                    </div>
                </aside>
                <main className="max-h-[70vh] h-[70vh] p-5 bg-black rounded-lg w-full max-md:mx-2 md:w-8/10 overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pedidos.length > 0 && (
                        pedidos.reverse().map((pedido) => (
                            <PedidoCard key={pedido.idPedido} pedido={pedido} />
                        ))
                    )}
                </main>
            </div>
        </ReloadContext.Provider>
    )
}