import CryptoJS from "crypto-js";
import { Usuario } from '../types/types';

const EncodeUsr = (usuario: Usuario) => {

    const cryp: string = JSON.stringify(usuario);

    const usuariosString = CryptoJS.AES.encrypt(cryp, process.env.NEXT_PUBLIC_SECRETKEY as string).toString();

    return usuariosString;
}

export default EncodeUsr;