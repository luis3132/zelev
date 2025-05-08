import { PedidoGrafica } from "@/lib/types/types";
import { FC } from "react";

interface TotalPedidosProps {
    pedidos: PedidoGrafica[];
}

const TotalPedidos: FC<TotalPedidosProps> = ({ pedidos }) => {
    const totalPedidos = pedidos.length;
    const proceso = pedidos.filter(pedido => pedido.estado === "PROCESO").length;
    const entregado = pedidos.filter(pedido => pedido.estado === "ENTREGADO").length;
    const cancelado = pedidos.filter(pedido => pedido.estado === "CANCELADO").length;
    const enviado = pedidos.filter(pedido => pedido.estado === "ENVIADO").length;
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            <div className="bg-black/50 hover:bg-black ease-in-out transition-colors duration-200 p-4 rounded-lg shadow">
                <div className="flex items-center">
                    <h3 className="font-semibold">Total Pedidos</h3>
                </div>
                <p className="text-3xl font-bold mt-2">{totalPedidos}</p>
            </div>
            <div className="bg-amber-500 hover:bg-amber-600 ease-in-out transition-colors duration-200 p-4 rounded-lg shadow">
                <div className="flex items-center">
                    <h3 className="font-semibold">Total en proceso</h3>
                </div>
                <p className="text-3xl font-bold mt-2">{proceso}</p>
            </div>
            <div className="bg-blue-500 hover:bg-blue-600 ease-in-out transition-colors duration-200 p-4 rounded-lg shadow">
                <div className="flex items-center">
                    <h3 className="font-semibold">Total enviado</h3>
                </div>
                <p className="text-3xl font-bold mt-2">{enviado}</p>
            </div>
            <div className="bg-emerald-500 hover:bg-emerald-600 ease-in-out transition-colors duration-200 p-4 rounded-lg shadow">
                <div className="flex items-center">
                    <h3 className="font-semibold">Total entregado</h3>
                </div>
                <p className="text-3xl font-bold mt-2">{entregado}</p>
            </div>
            <div className="bg-red-500 hover:bg-red-600 ease-in-out transition-colors duration-200 p-4 rounded-lg shadow">
                <div className="flex items-center">
                    <h3 className="font-semibold">Total cancelado</h3>
                </div>
                <p className="text-3xl font-bold mt-2">{cancelado}</p>
            </div>
        </div>
    );
}

export default TotalPedidos;