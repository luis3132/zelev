import { ReloadContext } from "@/lib/hooks/reload";
import DecodeUsr from "@/lib/scripts/decodeUser";
import { Put } from "@/lib/scripts/fetch";
import { Pedido, PedidoUpdate, Usuario } from "@/lib/types/types";
import { FC, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

interface EstadoPedidoProps {
    pedido: Pedido;
    estado: string;
    closeModal: () => void;
    cliente?: boolean;
}

const EstadoPedido: FC<EstadoPedidoProps> = ({ pedido, estado, closeModal, cliente = false }) => {
    const [show, setShow] = useState(false);
    const [token, setToken] = useState<string>("");
    const [usuario, setUsuario] = useState<Usuario>();
    const { update } = useContext(ReloadContext);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const usuarioString = sessionStorage.getItem("usuario");
            const parsedUsuario = DecodeUsr(usuarioString ? usuarioString : "");
            if (parsedUsuario && parsedUsuario.usuario) {
                setUsuario(parsedUsuario.usuario);
            }
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        setShow(true);
    }, [show]);

    const handleclose = () => {
        setShow(false);
        setTimeout(() => {
            closeModal();
        }, 300);
    }

    const handleConfirm = async () => {
        let data: PedidoUpdate;
        if (!usuario) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `No se pudo obtener el usuario`,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
        if (estado === "PROCESO") {
            data = {
                idPedido: pedido.idPedido,
                empleado: usuario?.cedula,
                estado: estado === "PROCESO" ? "ENVIADO" : estado === "ENVIADO" ? "ENTREGADO" : estado,
            }
        } else {
            data = {
                idPedido: pedido.idPedido,
                empleado: pedido.empleado.cedula,
                estado: estado === "PROCESO" ? "ENVIADO" : estado === "ENVIADO" ? "ENTREGADO" : estado,
            }
        }
        const { status } = await Put("/api/pedido/update", token, data);
        if (status === 200) {
            await Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                text: `El estado del pedido ha sido actualizado a ${estado === "PROCESO" ? "ENVIADO" : estado === "ENVIADO" ? "ENTREGADO" : estado}`,
                showConfirmButton: false,
                timer: 1500,
                background: "#0f0f0f",
                color: "#fff",
            });
            update();
            handleclose();
            return;
        }
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `No se pudo actualizar el estado del pedido`,
            showConfirmButton: false,
            timer: 1500,
            background: "#0f0f0f",
            color: "#fff",
        });
        handleclose();
    }

    const handleCancel = async () => {
        if (estado !== "PROCESO") {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `No se puede cancelar el pedido`,
                showConfirmButton: false,
                background: "#0f0f0f",
                color: "#fff",
                timer: 1500,
            });
            return;
        }
        const data: PedidoUpdate = {
            idPedido: pedido.idPedido,
            empleado: "",
            estado: "CANCELADO",
        }
        const { status } = await Put("/api/pedido/update", token, data);
        if (status === 200) {
            await Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                text: `El estado del pedido ha sido cancelado`,
                showConfirmButton: false,
                timer: 1500,
                background: "#0f0f0f",
                color: "#fff",
            });
            update();
            handleclose();
            return;
        }
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `No se pudo actualizar el estado del pedido`,
            showConfirmButton: false,
            timer: 1500,
            background: "#0f0f0f",
            color: "#fff",
        });
        handleclose();
    }

    return (
        <section className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm transition-all duration-300 opacity-0 ${show && "opacity-100"} flex items-center justify-center z-20`}>
            <div className="bg-black shadow-lg rounded-lg p-6 flex flex-col w-full max-md:mx-2 md:w-1/2 gap-6">
                <h1 className="text-3xl font-bold text-white mb-6">Estado del pedido</h1>
                <h2 className="text-xl font-bold text-white mb-2">Items:</h2>
                <div>
                    {pedido.pediUnidList.map((item, i) => (
                        <div key={i} className="bg-gray-700 rounded-lg p-4 mb-2">
                            <p className="text-white">{item.unidad.upc}</p>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-white">{item.unidad.descripcion}</p>
                                <p className="text-white">{item.cantidad}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {!cliente ? (
                    <>
                        <p className="text-white">¿Está seguro de que desea cambiar el estado del pedido a {estado === "PROCESO" ? "ENVIADO" : estado === "ENVIADO" ? "ENTREGADO" : estado}?</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={handleclose} className="bg-red-500 text-white px-4 py-2 rounded-lg">Cancelar</button>
                            {estado !== "CANCELADO" && estado !== "ENTREGADO" && (
                                <button onClick={handleConfirm} className="bg-green-500 text-white px-4 py-2 rounded-lg">Confirmar</button>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-white">¿Está seguro de que desea cancelar el pedido?</p>
                        <div className="flex justify-end gap-4">
                            {estado === "PROCESO" && (
                                <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg">Cancelar</button>
                            )}
                            <button onClick={handleclose} className="bg-green-500 text-white px-4 py-2 rounded-lg">Cerrar</button>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
export default EstadoPedido;