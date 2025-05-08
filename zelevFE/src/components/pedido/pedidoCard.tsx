import { Pedido } from "@/lib/types/types"
import { FC } from "react";

interface PedidoCardProps {
    pedido: Pedido;
}

const PedidoCard: FC<PedidoCardProps> = ({ pedido }) => {
    const total = pedido.pediUnidList.reduce((total, item) => total + (parseInt(item.precio) * item.cantidad), 0).toFixed(2);

    return (
        <div className="bg-gray-700 hover:bg-gray-600 shadow-lg rounded-lg p-6 mb-4 w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Pedido ID: {pedido.idPedido}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <p className="text-lg text-white">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                    <p className="text-lg text-white">Localidad: {pedido.cliente.departamento} {pedido.cliente.ciudad}</p>
                    <p className="text-lg text-white">Estado: {pedido.estado}</p>
                    <p className="text-lg text-white">Total: ${total}</p>
                </div>
                <div className="flex flex-col justify-end items-end">
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => console.log('Inspeccionar pedido:', pedido)}
                    >
                        Inspeccionar
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <p className="text-lg text-white font-semibold">Nombre del Cliente:</p>
                    <p className="text-lg text-white">{pedido.cliente.nombres}</p>
                </div>
                <div>
                    <p className="text-lg text-white font-semibold">Teléfono:</p>
                    <p className="text-lg text-white">{pedido.cliente.telefono}</p>
                </div>
                <div>
                    <p className="text-lg text-white font-semibold">Email:</p>
                    <p className="text-lg text-white">{pedido.cliente.email}</p>
                </div>
                <div>
                    <p className="text-lg text-white font-semibold">Dirección:</p>
                    <p className="text-lg text-white">{pedido.cliente.direccion}</p>
                </div>
            </div>
        </div>
    )
}
export default PedidoCard;