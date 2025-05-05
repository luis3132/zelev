import { ChangeEvent, FC, FormEvent, useContext, useEffect, useState } from "react";
import { CancelIcon, SaveIcon } from "../icons/icons";
import Departamentos from "../profile/departamentos";
import Ciudades from "../profile/ciudades";
import Swal from "sweetalert2";
import { Rol } from "@/lib/types/types";
import { Get, Post } from "@/lib/scripts/fetch";
import { ReloadContext } from "@/lib/hooks/reload";

interface AnadirUsuarioProps {
    closeModal: () => void;
}

const AnadirUsuario: FC<AnadirUsuarioProps> = ({ closeModal }) => {
    const [show, setShow] = useState(false);
    const [departamento, setDepartamento] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [roles, setRoles] = useState<Rol[]>([]);
    const { update } = useContext(ReloadContext);

    useEffect(() => {
        const fetchRoles = async () => {
            const { data, status } = await Get("/api/rol/list", token);
            if (status === 200) {
                setRoles(data);
            } else {
                console.error("Error al traer los roles");
            }
        }
        if (typeof window !== "undefined") {
            const tokenString = document.cookie.split("; ").find(row => row.startsWith("token="));
            if (tokenString) {
                const tokenValue = tokenString.split("=")[1];
                setToken(tokenValue);
            }
        }
        if (token !== "") {
            fetchRoles();
        }
        setShow(true);
    }, [token]);

    const handleclose = () => {
        setShow(false);
        setTimeout(() => {
            closeModal();
        }, 300);
    }

    const handleDepartamento = (e: ChangeEvent<HTMLSelectElement>) => {
        const departamentoInput = document.querySelector('select[id="departamento"]') as HTMLInputElement;
        if (departamentoInput) {
            setDepartamento(e.target.value);
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const password = e.currentTarget.contrasena.value;
        const confirmarPassword = e.currentTarget.confirmarContrasena.value;
        if (password !== confirmarPassword) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Las contraseñas no coinciden",
                confirmButtonText: "Aceptar",
            });
            return;
        }
        const formData = {
            nombres: e.currentTarget.nombres.value,
            email: e.currentTarget.email.value,
            cedula: e.currentTarget.cedula.value,
            apellidos: e.currentTarget.apellidos.value,
            telefono: e.currentTarget.telefono.value,
            direccion: e.currentTarget.direccion.value,
            nombreUsuario: e.currentTarget.nombreUsuario.value,
            fechaNacimiento: e.currentTarget.fechaNacimiento.value,
            departamento: departamento,
            ciudad: e.currentTarget.ciudad.value,
            zipcode: e.currentTarget.codigoPostal.value,
            contrasena: password,
            roles: Array.from(e.currentTarget.roles.selectedOptions).map((option) => parseInt((option as HTMLOptionElement).value)),
        };
        const { status } = await Post("/api/usuario/new", token, formData);
        if (status === 200) {
            await Swal.fire({
                icon: "success",
                title: "Usuario añadido",
                text: "El usuario ha sido añadido correctamente",
                confirmButtonText: "Aceptar",
            });
            update();
            handleclose();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al añadir el usuario",
                confirmButtonText: "Aceptar",
            });
        }
    }

    return (
        <>
            <section className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm flex justify-center items-center z-20 ${show ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
                <form onSubmit={handleSubmit} className="md:mt-40 mt-20 h-full flex justify-center items-center">
                    <div className="bg-black p-5 rounded-lg shadow-lg w-96 overflow-y-scroll max-h-[80%]">
                        <h2 className="text-xl font-bold mb-4">Añadir Usuario</h2>
                        <div className="mb-2">
                            <label htmlFor="nombres" className="block text-white">Nombres</label>
                            <input
                                id="nombres"
                                name="nombres"
                                type="text"
                                placeholder="Nombres"
                                required
                                autoFocus
                                maxLength={50}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.length > 50) {
                                        input.value = input.value.slice(0, 50);
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="email" className="block text-white">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Correo electrónico"
                                required
                                maxLength={50}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.length > 50) {
                                        input.value = input.value.slice(0, 50);
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="cedula" className="block text-white">Cédula</label>
                            <input
                                id="cedula"
                                name="cedula"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Cédula"
                                required
                                maxLength={20}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    input.value = input.value.replace(/[^0-9]/g, ""); // Ensure only numeric input
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="apellidos" className="block text-white">Apellidos</label>
                            <input
                                id="apellidos"
                                name="apellidos"
                                type="text"
                                placeholder="Apellidos"
                                required
                                maxLength={50}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.length > 50) {
                                        input.value = input.value.slice(0, 50);
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="telefono" className="block text-white">Teléfono</label>
                            <input
                                id="telefono"
                                name="telefono"
                                type="tel"
                                placeholder="Número Telefónico"
                                required
                                maxLength={10}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.length > 10) {
                                        input.value = input.value.slice(0, 10);
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="direccion" className="block text-white">Dirección</label>
                            <input
                                id="direccion"
                                name="direccion"
                                type="text"
                                placeholder="Dirección"
                                required
                                maxLength={100}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.length > 100) {
                                        input.value = input.value.slice(0, 100);
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="nombreUsuario" className="block text-white">Nombre de Usuario</label>
                            <input
                                id="nombreUsuario"
                                name="nombreUsuario"
                                type="text"
                                placeholder="Nombre de Usuario"
                                required
                                maxLength={10}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.length > 10) {
                                        input.value = input.value.slice(0, 10);
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="fechaNacimiento" className="block text-white">Fecha de Nacimiento</label>
                            <input type="date" name="fechaNacimiento" id="fechaNacimiento" className="w-full p-2 border border-gray-300 rounded" required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="departamento" className="block text-white">Departamento</label>
                            <select
                                name="departamento"
                                id="departamento"
                                className="w-full p-2 border border-gray-300 rounded bg-black text-white"
                                onChange={(e) => handleDepartamento(e)}
                                required
                            >
                                <Departamentos />
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="ciudad" className="block text-white">Ciudad</label>
                            <select
                                name="ciudad"
                                id="ciudad"
                                className="w-full p-2 border border-gray-300 rounded bg-black text-white"
                                required
                            >
                                <Ciudades departamento={departamento} />
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="codigoPostal" className="block text-white">Código Postal</label>
                            <input type="number" name="codigoPostal" id="codigoPostal" className="w-full p-2 border border-gray-300 rounded" placeholder="Codigo Postal" required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="roles" className="block text-white">Roles</label>
                            <select
                                name="roles"
                                id="roles"
                                className="w-full p-2 border border-gray-300 rounded bg-black text-white"
                                multiple
                            >
                                {roles.map((rol) => (
                                    <option key={rol.idRol} value={rol.idRol}>
                                        {rol.rol}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="contrasena" className="block text-white">Contraseña</label>
                            <input type="password" name="contrasena" id="contrasena" className="w-full p-2 border border-gray-300 rounded" placeholder="Contraseña" required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="confirmarContrasena" className="block text-white">Confirmar Contraseña</label>
                            <input type="password" name="confirmarContrasena" id="confirmarContrasena" className="w-full p-2 border border-gray-300 rounded" placeholder="Confirmar Contraseña" required />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-2 rounded flex items-center gap-1"
                            >
                                <SaveIcon />
                                Añadir
                            </button>
                            <button
                                type="button"
                                onClick={handleclose}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded ml-2 flex items-center gap-1"
                            >
                                <CancelIcon />
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </>
    )
}

export default AnadirUsuario;