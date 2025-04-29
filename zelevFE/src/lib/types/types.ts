export interface token {
    token: string;
}
export interface Rol {
    idRol: number;
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
    roles: Rol[];
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
export interface Unidad {
    upc: number;
    label: string;
    precio: string;
    cantidad: number;
    fechaCreacion: Date;
    estado: string;
    descripcion: string;
}
export interface UnidadCreate {
    upc: number;
    label: string;
    precio: string;
    cantidad: number;
    estado: string;
    descripcion: string;
}
export interface Articulo {
    idArticulo: number;
    nombre: string;
    descripcion: string;
    impuesto: number;
    estado: string;
    categorias: Categoria[];
    unidades: Unidad[];
    imagenes: Imagen[];
}
export interface ArticuloCreate {
    nombre: string;
    descripcion: string;
    impuesto: number;
    estado: string;
    categorias: number[];
    unidades: UnidadCreate[];
}