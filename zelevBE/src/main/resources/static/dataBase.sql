USE zelev;
CREATE TABLE IF NOT EXISTS rol (
	id_rol int auto_increment primary key not null,
	rol varchar(10) not null
);

CREATE TABLE IF NOT EXISTS usuario (
	cedula varchar(20) primary key not null,
	nombres varchar(50) not null,
	apellidos varchar(50),
	nombre_usuario varchar(10) not null unique,
	email varchar(100) not null unique,
	telefono varchar(10),
	direccion varchar(100),
	contrasena varchar(500) not null,
	fecha_nacimiento date not null,
	fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP(),
	estado enum('ACTIVO', 'BLOQUEADO', 'ELIMINADO', 'INACTIVO') not null
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
	upc varchar(12) primary key not null,
	label varchar(30) not null,
	precio varchar(20) not null,
	articulo int not null,
	cantidad int not null,
	fecha_creacion timestamp default CURRENT_TIMESTAMP(),
	estado enum('NOSTOCK', 'STOCK', 'SOLICITADO'),
	descripcion varchar(200),
	CONSTRAINT unidad_articulo_FK FOREIGN KEY (articulo) REFERENCES articulo (id_articulo) ON DELETE CASCADE
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
	unidad varchar(12) not null,
	PRIMARY KEY (pedido, unidad),
	CONSTRAINT peun_pedido_FK FOREIGN KEY (pedido) REFERENCES pedido (id_pedido) ON DELETE CASCADE,
	CONSTRAINT peun_unidad_FK FOREIGN KEY (unidad) REFERENCES unidad (upc) ON DELETE CASCADE
);

INSERT INTO zelev.rol (rol) VALUES ('ADMIN');
INSERT INTO zelev.rol (rol) VALUES ('USER');
