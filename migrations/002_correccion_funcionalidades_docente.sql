-- Migración de corrección para el sistema de venta virtual de tickets del Cine Hispano

BEGIN;

-- Asegurar columnas en peliculas para vigencia completa.
ALTER TABLE IF EXISTS peliculas
  ADD COLUMN IF NOT EXISTS fecha_inicio_vigencia DATE,
  ADD COLUMN IF NOT EXISTS fecha_fin_vigencia DATE,
  ADD COLUMN IF NOT EXISTS destacada BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promocion TEXT,
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA';

UPDATE peliculas
SET fecha_inicio_vigencia = CURRENT_DATE
WHERE estado = 'ACTIVA' AND fecha_inicio_vigencia IS NULL;

UPDATE peliculas
SET fecha_fin_vigencia = CURRENT_DATE + INTERVAL '30 days'
WHERE estado = 'ACTIVA' AND fecha_fin_vigencia IS NULL;

UPDATE peliculas
SET estado = 'ACTIVA'
WHERE estado IS NULL;

-- Asegurar columnas en ventas para pago y estado.
ALTER TABLE IF EXISTS ventas
  ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(20),
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  ADD COLUMN IF NOT EXISTS fecha_venta TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS cajero_id INTEGER;

-- Asegurar columnas en pagos (no elimina nada existente).
ALTER TABLE IF EXISTS pagos
  ADD COLUMN IF NOT EXISTS referencia_pago TEXT;

-- Asegurar columnas en tickets para relación completa y fecha.
ALTER TABLE IF EXISTS tickets
  ADD COLUMN IF NOT EXISTS pelicula_id INTEGER REFERENCES peliculas(id),
  ADD COLUMN IF NOT EXISTS sala_id INTEGER REFERENCES salas(id),
  ADD COLUMN IF NOT EXISTS fecha_compra TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO';

ALTER TABLE IF EXISTS tickets
  ADD COLUMN IF NOT EXISTS codigo_ticket TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_funcion_asiento ON tickets (funcion_id, asiento_id) WHERE estado != 'ANULADO';

-- Asegurar detalles de venta.
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id SERIAL PRIMARY KEY,
  venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0)
);

COMMIT;
