import { PedidoGrafica } from "@/lib/types/types";
import { FC } from "react";


interface IngresosProps {
    pedidos: PedidoGrafica[];
}

const Ingresos: FC<IngresosProps> = ({ pedidos }) => {
    const ingresos = pedidos.reduce((total, pedido) => {
        if (pedido.estado === "ENTREGADO") {
            return total + pedido.pediUnidList.reduce((subtotal, item) => {
                return subtotal + parseInt(item.precio) * item.cantidad;
            }, 0);
        }
        return total;
    }, 0);

    const ingresosDelDia = pedidos.reduce((total, pedido) => {
        if (new Date(pedido.fechaPedido).toISOString().split("T")[0] === new Date().toISOString().split("T")[0] && pedido.estado === "ENTREGADO") {
            return total + pedido.pediUnidList.reduce((subtotal, item) => {
                return subtotal + parseInt(item.precio) * item.cantidad;
            }, 0);
        }
        return total;
    }, 0);

    const ingresosDelMes = pedidos.reduce((total, pedido) => {
        const fechaPedido = new Date(pedido.fechaPedido);
        const fechaActual = new Date();
        if (fechaPedido.getMonth() === fechaActual.getMonth() && fechaPedido.getFullYear() === fechaActual.getFullYear()&& pedido.estado === "ENTREGADO") {
            return total + pedido.pediUnidList.reduce((subtotal, item) => {
                return subtotal + parseInt(item.precio) * item.cantidad;
            }, 0);
        }
        return total;
    }, 0);

    return (
        <main className="bg-gray-800 flex mb-6 gap-6 p-6 rounded-lg" title="Solo cuenta los pedidos entregados">
            <div className="bg-black/50 hover:bg-black ease-in-out transition-colors duration-200 shadow-lg rounded-lg p-6 w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Ingresos Totales</h2>
                <p className="text-lg text-white">{`$${ingresos}`}</p>
            </div>
            <div className="bg-black/50 hover:bg-black ease-in-out transition-colors duration-200 shadow-lg rounded-lg p-6 w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Ingresos del Mes</h2>
                <p className="text-lg text-white">{`$${ingresosDelMes}`}</p>
            </div>
            <div className="bg-black/50 hover:bg-black ease-in-out transition-colors duration-200 shadow-lg rounded-lg p-6 w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Ingresos del Día</h2>
                <p className="text-lg text-white">{`$${ingresosDelDia}`}</p>
            </div>
        </main>
    );
}
export default Ingresos;