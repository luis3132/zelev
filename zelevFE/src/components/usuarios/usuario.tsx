import { Get } from "@/lib/scripts/fetch";
import { Usuario } from "@/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";

interface UsuarioCardProps {
    usuario: Usuario;
    token: string;
}

const UsuarioCard: FC<UsuarioCardProps> = ({ usuario, token }) => {
    const [foto, setFoto] = useState<string>("/logo/largeLogo.webp");
    const fotoRef = useRef("");

    useEffect(() => {
        const fetchImagen = async () => {
            try {
                const { data, status } = await Get(`/api/imagen/${usuario?.imagen.idImagen}`, token, undefined, true);

                if (status === 200 && data instanceof Blob) {
                    const imageUrl = URL.createObjectURL(data);
                    if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
                    fotoRef.current = imageUrl;
                    setFoto(imageUrl);
                }
            } catch (error) {
                console.error("Error cargando imagen:", error);
                setFoto("/logo/logo.png");
            }
        };
        if (usuario.imagen?.idImagen) {
            fetchImagen();
        }
        return () => {
            if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
        };
    }, [usuario, token]);
    return (
        <div className="w-64 h-56 flex flex-col border border-gray-300 rounded-lg p-2 shadow-md items-center">
            <div className="max-h-[125px] h-[125px] justify-center items-center flex overflow-hidden">
                <Image
                    src={foto}
                    alt="Imagen"
                    width={110}
                    height={110}
                    className="h-min object-cover rounded-2xl"
                />
            </div>
            <h3 className="text-lg my-2 text-center">
                {usuario.nombreUsuario}
            </h3>
            <Link href={`/admin/usuario/${usuario.cedula}`} className="w-[80%] py-1 flex justify-center bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Más información
            </Link>
        </div>)
}

export default UsuarioCard;