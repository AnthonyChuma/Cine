CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(500)
);

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    rol_id BIGINT NOT NULL REFERENCES roles(id)
);

CREATE TABLE generos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE peliculas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    sinopsis TEXT,
    duracion_minutos INTEGER,
    clasificacion VARCHAR(100),
    imagen_url VARCHAR(1000),
    trailer_url VARCHAR(1000),
    estado VARCHAR(50) NOT NULL,
    fecha_estreno DATE,
    genero_id BIGINT REFERENCES generos(id)
);

CREATE TABLE salas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    capacidad INTEGER NOT NULL,
    estado VARCHAR(50) NOT NULL
);

CREATE TABLE asientos (
    id BIGSERIAL PRIMARY KEY,
    fila VARCHAR(10) NOT NULL,
    numero INTEGER NOT NULL,
    estado VARCHAR(50) NOT NULL,
    sala_id BIGINT NOT NULL REFERENCES salas(id),
    CONSTRAINT uq_sala_fila_numero UNIQUE (sala_id, fila, numero)
);

CREATE TABLE funciones (
    id BIGSERIAL PRIMARY KEY,
    pelicula_id BIGINT NOT NULL REFERENCES peliculas(id),
    sala_id BIGINT NOT NULL REFERENCES salas(id),
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    codigo_unico VARCHAR(50) NOT NULL UNIQUE,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    funcion_id BIGINT NOT NULL REFERENCES funciones(id),
    asiento_id BIGINT NOT NULL REFERENCES asientos(id),
    estado VARCHAR(50) NOT NULL,
    fecha_compra TIMESTAMP NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    CONSTRAINT uq_funcion_asiento UNIQUE (funcion_id, asiento_id)
);

CREATE TABLE ventas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    cajero_id BIGINT REFERENCES usuarios(id),
    fecha_venta TIMESTAMP NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    metodo_pago VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

CREATE TABLE detalle_ventas (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT NOT NULL REFERENCES ventas(id),
    ticket_id BIGINT NOT NULL REFERENCES tickets(id),
    precio_unitario NUMERIC(10,2) NOT NULL
);

CREATE TABLE pagos (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT NOT NULL REFERENCES ventas(id),
    metodo VARCHAR(100) NOT NULL,
    monto NUMERIC(10,2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha_pago TIMESTAMP NOT NULL,
    referencia VARCHAR(255)
);

CREATE TABLE auditorias (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    accion VARCHAR(255) NOT NULL,
    entidad VARCHAR(255) NOT NULL,
    entidad_id BIGINT,
    fecha TIMESTAMP NOT NULL,
    ip VARCHAR(100)
);
