"use client";
import PedidoCard from "@/components/pedido/pedidoCard";
import useReload from "@/lib/hooks/reload";
import { Get } from "@/lib/scripts/fetch";
import { Pedido } from "@/lib/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { id } = useParams();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [token, setToken] = useState<string>("");
    const { ReloadContext, loading, loadingUpdate, reload, update } = useReload();

    useEffect(() => {
        const fetchPedidos = async () => {
            const { status, data } = await Get(`/api/pedido/list/usuario/${id}`, token);
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
    }, [token, reload, id]);

    return (
        <ReloadContext.Provider value={{ loading, loadingUpdate, reload, update }}>
            <div className="w-full h-full flex flex-col justify-center items-center max-md:pb-20">
                <h1 className="text-6xl font-bold text-white mb-6 mt-5 font-Quintessential">Pedidos</h1>
                <main className="max-h-[80vh] h-[80vh] p-5 bg-black rounded-lg w-full max-md:mx-2 md:w-8/10 overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pedidos.length > 0 && (
                        pedidos.reverse().map((pedido) => (
                            <PedidoCard key={pedido.idPedido} pedido={pedido} cliente={true} />
                        ))
                    )}
                </main>
            </div>
        </ReloadContext.Provider>
    )
}