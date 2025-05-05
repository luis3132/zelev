import { FC, useState } from "react";
import { Anadir } from "../icons/icons";
import AnadirCategoria from "./AnadirCategoria";

interface BotonAnadirProps {
    categoria: boolean;
}

const BotonAnadir: FC<BotonAnadirProps> = ({ categoria }) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    }

    return (
        <>
            <button
                className="bg-blue-600/50 hover:bg-blue-800/50 text-white font-bold py-2 px-3 rounded-xl flex gap-1 fixed bottom-20 md:bottom-2 right-2 z-10"
                onClick={handleClick}
            >
                <Anadir />
                {categoria ? "Añadir Categoria" : "Añadir Subcategoria"}
            </button>
            {open && <AnadirCategoria categoria={categoria} closeModal={handleClick} />}
        </>
    )
}

export default BotonAnadir;