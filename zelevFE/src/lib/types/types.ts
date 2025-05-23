export interface Slide {
    id: number;
    src: string;
    alt: string;
    caption?: string;
}
export interface Carrito {
    upc: number;
    nombre: string;
    precio: string;
    cantidad: number;
    subtotal: number;
    imagen: number | undefined;
    url: string;
    label: string;
}
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
    nuevosRoles: number[];
    eliminarRoles: number[];
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
    articulo: number;
    imagen: ImgArtUniCreate | undefined;
}
export interface ImgArtUni {
    idImgArtUni: number;
    articulo: Articulo;
    unidad: Unidad;
    imagen: Imagen;
}
export interface ImgArtUniCreate {
    articulo: number;
    unidad: number | null;
    imagen: number;
}
export interface Articulo {
    idArticulo: number;
    nombre: string;
    descripcion: string;
    impuesto: number;
    estado: string;
    categorias: Categoria[];
    unidades: Unidad[];
    imagenes: ImgArtUni[];
}
export interface ArticuloCreate {
    nombre: string;
    descripcion: string;
    impuesto: number;
    estado: string;
    categorias: number[];
    unidades: UnidadCreate[];
    imagen: ImgArtUniCreate | undefined;
}
export interface ArticuloUpdate {
    idArticulo: number;
    nombre: string;
    descripcion: string;
    impuesto: number;
    estado: string;
    categoriasNuevas: number[];
    categoriasEliminar: number[];
    unidades: UnidadCreate[];
    imagen: ImgArtUniCreate | undefined;
}
export interface Pedido {
    idPedido: number;
    cliente: Usuario;
    empleado: Usuario;
    fechaPedido: Date;
    estado: string;
    pediUnidList: PediUnid[];
}
export interface PediUnid {
    pedido: Pedido;
    unidad: Unidad;
    cantidad: number;
    precio: string;
}
export interface PedidoCreate {
    unidad: number;
    precio: string;
    cantidad: number;
    usuario: string;
}
export interface PedidoGrafica {
    idPedido: number;
    empleado: Usuario;
    ciudad: string;
    departamento: string;
    fechaPedido: Date;
    estado: string;
    pediUnidList: PediUnid[];
}
export interface PedidoUpdate {
    idPedido: number;
    empleado: string;
    estado: string;
}