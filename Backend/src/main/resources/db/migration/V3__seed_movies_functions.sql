-- Datos de prueba para cartelera y funciones del Cine Hispano Potosí.
-- Se ejecuta de forma idempotente para evitar duplicados.

INSERT INTO peliculas (titulo, sinopsis, duracion_minutos, clasificacion, imagen_url, trailer_url, estado, fecha_estreno, genero_id)
SELECT 'Avatar: El Camino del Agua', 'Una aventura visual de ciencia ficción en Pandora, con acción, familia y mundos submarinos.', 192, 'ATP', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/', 'ACTIVA', CURRENT_DATE - 20, g.id
FROM generos g WHERE g.nombre = 'Ciencia Ficción'
ON CONFLICT DO NOTHING;

INSERT INTO peliculas (titulo, sinopsis, duracion_minutos, clasificacion, imagen_url, trailer_url, estado, fecha_estreno, genero_id)
SELECT 'Intensamente 2', 'Las emociones vuelven en una historia familiar llena de humor, cambios y aprendizaje.', 96, 'ATP', 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/', 'ACTIVA', CURRENT_DATE - 10, g.id
FROM generos g WHERE g.nombre = 'Comedia'
ON CONFLICT DO NOTHING;

INSERT INTO peliculas (titulo, sinopsis, duracion_minutos, clasificacion, imagen_url, trailer_url, estado, fecha_estreno, genero_id)
SELECT 'Deadpool & Wolverine', 'Acción, humor y aventura con dos personajes que unen fuerzas en una función intensa.', 127, '+14', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/', 'ACTIVA', CURRENT_DATE - 5, g.id
FROM generos g WHERE g.nombre = 'Acción'
ON CONFLICT DO NOTHING;

INSERT INTO peliculas (titulo, sinopsis, duracion_minutos, clasificacion, imagen_url, trailer_url, estado, fecha_estreno, genero_id)
SELECT 'Kung Fu Panda 4', 'Una película familiar de aventura, comedia y superación con nuevas misiones.', 94, 'ATP', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/', 'ACTIVA', CURRENT_DATE - 12, g.id
FROM generos g WHERE g.nombre = 'Comedia'
ON CONFLICT DO NOTHING;

INSERT INTO peliculas (titulo, sinopsis, duracion_minutos, clasificacion, imagen_url, trailer_url, estado, fecha_estreno, genero_id)
SELECT 'La Noche del Cine', 'Una historia de suspenso pensada para una función nocturna llena de misterio.', 110, '+14', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/', 'ACTIVA', CURRENT_DATE - 2, g.id
FROM generos g WHERE g.nombre = 'Terror'
ON CONFLICT DO NOTHING;

INSERT INTO funciones (pelicula_id, sala_id, fecha, hora_inicio, hora_fin, precio, estado)
SELECT p.id, s.id, CURRENT_DATE, TIME '18:00', TIME '21:12', 35.00, 'PROGRAMADA'
FROM peliculas p, salas s
WHERE p.titulo = 'Avatar: El Camino del Agua' AND s.nombre = 'Sala 1'
ON CONFLICT DO NOTHING;

INSERT INTO funciones (pelicula_id, sala_id, fecha, hora_inicio, hora_fin, precio, estado)
SELECT p.id, s.id, CURRENT_DATE, TIME '16:00', TIME '17:36', 25.00, 'PROGRAMADA'
FROM peliculas p, salas s
WHERE p.titulo = 'Intensamente 2' AND s.nombre = 'Sala 2'
ON CONFLICT DO NOTHING;

INSERT INTO funciones (pelicula_id, sala_id, fecha, hora_inicio, hora_fin, precio, estado)
SELECT p.id, s.id, CURRENT_DATE + 1, TIME '20:00', TIME '22:07', 35.00, 'PROGRAMADA'
FROM peliculas p, salas s
WHERE p.titulo = 'Deadpool & Wolverine' AND s.nombre = 'Sala 1'
ON CONFLICT DO NOTHING;

INSERT INTO funciones (pelicula_id, sala_id, fecha, hora_inicio, hora_fin, precio, estado)
SELECT p.id, s.id, CURRENT_DATE + 1, TIME '15:30', TIME '17:04', 25.00, 'PROGRAMADA'
FROM peliculas p, salas s
WHERE p.titulo = 'Kung Fu Panda 4' AND s.nombre = 'Sala 2'
ON CONFLICT DO NOTHING;

INSERT INTO funciones (pelicula_id, sala_id, fecha, hora_inicio, hora_fin, precio, estado)
SELECT p.id, s.id, CURRENT_DATE + 2, TIME '21:30', TIME '23:20', 30.00, 'PROGRAMADA'
FROM peliculas p, salas s
WHERE p.titulo = 'La Noche del Cine' AND s.nombre = 'Sala 1'
ON CONFLICT DO NOTHING;
