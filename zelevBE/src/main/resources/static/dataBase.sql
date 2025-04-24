USE zelev;
CREATE TABLE IF NOT EXISTS rol (
	id_rol int auto_increment primary key not null,
	rol varchar(10) not null
);

CREATE TABLE IF NOT EXISTS imagen (
	id_imagen int auto_increment primary key not null,
	url text not null,
	alt varchar(200) not null
);

CREATE TABLE IF NOT EXISTS usuario (
	cedula varchar(20) primary key not null,
	nombres varchar(50) not null,
	apellidos varchar(50),
	nombre_usuario varchar(10) not null unique,
	email varchar(100) not null unique,
	telefono varchar(10),
	departamento varchar(20),
	ciudad varchar(30),
	zipcode int,
	direccion varchar(100),
	contrasena varchar(500) not null,
	fecha_nacimiento date not null,
	fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP(),
	estado enum('ACTIVO', 'BLOQUEADO', 'ELIMINADO', 'INACTIVO') not null,
	imagen int,
	CONSTRAINT usuario_imagen_FK FOREIGN KEY (imagen) REFERENCES imagen (id_imagen)
);

CREATE TABLE IF NOT EXISTS categoria (
	id_categoria int auto_increment primary key not null,
	subcategoria varchar(20) not null,
	categoria varchar(20) not null
);

CREATE TABLE IF NOT EXISTS articulo (
	id_articulo int auto_increment primary key not null,
	nombre varchar(100) not null,
	descripcion varchar(500) not null,
	impuesto double not null,
	estado enum('ACTIVO', 'NOACTIVO')
);

CREATE TABLE IF NOT EXISTS unidad (
	upc bigint primary key not null,
	label varchar(30) not null,
	precio varchar(20) not null,
	articulo int not null,
	cantidad int not null,
	fecha_creacion timestamp default CURRENT_TIMESTAMP(),
	estado enum('NOSTOCK', 'STOCK', 'SOLICITADO'),
	descripcion varchar(200),
	CONSTRAINT unidad_articulo_FK FOREIGN KEY (articulo) REFERENCES articulo (id_articulo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS img_art_uni (
	id_img_art_uni int auto_increment primary key,
	imagen int not null,
	articulo int not null,
	unidad bigint,
	CONSTRAINT img_art_uni_imagen_FK FOREIGN KEY (imagen) REFERENCES imagen (id_imagen) ON DELETE CASCADE,
	CONSTRAINT img_art_uni_articulo_FK FOREIGN KEY (articulo) REFERENCES articulo (id_articulo) ON DELETE CASCADE,
	CONSTRAINT img_art_uni_unidad_FK FOREIGN KEY (unidad) REFERENCES unidad (upc) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedido (
	id_pedido int auto_increment primary key not null,
	cliente varchar(20) not null,
	empleado varchar(20) not null,
	fecha_pedido timestamp default CURRENT_TIMESTAMP(),
	estado enum('PROCESO', 'ENTREGADO', 'ENVIADO', 'CANCELADO') not null,
	CONSTRAINT pedido_cliente_FK FOREIGN KEY (cliente) REFERENCES usuario (cedula),
	CONSTRAINT pedido_empleado_fk FOREIGN KEY (cliente) REFERENCES usuario (cedula)
);

CREATE TABLE IF NOT EXISTS rol_usuario (
	usuario varchar(20) not null,
	rol int not null,
	PRIMARY KEY (usuario, rol),
	CONSTRAINT ur_usuario_FK FOREIGN KEY (usuario) REFERENCES usuario (cedula) ON DELETE CASCADE,
	CONSTRAINT ur_rol_FK FOREIGN KEY (rol) REFERENCES rol (id_rol) ON DELETE CASCADE
);

CREATE TABLE IF NOT  EXISTS arti_cate (
	articulo int not null,
	categoria int not null,
	PRIMARY KEY (articulo, categoria),
	CONSTRAINT arca_articulo_FK FOREIGN KEY (articulo) REFERENCES articulo (id_articulo) ON DELETE CASCADE,
	CONSTRAINT arca_categoria_FK FOREIGN KEY (categoria) REFERENCES categoria (id_categoria) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedi_unid (
	pedido int not null,
	unidad bigint not null,
	precio varchar(20) not null,
	PRIMARY KEY (pedido, unidad),
	CONSTRAINT peun_pedido_FK FOREIGN KEY (pedido) REFERENCES pedido (id_pedido) ON DELETE CASCADE,
	CONSTRAINT peun_unidad_FK FOREIGN KEY (unidad) REFERENCES unidad (upc) ON DELETE CASCADE
);

INSERT INTO zelev.rol (rol) VALUES ('ADMIN');
INSERT INTO zelev.rol (rol) VALUES ('USER');

INSERT INTO zelev.usuario (cedula, nombres, apellidos, nombre_usuario, email, telefono, direccion, contrasena, fecha_nacimiento, fecha_creacion, estado, imagen, departamento, ciudad, zipcode)
VALUES('123456', 'admin', 'admin', 'admin123', 'admin@admin.com', '123456', 'admin', '$2a$10$OCVOIHsI50HnS9wAjhKm3eMZl41J3afszGWA6A5YTc7IGR44Zioru', '2025-01-01', CURRENT_TIMESTAMP, "ACTIVO", null, null, null, null);

INSERT INTO zelev.rol_usuario (usuario, rol)
VALUES('123456', 1);

INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(1, 'Estilo', ''),
(2, 'Material', ''),
(3, 'Ocasion', ''),
(4, 'Tamano', ''),
(5, 'Marca', ''),
(6, 'Temporada', '');

-- Estilo
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(7, 'Estilo', 'Tote'),
(8, 'Estilo', 'Bandolera'),
(9, 'Estilo', 'Mano'),
(10, 'Estilo', 'Mochila'),
(11, 'Estilo', 'Clutch'),
(12, 'Estilo', 'Hobo'),
(13, 'Estilo', 'Satchel'),
(14, 'Estilo', 'Bucket');

-- Material
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(15, 'Material', 'Cuero'),
(16, 'Material', 'Sintetica'),
(17, 'Material', 'Lona'),
(18, 'Material', 'Denim'),
(19, 'Material', 'Metalizados'),
(20, 'Material', 'Crochet'),
(21, 'Material', 'Vinilo');

-- Ocasion
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(22, 'Ocasion', 'Casual'),
(23, 'Ocasion', 'Formal'),
(24, 'Ocasion', 'Fiesta'),
(25, 'Ocasion', 'Nocturno'),
(26, 'Ocasion', 'Viaje'),
(27, 'Ocasion', 'Trabajo');

-- Tamano
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(28, 'Tamano', 'Mini'),
(29, 'Tamano', 'Pequeno'),
(30, 'Tamano', 'Mediano'),
(31, 'Tamano', 'Grande'),
(32, 'Tamano', 'Extra');

-- Marca
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(33, 'Marca', 'Lujo'),
(34, 'Marca', 'Disenador'),
(35, 'Marca', 'Locales'),
(36, 'Marca', 'Sostenibles');

-- Temporada
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(37, 'Temporada', 'Primavera/Verano'),
(38, 'Temporada', 'Otono/Invierno'),
(39, 'Temporada', 'Limitada'),
(40, 'Temporada', 'Vacaciones');

-- Insertar categorias principales (subcategoria vacia)
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(41, 'Tipo de Cierre', ''),
(42, 'Color', ''),
(43, 'Publico', ''),
(44, 'Funcion', ''),
(45, 'Estilo de Asa', ''),
(46, 'Tendencias', ''),
(47, 'Artesanales', ''),
(48, 'Personalizacion', '');

-- Subcategorias para Tipo de Cierre
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(49, 'Tipo de Cierre', 'Cremallera'),
(50, 'Tipo de Cierre', 'Imán'),
(51, 'Tipo de Cierre', 'Correas'),
(52, 'Tipo de Cierre', 'Abierto'),
(53, 'Tipo de Cierre', 'Boton'),
(54, 'Tipo de Cierre', 'Cordon');

-- Subcategorias para Color
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(55, 'Color', 'Neutros'),
(56, 'Color', 'Vivos'),
(57, 'Color', 'Pasteles'),
(58, 'Color', 'Estampados'),
(59, 'Color', 'Degrade'),
(60, 'Color', 'Metalizados');

-- Subcategorias para Publico
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(61, 'Publico', 'Mujeres'),
(62, 'Publico', 'Hombres'),
(63, 'Publico', 'Unisex'),
(64, 'Publico', 'Ninos'),
(65, 'Publico', 'Tercera Edad');

-- Subcategorias para Funcion
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(66, 'Funcion', 'Organizador'),
(67, 'Funcion', 'Antirrobo'),
(68, 'Funcion', 'Impermeables'),
(69, 'Funcion', 'Convertibles'),
(70, 'Funcion', 'Portatil'),
(71, 'Funcion', 'Mama');

-- Subcategorias para Estilo de Asa
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(72, 'Estilo de Asa', 'Cortas'),
(73, 'Estilo de Asa', 'Largas'),
(74, 'Estilo de Asa', 'Ajustables'),
(75, 'Estilo de Asa', 'Sin Asas'),
(76, 'Estilo de Asa', 'Cadena');

-- Subcategorias para Tendencias
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(77, 'Tendencias', 'Vintage'),
(78, 'Tendencias', 'Minimalista'),
(79, 'Tendencias', 'Boho-Chic'),
(80, 'Tendencias', 'Futurista'),
(81, 'Tendencias', 'Influencer');

-- Subcategorias para Artesanales
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(82, 'Artesanales', 'Hechos a Mano'),
(83, 'Artesanales', 'Tejidos'),
(84, 'Artesanales', 'Bordados'),
(85, 'Artesanales', 'Piel Grabada');

-- Subcategorias para Personalizacion
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(86, 'Personalizacion', 'Iniciales'),
(87, 'Personalizacion', 'Parches'),
(88, 'Personalizacion', 'Color'),
(89, 'Personalizacion', 'Stickers');

-- Categoria principal Outlet
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(90, 'Outlet', '');

-- Subcategorias para Outlet
INSERT INTO zelev.categoria (id_categoria, categoria, subcategoria) VALUES 
(91, 'Outlet', 'Ultimas Unidades'),
(92, 'Outlet', 'Temporadas Pasadas'),
(93, 'Outlet', 'Imperfectos'),
(94, 'Outlet', 'Combos'),
(95, 'Outlet', 'Ediciones Agotadas'),
(96, 'Outlet', 'Mayorista'),
(97, 'Outlet', 'Reembalados'),
(98, 'Outlet', 'Flash Sale');

