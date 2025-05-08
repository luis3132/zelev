"use client";

import StatusChart from "@/components/dashboard/DonaGraficoPedidos";
import Ingresos from "@/components/dashboard/Ingresos";
import PedidosPorFechaChart from "@/components/dashboard/PedidosPorFecha";
import PreciosPorPedidoChart from "@/components/dashboard/PrecioPorPedido";
import ProductosPorPedidoChart from "@/components/dashboard/ProductosPorPedido";
import TotalPedidos from "@/components/dashboard/TotalPedios";
import UltimosPedidos from "@/components/dashboard/UltimoPedidos";
import { Get } from "@/lib/scripts/fetch";
import { PedidoGrafica } from "@/lib/types/types";
import { useEffect, useState } from "react";

export default function Home() {
    const [pedidos, setPedidos] = useState<PedidoGrafica[]>([]);
    const [token, setToken] = useState<string>("");
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        const fetchPedidos = async () => {
            const { status, data } = await Get("/api/pedido/list", token);
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

    useEffect(() => {
        const interval = setInterval(() => {
            setReload(!reload);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full text-white">
            <div className="px-6 md:px-14 py-8 w-full">
                <header className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
                    <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                    <p className="text-lg text-gray-400 mt-2">Visualiza los datos de tus pedidos</p>
                </header>
                <div className=" mb-6">
                    <div className="bg-gray-800 shadow-lg rounded-lg p-6">
                        <TotalPedidos pedidos={pedidos} />
                    </div>
                </div>
                <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <aside className="gap-y-6">
                        <Ingresos pedidos={pedidos} />
                        <UltimosPedidos pedidos={pedidos} />
                    </aside>
                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div>
                            <div className="bg-gray-800 shadow-lg rounded-lg p-2">
                                <ProductosPorPedidoChart pedidos={pedidos} />
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-800 shadow-lg rounded-lg p-2">
                                <PedidosPorFechaChart pedidos={pedidos} />
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-800 shadow-lg rounded-lg p-2">
                                <PreciosPorPedidoChart pedidos={pedidos} />
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-800 shadow-lg rounded-lg p-2">
                                <StatusChart pedidos={pedidos} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}