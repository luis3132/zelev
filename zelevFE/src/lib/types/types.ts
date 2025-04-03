export interface token {
    token: string;
}

export interface Rol {
    id: number;
    rol: string;
}

export interface Usuario {
    cedula: string;
    nombres: string;
    apellidos: string;
    nombreUsuario: string;
    contrasena: string;
    correo: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: Date;
    estado: string;
    imagen: string;
    roles: Rol[];
}