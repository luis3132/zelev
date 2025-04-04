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
    email: string;
    telefono: string;
    departamento: string;
    ciudad: string;
    zipcode: number;
    direccion: string;
    fechaNacimiento: Date;
    estado: string;
    imagen: string;
    roles: Rol[];
}

export interface UsuarioUpdate {
    cedula: string;
    nombres: string;
    apellidos: string;
    nombreUsuario: string;
    email: string;
    telefono: string;
    departamento: string;
    ciudad: string;
    zipcode: number;
    direccion: string;
    imagen: FormData;
    fechaNacimiento: Date;
    estado: string;
    NuevosRoles: number[];
    EliminarRoles: number[];
}