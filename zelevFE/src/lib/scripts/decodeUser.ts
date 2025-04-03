import CryptoJS from "crypto-js";
import { Usuario } from '../types/types';

const DecodeUsr = (cryp: string) => {

    let usuario: Usuario | null = null;
    const usuariosStringBytes = CryptoJS.AES.decrypt(cryp, process.env.NEXT_PUBLIC_SECRETKEY as string);

    const usuarioString: string = usuariosStringBytes.toString(CryptoJS.enc.Utf8);

    try {
        usuario = JSON.parse(usuarioString);
    }
    catch (error) {
        console.error("Error al parsear el usuario:", error);
        return null;
    }

    return ({ usuario });
}

export default DecodeUsr;