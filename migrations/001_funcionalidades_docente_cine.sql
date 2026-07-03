-- Migración para las funcionalidades del docente

BEGIN;

-- Tabla de salas y sus estados
CREATE TABLE IF NOT EXISTS salas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'ESTANDAR',
  filas INTEGER NOT NULL CHECK (filas > 0),
  columnas INTEGER NOT NULL CHECK (columnas > 0),
  capacidad_total INTEGER NOT NULL CHECK (capacidad_total > 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA'
);

-- Tabla de asientos por sala
CREATE TABLE IF NOT EXISTS asientos (
  id SERIAL PRIMARY KEY,
  sala_id INTEGER NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
  fila INTEGER NOT NULL CHECK (fila > 0),
  numero INTEGER NOT NULL CHECK (numero > 0),
  codigo_asiento TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE'
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_asientos_sala_codigo ON asientos (sala_id, codigo_asiento);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('QR', 'TARJETA')),
  monto NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
  referencia_pago TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'ANULADO')),
  fecha_pago TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Asegurar columnas adicionales en peliculas
ALTER TABLE IF EXISTS peliculas
  ADD COLUMN IF NOT EXISTS fecha_inicio_vigencia DATE,
  ADD COLUMN IF NOT EXISTS fecha_fin_vigencia DATE,
  ADD COLUMN IF NOT EXISTS destacada BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promocion TEXT,
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA';

-- Asegurar columnas adicionales en funciones
ALTER TABLE IF EXISTS funciones
  ADD COLUMN IF NOT EXISTS hora_fin TIME,
  ADD COLUMN IF NOT EXISTS precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADA';

-- Asegurar columnas adicionales en ventas
ALTER TABLE IF EXISTS ventas
  ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(20),
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  ADD COLUMN IF NOT EXISTS fecha_venta TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS cajero_id INTEGER;

-- Asegurar columnas adicionales en tickets
ALTER TABLE IF EXISTS tickets
  ADD COLUMN IF NOT EXISTS codigo_ticket TEXT,
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  ADD COLUMN IF NOT EXISTS fecha_emision TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS precio NUMERIC(10,2) NOT NULL DEFAULT 0;

-- Índice único para evitar la venta doble del mismo asiento en la misma función
CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_funcion_asiento ON tickets (funcion_id, asiento_id) WHERE estado != 'ANULADO';

-- Índices de soporte
CREATE INDEX IF NOT EXISTS idx_peliculas_vigencia_estado ON peliculas (estado, fecha_inicio_vigencia, fecha_fin_vigencia);
CREATE INDEX IF NOT EXISTS idx_funciones_sala_estado_fecha ON funciones (sala_id, estado, fecha, hora_inicio);
CREATE INDEX IF NOT EXISTS idx_tickets_usuario ON tickets (usuario_id);

-- Crear detalle de ventas si no existe
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id SERIAL PRIMARY KEY,
  venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0)
);

COMMIT;
