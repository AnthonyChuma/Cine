INSERT INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Administrador del sistema'),
('CAJERO', 'Cajero del cine'),
('CLIENTE', 'Cliente del sistema');

INSERT INTO generos (nombre) VALUES
('Acción'),
('Comedia'),
('Drama'),
('Terror'),
('Ciencia Ficción');

INSERT INTO salas (nombre, capacidad, estado) VALUES
('Sala 1', 80, 'ACTIVA'),
('Sala 2', 60, 'ACTIVA');

INSERT INTO asientos (fila, numero, estado, sala_id) VALUES
('A', 1, 'DISPONIBLE', 1), ('A', 2, 'DISPONIBLE', 1), ('A', 3, 'DISPONIBLE', 1),
('B', 1, 'DISPONIBLE', 1), ('B', 2, 'DISPONIBLE', 1), ('B', 3, 'DISPONIBLE', 1),
('A', 1, 'DISPONIBLE', 2), ('A', 2, 'DISPONIBLE', 2), ('A', 3, 'DISPONIBLE', 2);

INSERT INTO usuarios (nombre, apellido, correo, password_hash, estado, fecha_creacion, rol_id) VALUES
('Admin', 'Sistema', 'admin@cinepotosi.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWn/aI8F5fK2u93LxWVAQ1LkQ0Y7JW', 'ACTIVO', NOW(), 1);
