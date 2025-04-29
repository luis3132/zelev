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

-- Insertar 20 artículos (bolsos)
INSERT INTO articulo (id_articulo, nombre, descripcion, impuesto, estado) VALUES
(1, 'Morral Rosario de cuero para mujer corte hexagonal', 'Morral elegante en cuero genuino con cierre metálico y compartimento interno', 0.19, 'ACTIVO'),
(2, 'Bolso Bandolera Vintage', 'Bandolera estilo retro con múltiples bolsillos y ajuste de correa', 0.19, 'ACTIVO'),
(3, 'Mochila Urbana Impermeable', 'Mochila resistente al agua con portátil y organización inteligente', 0.19, 'ACTIVO'),
(4, 'Clutch Noche de Gala', 'Clutch compacto para eventos formales con detalles brillantes', 0.19, 'ACTIVO'),
(5, 'Bolso Tote Minimalista', 'Bolso amplio de diseño limpio para uso diario', 0.19, 'ACTIVO'),
(6, 'Bandolera Antirrobo RFID', 'Seguridad avanzada con bloqueo de señales y múltiples compartimentos', 0.19, 'ACTIVO'),
(7, 'Mochila Viaje Expandible', 'Mochila que se expande para mayor capacidad cuando se necesita', 0.19, 'ACTIVO'),
(8, 'Bolso Hobo de Piel Suave', 'Diseño relajado con materiales premium y confort excepcional', 0.19, 'ACTIVO'),
(9, 'Bolso Satchel Oficina', 'Estilo profesional con organizador para documentos y accesorios', 0.19, 'ACTIVO'),
(10, 'Bucket Bag Trendy', 'Bolso de moda con forma de cubo y cordón ajustable', 0.19, 'ACTIVO'),
(11, 'Bolso de Mano Crochet', 'Artesanía manual con diseño único y materiales naturales', 0.19, 'ACTIVO'),
(12, 'Portafolio Ejecutivo', 'Estilo sofisticado para hombres con múltiples compartimientos', 0.19, 'ACTIVO'),
(13, 'Bolso Crossbody Deportivo', 'Diseño ligero y funcional para actividades al aire libre', 0.19, 'ACTIVO'),
(14, 'Bolso de Playa Boho', 'Gran capacidad con materiales resistentes al agua y arena', 0.19, 'ACTIVO'),
(15, 'Mochila Escolar Organizada', 'Con espacio para libros, laptop y accesorios escolares', 0.19, 'ACTIVO'),
(16, 'Clutch Magnético Elegante', 'Cierre magnético discreto y diseño ultrafino', 0.19, 'ACTIVO'),
(17, 'Bolso de Cuero Envejecido', 'Estilo vintage con apariencia de cuero envejecido naturalmente', 0.19, 'ACTIVO'),
(18, 'Bandolera Convertible 2en1', 'Se transforma de bandolera a mochila según necesidad', 0.19, 'ACTIVO'),
(19, 'Bolso Térmico para Mamá', 'Con cambiador portátil y bolsillos térmicos', 0.19, 'ACTIVO'),
(20, 'Mochila con USB', 'Incluye puerto USB externo para cargar dispositivos', 0.19, 'ACTIVO'),
(21, 'Bolso Messenger Ejecutivo', 'Estilo profesional para hombre con compartimento para laptop de 15"', 0.19, 'ACTIVO'),
(22, 'Bandolera Mini con Cadena', 'Versión compacta de bandolera con cadena dorada desmontable', 0.19, 'ACTIVO'),
(23, 'Mochila Trekking Resistente', 'Diseño outdoor con soporte para hidratación y materiales duraderos', 0.19, 'ACTIVO'),
(24, 'Clutch de Noche con Cristales', 'Elegante clutch para eventos con detalles de strass y perlas', 0.19, 'ACTIVO'),
(25, 'Bolso Shopper XL Algodón', 'Tote extra grande en algodón orgánico con estampado artesanal', 0.19, 'ACTIVO'),
(26, 'Crossbody con Estampado Animal', 'Bandolera moderna con prints de leopardo o cebra', 0.19, 'ACTIVO'),
(27, 'Mochila Anti-Robo Urbana', 'Con bolsillos ocultos y resistencia al corte', 0.19, 'ACTIVO'),
(28, 'Bolso Saddle Moderno', 'Reinterpretación contemporánea del clásico estilo saddle', 0.19, 'ACTIVO'),
(29, 'Portadocumentos Elegante', 'Para reuniones de negocios con bloc de notas incluido', 0.19, 'ACTIVO'),
(30, 'Bolso Bamboo Handle', 'Diseño veraniego con asas de bambú natural', 0.19, 'ACTIVO'),
(31, 'Mochila con Ruedas Estudiantil', 'Práctica mochila convertible con sistema de ruedas retráctil', 0.19, 'ACTIVO'),
(32, 'Bolso Transparente de PVC', 'Tendencia futurista con interior de tela contrastante', 0.19, 'ACTIVO'),
(33, 'Bandolera Deportiva Running', 'Diseño ultraligero con bolsillo para hidratación y llaves', 0.19, 'ACTIVO'),
(34, 'Clutch Convertible a Mochila', 'Innovador diseño que se transforma en 3 estilos diferentes', 0.19, 'ACTIVO'),
(35, 'Bolso de Cuero Vegano', 'Alternativa ecológica con apariencia de cuero genuino', 0.19, 'ACTIVO'),
(36, 'Mochila Térmica para Viajes', 'Mantiene la temperatura de alimentos y bebidas', 0.19, 'ACTIVO'),
(37, 'Bolso Médico Organizado', 'Con divisores para medicamentos y accesorios médicos', 0.19, 'ACTIVO'),
(38, 'Bandolera Artesanal Mexicana', 'Hecha a mano con técnicas tradicionales y colores vibrantes', 0.19, 'ACTIVO'),
(39, 'Bolso de Playa Transparente', 'Resistente al agua y arena con cierre de seguridad', 0.19, 'ACTIVO'),
(40, 'Mochila con Panel Solar', 'Incluye panel solar integrado para cargar dispositivos', 0.19, 'ACTIVO');

-- Insertar 4 unidades por cada artículo (80 unidades total)
-- Artículo 1
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000001, '#FFC0CB', '159900', 1, 15, 'STOCK', 'Color rosa pastel con detalles dorados'),
(100000000002, '#000000', '169900', 1, 12, 'STOCK', 'Color negro clásico con cierre plateado'),
(100000000003, '#964B00', '179900', 1, 8, 'STOCK', 'Cuero marrón natural con textura visible'),
(100000000004, '#FFFFFF', '149900', 1, 20, 'STOCK', 'Blanco hueso con costuras contrastantes');

-- Artículo 2
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000005, '#8B4513', '129900', 2, 18, 'STOCK', 'Cuero envejecido estilo vintage'),
(100000000006, '#556B2F', '139900', 2, 10, 'STOCK', 'Verde oliva con correas ajustables'),
(100000000007, '#708090', '119900', 2, 25, 'STOCK', 'Gris piedra con apliques metálicos'),
(100000000008, '#A0522D', '134900', 2, 15, 'STOCK', 'Siena quemado con patrones grabados');

-- Artículo 3
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000009, '#000080', '189900', 3, 30, 'STOCK', 'Azul marino con reflectivos'),
(100000000010, '#2F4F4F', '199900', 3, 22, 'STOCK', 'Verde oscuro mate impermeable'),
(100000000011, '#000000', '179900', 3, 18, 'STOCK', 'Negro con detalles rojos'),
(100000000012, '#C0C0C0', '209900', 3, 12, 'STOCK', 'Plateado metálico con tecnología dry-tech');

-- Artículo 4
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000013, '#000000', '89900', 4, 35, 'STOCK', 'Negro liso con cierre magnético discreto'),
(100000000014, '#C0C0C0', '99900', 4, 28, 'STOCK', 'Plateado con textura de piel de cocodrilo'),
(100000000015, '#800020', '94900', 4, 18, 'STOCK', 'Borgoña oscuro con detalles dorados'),
(100000000016, '#FFFFFF', '84900', 4, 22, 'STOCK', 'Blanco perla con costuras contrastantes');

-- Artículo 5
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000017, '#F5F5DC', '119900', 5, 40, 'STOCK', 'Beige natural con asas de cuero'),
(100000000018, '#36454F', '129900', 5, 25, 'STOCK', 'Gris antracita con interior rojo'),
(100000000019, '#013220', '139900', 5, 15, 'STOCK', 'Verde bosque con detalles en bronce'),
(100000000020, '#E6E6FA', '109900', 5, 30, 'STOCK', 'Lila pálido con forro a rayas');

-- Artículo 6
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000021, '#000000', '179900', 6, 20, 'STOCK', 'Negro con cremalleras ocultas RFID'),
(100000000022, '#654321', '189900', 6, 18, 'STOCK', 'Marrón oscuro con refuerzos metálicos'),
(100000000023, '#808080', '169900', 6, 22, 'STOCK', 'Gris grafito con tecnología anti-corte'),
(100000000024, '#000080', '199900', 6, 12, 'STOCK', 'Azul marino con interior organizado');

-- Artículo 7
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000025, '#4B5320', '159900', 7, 28, 'STOCK', 'Verde militar con correas expandibles'),
(100000000026, '#3D3D3D', '169900', 7, 15, 'STOCK', 'Gris oscuro con múltiples bolsillos'),
(100000000027, '#B87333', '149900', 7, 20, 'STOCK', 'Cobre envejecido con cierres reforzados'),
(100000000028, '#000000', '179900', 7, 18, 'STOCK', 'Negro mate con sistema de carga rápida');

-- Artículo 8
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000029, '#D2B48C', '139900', 8, 25, 'STOCK', 'Bronceado suave con caída natural'),
(100000000030, '#5D3954', '149900', 8, 16, 'STOCK', 'Berengena oscuro con tintes naturales'),
(100000000031, '#C19A6B', '129900', 8, 22, 'STOCK', 'Cuero camel con vetas naturales'),
(100000000032, '#708090', '159900', 8, 14, 'STOCK', 'Gris piedra con acabado envejecido');

-- Artículo 9
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000033, '#000000', '199900', 9, 18, 'STOCK', 'Negro profesional con organizador interno'),
(100000000034, '#654321', '209900', 9, 12, 'STOCK', 'Marrón oficina con detalles en latón'),
(100000000035, '#36454F', '189900', 9, 15, 'STOCK', 'Gris ejecutivo con bolsillo para laptop'),
(100000000036, '#800000', '219900', 9, 10, 'STOCK', 'Granate clásico con hebilla dorada');

-- Artículo 10
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000037, '#FF6347', '119900', 10, 30, 'STOCK', 'Tomate vibrante con cordón ajustable'),
(100000000038, '#9370DB', '129900', 10, 22, 'STOCK', 'Lavanda moderna con base estructurada'),
(100000000039, '#20B2AA', '109900', 10, 25, 'STOCK', 'Verde menta fresco con detalles plateados'),
(100000000040, '#FFD700', '139900', 10, 18, 'STOCK', 'Dorado metálico para looks elegantes');

-- Artículo 11
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000041, '#DAA520', '89900', 11, 35, 'STOCK', 'Crochet dorado con motivos florales'),
(100000000042, '#6B8E23', '94900', 11, 28, 'STOCK', 'Verde oliva tejido a mano'),
(100000000043, '#CD5C5C', '99900', 11, 22, 'STOCK', 'Rojo indio con detalles étnicos'),
(100000000044, '#4682B4', '84900', 11, 30, 'STOCK', 'Azul acero con patrones geométricos');

-- Artículo 12
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000045, '#000000', '229900', 12, 15, 'STOCK', 'Negro ejecutivo con cierre magnético'),
(100000000046, '#2F4F4F', '239900', 12, 12, 'STOCK', 'Verde oscuro con interiores de seda'),
(100000000047, '#800000', '219900', 12, 18, 'STOCK', 'Granate clásico para reuniones'),
(100000000048, '#C0C0C0', '249900', 12, 10, 'STOCK', 'Plateado metálico con terminación mate');

-- Artículo 13
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000049, '#006400', '99900', 13, 40, 'STOCK', 'Verde oscuro con correa ajustable'),
(100000000050, '#8B0000', '109900', 13, 25, 'STOCK', 'Rojo intenso con detalles reflectantes'),
(100000000051, '#000080', '104900', 13, 30, 'STOCK', 'Azul marino con bolsillo para agua'),
(100000000052, '#696969', '89900', 13, 35, 'STOCK', 'Gris grafito ligero y resistente');

-- Artículo 14
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000053, '#00FFFF', '79900', 14, 50, 'STOCK', 'Azul playero con motivos tropicales'),
(100000000054, '#FF7F50', '84900', 14, 45, 'STOCK', 'Coral vibrante resistente a la arena'),
(100000000055, '#FFFF00', '74900', 14, 38, 'STOCK', 'Amarillo soleado con bolsillo fresco'),
(100000000056, '#FF69B4', '89900', 14, 42, 'STOCK', 'Rosa fuerte con estampado de olas');

-- Artículo 15
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000057, '#4169E1', '129900', 15, 28, 'STOCK', 'Azul real con soporte ergonómico'),
(100000000058, '#FF4500', '134900', 15, 22, 'STOCK', 'Naranja intenso con reflectivos'),
(100000000059, '#228B22', '119900', 15, 25, 'STOCK', 'Verde bosque con organizador escolar'),
(100000000060, '#A0522D', '124900', 15, 20, 'STOCK', 'Siena con refuerzos en las esquinas');

-- Artículo 16
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000061, '#000000', '69900', 16, 60, 'STOCK', 'Negro ultrafino para eventos nocturnos'),
(100000000062, '#800080', '74900', 16, 45, 'STOCK', 'Púrpura real con cierre magnético'),
(100000000063, '#FFD700', '79900', 16, 38, 'STOCK', 'Dorado metálico para looks elegantes'),
(100000000064, '#FFFFFF', '64900', 16, 55, 'STOCK', 'Blanco perla con interior aterciopelado');

-- Artículo 17
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000065, '#8B4513', '149900', 17, 18, 'STOCK', 'Cuero envejecido natural con vetas'),
(100000000066, '#556B2F', '159900', 17, 15, 'STOCK', 'Verde oliva con pátina vintage'),
(100000000067, '#4B0082', '169900', 17, 12, 'STOCK', 'Índigo oscuro con aspecto desgastado'),
(100000000068, '#800000', '139900', 17, 20, 'STOCK', 'Granate envejecido con hebillas antiguas');

-- Artículo 18
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000069, '#2E8B57', '139900', 18, 25, 'STOCK', 'Verde mar convertibles 2en1'),
(100000000070, '#D2691E', '149900', 18, 18, 'STOCK', 'Chocolate con sistema de transformación'),
(100000000071, '#4682B4', '129900', 18, 22, 'STOCK', 'Azul acero multifuncional'),
(100000000072, '#696969', '159900', 18, 15, 'STOCK', 'Gris grafito adaptable');

-- Artículo 19
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000073, '#FFB6C1', '179900', 19, 20, 'STOCK', 'Rosa claro con cambiador térmico'),
(100000000074, '#87CEEB', '189900', 19, 15, 'STOCK', 'Azul cielo con bolsillos organizados'),
(100000000075, '#F0E68C', '169900', 19, 18, 'STOCK', 'Amarillo claro impermeable'),
(100000000076, '#98FB98', '199900', 19, 12, 'STOCK', 'Verde menta con aislamiento térmico');

-- Artículo 20
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000077, '#000000', '159900', 20, 30, 'STOCK', 'Negro con puerto USB de carga'),
(100000000078, '#C0C0C0', '169900', 20, 25, 'STOCK', 'Plateado tecnológico con batería integrada'),
(100000000079, '#FF0000', '149900', 20, 22, 'STOCK', 'Rojo brillante con cable USB incluido'),
(100000000080, '#FFFFFF', '179900', 20, 18, 'STOCK', 'Blanco con puerto USB-C y Lightning');

-- Artículo 21
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000081, '#121212', '219900', 21, 15, 'STOCK', 'Negro carbón con detalles en cuero'),
(100000000082, '#654321', '229900', 21, 12, 'STOCK', 'Marrón café con hebillas metálicas'),
(100000000083, '#36454F', '239900', 21, 10, 'STOCK', 'Gris oscuro profesional'),
(100000000084, '#800000', '209900', 21, 18, 'STOCK', 'Granate ejecutivo con interiores de seda');

-- Artículo 22
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000085, '#FF69B4', '99900', 22, 25, 'STOCK', 'Rosa neón con cadena dorada'),
(100000000086, '#000000', '109900', 22, 22, 'STOCK', 'Negro clásico con cadena plateada'),
(100000000087, '#FFFFFF', '94900', 22, 30, 'STOCK', 'Blanco hueso con cadena dorada'),
(100000000088, '#9370DB', '104900', 22, 18, 'STOCK', 'Lila pastel con cadena rosa');

-- Artículo 23
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000089, '#556B2F', '189900', 23, 20, 'STOCK', 'Verde militar con correa para hidratación'),
(100000000090, '#000000', '199900', 23, 15, 'STOCK', 'Negro técnico con reflectivos'),
(100000000091, '#8B4513', '179900', 23, 18, 'STOCK', 'Marrón terreno con refuerzos'),
(100000000092, '#4682B4', '169900', 23, 22, 'STOCK', 'Azul acero resistente al agua');

-- Artículo 24
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000093, '#000000', '129900', 24, 12, 'STOCK', 'Negro liso con cristales Swarovski'),
(100000000094, '#800080', '139900', 24, 10, 'STOCK', 'Púrpura real con perlas'),
(100000000095, '#C0C0C0', '149900', 24, 8, 'STOCK', 'Plateado brillante con strass'),
(100000000096, '#FFD700', '159900', 24, 15, 'STOCK', 'Dorado metálico para gala');

-- Artículo 25
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000097, '#E6E6FA', '119900', 25, 35, 'STOCK', 'Lila con estampado geométrico'),
(100000000098, '#F5F5DC', '109900', 25, 40, 'STOCK', 'Beige con motivos étnicos'),
(100000000099, '#FFFACD', '129900', 25, 25, 'STOCK', 'Amarillo claro con flores'),
(100000000100, '#FFE4E1', '99900', 25, 45, 'STOCK', 'Rosa pálido con rayas');

-- Artículo 26
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000101, '#F5DEB3', '89900', 26, 28, 'STOCK', 'Leopardo dorado sobre beige'),
(100000000102, '#FFFFFF', '94900', 26, 25, 'STOCK', 'Cebra blanca y negra'),
(100000000103, '#000000', '99900', 26, 22, 'STOCK', 'Pantera negra con detalles'),
(100000000104, '#8B4513', '84900', 26, 30, 'STOCK', 'Leopardo marrón sobre café');

-- Artículo 27
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000105, '#2F4F4F', '159900', 27, 20, 'STOCK', 'Verde oscuro con cierres ocultos'),
(100000000106, '#121212', '169900', 27, 18, 'STOCK', 'Negro con tela anti-corte'),
(100000000107, '#800000', '149900', 27, 22, 'STOCK', 'Granate con RFID protection'),
(100000000108, '#36454F', '179900', 27, 15, 'STOCK', 'Gris grafito urbano');

-- Artículo 28
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000109, '#D2B48C', '139900', 28, 18, 'STOCK', 'Saddle en cuero natural'),
(100000000110, '#8B0000', '149900', 28, 15, 'STOCK', 'Rojo vino con detalles modernos'),
(100000000111, '#708090', '129900', 28, 20, 'STOCK', 'Gris piedra con forma ergonómica'),
(100000000112, '#4B0082', '159900', 28, 12, 'STOCK', 'Índigo con costuras contrastantes');

-- Artículo 29
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000113, '#000000', '109900', 29, 25, 'STOCK', 'Negro ejecutivo con bloc premium'),
(100000000114, '#654321', '119900', 29, 20, 'STOCK', 'Marrón oficina con detalles'),
(100000000115, '#C0C0C0', '99900', 29, 28, 'STOCK', 'Plateado profesional'),
(100000000116, '#800000', '129900', 29, 15, 'STOCK', 'Granate clásico para negocios');

-- Artículo 30
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000117, '#F5F5DC', '89900', 30, 35, 'STOCK', 'Beige con asas de bambú natural'),
(100000000118, '#8B4513', '94900', 30, 30, 'STOCK', 'Marrón con bambú oscurecido'),
(100000000119, '#556B2F', '99900', 30, 25, 'STOCK', 'Verde oliva con bambú claro'),
(100000000120, '#000000', '84900', 30, 40, 'STOCK', 'Negro con bambú teñido');

-- Artículo 31
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000121, '#4169E1', '189900', 31, 22, 'STOCK', 'Azul real con ruedas silenciosas'),
(100000000122, '#FF0000', '199900', 31, 18, 'STOCK', 'Rojo brillante con sistema retráctil'),
(100000000123, '#228B22', '179900', 31, 20, 'STOCK', 'Verde bosque ergonómico'),
(100000000124, '#000000', '209900', 31, 15, 'STOCK', 'Negro con refuerzos en esquinas');

-- Artículo 32
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000125, '#FFFFFF', '79900', 32, 40, 'STOCK', 'Transparente con interior blanco'),
(100000000126, '#000000', '84900', 32, 35, 'STOCK', 'Transparente con interior negro'),
(100000000127, '#FF69B4', '89900', 32, 30, 'STOCK', 'Transparente con interior rosa'),
(100000000128, '#87CEEB', '74900', 32, 45, 'STOCK', 'Transparente con interior azul');

-- Artículo 33
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000129, '#FF4500', '69900', 33, 50, 'STOCK', 'Naranja neón con bolsillo para llaves'),
(100000000130, '#000000', '74900', 33, 45, 'STOCK', 'Negro con cinturón reflectante'),
(100000000131, '#32CD32', '64900', 33, 55, 'STOCK', 'Verde limón ultraligero'),
(100000000132, '#1E90FF', '79900', 33, 40, 'STOCK', 'Azul eléctrico para running');

-- Artículo 34
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000133, '#9370DB', '129900', 34, 25, 'STOCK', 'Lila convertible 3en1'),
(100000000134, '#FF6347', '139900', 34, 20, 'STOCK', 'Coral multifuncional'),
(100000000135, '#20B2AA', '119900', 34, 28, 'STOCK', 'Verde menta transformable'),
(100000000136, '#FFD700', '149900', 34, 18, 'STOCK', 'Dorado elegante convertible');

-- Artículo 35
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000137, '#8B4513', '109900', 35, 30, 'STOCK', 'Cuero vegano marrón'),
(100000000138, '#000000', '119900', 35, 25, 'STOCK', 'Cuero vegano negro'),
(100000000139, '#556B2F', '99900', 35, 35, 'STOCK', 'Cuero vegano verde'),
(100000000140, '#800020', '129900', 35, 22, 'STOCK', 'Cuero vegano borgoña');

-- Artículo 36
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000141, '#FFA500', '159900', 36, 20, 'STOCK', 'Naranja con aislamiento térmico'),
(100000000142, '#000000', '169900', 36, 18, 'STOCK', 'Negro mate térmico'),
(100000000143, '#008080', '149900', 36, 22, 'STOCK', 'Verde azulado para viajes'),
(100000000144, '#FFFFFF', '179900', 36, 15, 'STOCK', 'Blanco con bolsillo frío/calor');

-- Artículo 37
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000145, '#FFFFFF', '89900', 37, 35, 'STOCK', 'Blanco médico con divisores'),
(100000000146, '#ADD8E6', '94900', 37, 30, 'STOCK', 'Azul claro organizado'),
(100000000147, '#FFC0CB', '99900', 37, 25, 'STOCK', 'Rosa pastel para medicamentos'),
(100000000148, '#90EE90', '84900', 37, 40, 'STOCK', 'Verde menta con etiquetas');

-- Artículo 38
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000149, '#FF0000', '119900', 38, 22, 'STOCK', 'Rojo mexicano con bordados'),
(100000000150, '#0000FF', '129900', 38, 18, 'STOCK', 'Azul tradicional con flecos'),
(100000000151, '#FFFF00', '109900', 38, 25, 'STOCK', 'Amarillo vibrante artesanal'),
(100000000152, '#008000', '139900', 38, 15, 'STOCK', 'Verde con motivos ancestrales');

-- Artículo 39
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000153, '#00FFFF', '59900', 39, 60, 'STOCK', 'Azul playero transparente'),
(100000000154, '#FF69B4', '64900', 39, 55, 'STOCK', 'Rosa transparente con cierre'),
(100000000155, '#FFFF00', '54900', 39, 65, 'STOCK', 'Amarillo transparente seguro'),
(100000000156, '#FFFFFF', '69900', 39, 50, 'STOCK', 'Transparente con base blanca');

-- Artículo 40
INSERT INTO unidad (upc, label, precio, articulo, cantidad, estado, descripcion) VALUES
(100000000157, '#000000', '229900', 40, 15, 'STOCK', 'Negro con panel solar 10W'),
(100000000158, '#36454F', '239900', 40, 12, 'STOCK', 'Gris tecnológico con USB-C'),
(100000000159, '#006400', '219900', 40, 18, 'STOCK', 'Verde oscuro energético'),
(100000000160, '#800000', '249900', 40, 10, 'STOCK', 'Granate con batería integrada');

-- Relaciones entre artículos y categorías (arti_cate)
-- Artículo 1 relacionado con varias categorías
INSERT INTO arti_cate (articulo, categoria) VALUES
(1, 1), (1, 7), (1, 15), (1, 22), (1, 61); -- Estilo, Tote, Cuero, Casual, Mujeres

-- Artículo 2
INSERT INTO arti_cate (articulo, categoria) VALUES
(2, 1), (2, 8), (2, 15), (2, 77), (2, 61); -- Estilo, Bandolera, Cuero, Vintage, Mujeres

-- Artículo 3
INSERT INTO arti_cate (articulo, categoria) VALUES
(3, 1), (3, 10), (3, 17), (3, 26), (3, 68); -- Estilo, Mochila, Lona, Viaje, Impermeables

-- Artículo 4
INSERT INTO arti_cate (articulo, categoria) VALUES
(4, 1), (4, 11), (4, 19), (4, 24), (4, 61); -- Estilo, Clutch, Metalizados, Fiesta, Mujeres

-- Artículo 5
INSERT INTO arti_cate (articulo, categoria) VALUES
(5, 1), (5, 7), (5, 22), (5, 61), (5, 78); -- Estilo, Tote, Casual, Mujeres, Minimalista

-- Artículo 6
INSERT INTO arti_cate (articulo, categoria) VALUES
(6, 1), (6, 8), (6, 44), (6, 67), (6, 61); -- Estilo, Bandolera, Función, Antirrobo, Mujeres

-- Artículo 7
INSERT INTO arti_cate (articulo, categoria) VALUES
(7, 1), (7, 10), (7, 26), (7, 69), (7, 63); -- Estilo, Mochila, Viaje, Convertibles, Unisex

-- Artículo 8
INSERT INTO arti_cate (articulo, categoria) VALUES
(8, 1), (8, 12), (8, 15), (8, 22), (8, 61); -- Estilo, Hobo, Cuero, Casual, Mujeres

-- Artículo 9
INSERT INTO arti_cate (articulo, categoria) VALUES
(9, 1), (9, 13), (9, 27), (9, 33), (9, 62); -- Estilo, Satchel, Trabajo, Lujo, Hombres

-- Artículo 10
INSERT INTO arti_cate (articulo, categoria) VALUES
(10, 1), (10, 14), (10, 24), (10, 46), (10, 61); -- Estilo, Bucket, Fiesta, Tendencias, Mujeres

-- Artículo 11
INSERT INTO arti_cate (articulo, categoria) VALUES
(11, 1), (11, 9), (11, 47), (11, 82), (11, 79); -- Estilo, Mano, Artesanales, Hechos a Mano, Boho-Chic

-- Artículo 12
INSERT INTO arti_cate (articulo, categoria) VALUES
(12, 1), (12, 9), (12, 27), (12, 33), (12, 62); -- Estilo, Mano, Trabajo, Lujo, Hombres

-- Artículo 13
INSERT INTO arti_cate (articulo, categoria) VALUES
(13, 1), (13, 8), (13, 22), (13, 63), (13, 72); -- Estilo, Bandolera, Casual, Unisex, Cortas

-- Artículo 14
INSERT INTO arti_cate (articulo, categoria) VALUES
(14, 1), (14, 7), (14, 37), (14, 79), (14, 61); -- Estilo, Tote, Primavera/Verano, Boho-Chic, Mujeres

-- Artículo 15
INSERT INTO arti_cate (articulo, categoria) VALUES
(15, 1), (15, 10), (15, 66), (15, 28), (15, 63); -- Estilo, Mochila, Organizador, Mini, Unisex

-- Artículo 16
INSERT INTO arti_cate (articulo, categoria) VALUES
(16, 1), (16, 11), (16, 24), (16, 50), (16, 61); -- Estilo, Clutch, Fiesta, Imán, Mujeres

-- Artículo 17
INSERT INTO arti_cate (articulo, categoria) VALUES
(17, 1), (17, 12), (17, 15), (17, 77), (17, 61); -- Estilo, Hobo, Cuero, Vintage, Mujeres

-- Artículo 18
INSERT INTO arti_cate (articulo, categoria) VALUES
(18, 1), (18, 8), (18, 44), (18, 69), (18, 63); -- Estilo, Bandolera, Función, Convertibles, Unisex

-- Artículo 19
INSERT INTO arti_cate (articulo, categoria) VALUES
(19, 1), (19, 7), (19, 44), (19, 71), (19, 61); -- Estilo, Tote, Función, Mamá, Mujeres

-- Artículo 20 (ejemplo final)
INSERT INTO arti_cate (articulo, categoria) VALUES
(20, 1), (20, 10), (20, 44), (20, 70), (20, 63); -- Estilo, Mochila, Función, Portátil, Unisex

-- Artículo 21
INSERT INTO arti_cate (articulo, categoria) VALUES
(21, 1), (21, 9), (21, 27), (21, 62), (21, 33); -- Estilo, Mano, Trabajo, Hombres, Lujo

-- Artículo 22
INSERT INTO arti_cate (articulo, categoria) VALUES
(22, 1), (22, 8), (22, 24), (22, 28), (22, 61); -- Estilo, Bandolera, Fiesta, Mini, Mujeres

-- Artículo 23
INSERT INTO arti_cate (articulo, categoria) VALUES
(23, 1), (23, 10), (23, 26), (23, 63), (23, 68); -- Estilo, Mochila, Viaje, Unisex, Impermeables

-- Artículo 24
INSERT INTO arti_cate (articulo, categoria) VALUES
(24, 1), (24, 11), (24, 24), (24, 19), (24, 61); -- Estilo, Clutch, Fiesta, Metalizados, Mujeres

-- Artículo 25
INSERT INTO arti_cate (articulo, categoria) VALUES
(25, 1), (25, 7), (25, 17), (25, 31), (25, 36); -- Estilo, Tote, Lona, Grande, Sostenibles

-- Artículo 26
INSERT INTO arti_cate (articulo, categoria) VALUES
(26, 1), (26, 8), (26, 58), (26, 46), (26, 61); -- Estilo, Bandolera, Estampados, Tendencias, Mujeres

-- Artículo 27
INSERT INTO arti_cate (articulo, categoria) VALUES
(27, 1), (27, 10), (27, 44), (27, 67), (27, 63); -- Estilo, Mochila, Función, Antirrobo, Unisex

-- Artículo 28
INSERT INTO arti_cate (articulo, categoria) VALUES
(28, 1), (28, 12), (28, 15), (28, 77), (28, 61); -- Estilo, Hobo, Cuero, Vintage, Mujeres

-- Artículo 29
INSERT INTO arti_cate (articulo, categoria) VALUES
(29, 1), (29, 9), (29, 27), (29, 62), (29, 33); -- Estilo, Mano, Trabajo, Hombres, Lujo

-- Artículo 30
INSERT INTO arti_cate (articulo, categoria) VALUES
(30, 1), (30, 7), (30, 37), (30, 47), (30, 36); -- Estilo, Tote, Primavera/Verano, Artesanales, Sostenibles

-- Artículo 31
INSERT INTO arti_cate (articulo, categoria) VALUES
(31, 1), (31, 10), (31, 15), (31, 28), (31, 63); -- Estilo, Mochila, Cuero, Mini, Unisex

-- Artículo 32
INSERT INTO arti_cate (articulo, categoria) VALUES
(32, 1), (32, 7), (32, 37), (32, 46), (32, 80); -- Estilo, Tote, Primavera/Verano, Tendencias, Futurista

-- Artículo 33
INSERT INTO arti_cate (articulo, categoria) VALUES
(33, 1), (33, 8), (33, 13), (33, 44), (33, 63); -- Estilo, Bandolera, Deportivo, Función, Unisex

-- Artículo 34
INSERT INTO arti_cate (articulo, categoria) VALUES
(34, 1), (34, 11), (34, 44), (34, 69), (34, 61); -- Estilo, Clutch, Función, Convertibles, Mujeres

-- Artículo 35
INSERT INTO arti_cate (articulo, categoria) VALUES
(35, 1), (35, 12), (35, 16), (35, 36), (35, 61); -- Estilo, Hobo, Sintética, Sostenibles, Mujeres

-- Artículo 36
INSERT INTO arti_cate (articulo, categoria) VALUES
(36, 1), (36, 10), (36, 26), (36, 44), (36, 63); -- Estilo, Mochila, Viaje, Función, Unisex

-- Artículo 37
INSERT INTO arti_cate (articulo, categoria) VALUES
(37, 1), (37, 9), (37, 27), (37, 44), (37, 63); -- Estilo, Mano, Trabajo, Función, Unisex

-- Artículo 38
INSERT INTO arti_cate (articulo, categoria) VALUES
(38, 1), (38, 8), (38, 47), (38, 82), (38, 79); -- Estilo, Bandolera, Artesanales, Hechos a Mano, Boho-Chic

-- Artículo 39
INSERT INTO arti_cate (articulo, categoria) VALUES
(39, 1), (39, 7), (39, 37), (39, 68), (39, 61); -- Estilo, Tote, Primavera/Verano, Impermeables, Mujeres

-- Artículo 40
INSERT INTO arti_cate (articulo, categoria) VALUES
(40, 1), (40, 10), (40, 44), (40, 70), (40, 80); -- Estilo, Mochila, Función, Portátil, Futurista
