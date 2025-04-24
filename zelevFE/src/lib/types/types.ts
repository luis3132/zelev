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
    imagen: Imagen;
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
    imagen: number;
    fechaNacimiento: Date;
    estado: string;
    NuevosRoles: number[];
    EliminarRoles: number[];
}
export interface Imagen {
    idImagen: number;
    url: string;
    alt: string;
}
export interface Categoria {
    idCategoria: number;
    categoria: string;
    subcategoria: string;
}
export interface CategoriaCreate {
    categoria: string;
    subCategoria: string;
}