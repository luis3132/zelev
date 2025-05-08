import { PedidoGrafica } from "@/lib/types/types";
import { FC } from "react";

interface UltimosPedidosProps {
    pedidos: PedidoGrafica[];
}

const UltimosPedidos: FC<UltimosPedidosProps> = ({ pedidos }) => {
    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 overflow-x-scroll">
            <h2 className="text-2xl font-bold text-white mb-4">Últimos Pedidos</h2>
            <table className="min-w-full bg-gray-900 text-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID Pedido</th>
                        <th className="py-2 px-4 border-b">Fecha</th>
                        <th className="py-2 px-4 border-b">Localidad</th>
                        <th className="py-2 px-4 border-b">Estado</th>
                        <th className="py-2 px-4 border-b">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.slice(pedidos.length - 10, pedidos.length).reverse().map((pedido) => (
                        <tr key={pedido.idPedido} className={`${pedido.estado === "ENTREGADO" ? "bg-emerald-500/50 hover:bg-emerald-600/50 " : pedido.estado === "CANCELADO" ? "bg-red-500/50 hover:bg-red-600/50" : pedido.estado === "ENVIADO" ? "bg-blue-500/50 hover:bg-blue-600/50" : "bg-amber-500/50 hover:bg-amber-600/50"} ease-in-out transition-colors duration-200 text-center`}>
                            <td className="py-2 px-4 border-b">{pedido.idPedido}</td>
                            <td className="py-2 px-4 border-b">{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">{pedido.departamento} {pedido.ciudad}</td>
                            <td className="py-2 px-4 border-b">{pedido.estado}</td>
                            <td className="py-2 px-4 border-b">{pedido.pediUnidList.reduce((total, item) => total + (parseInt(item.precio) * item.cantidad), 0).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default UltimosPedidos;