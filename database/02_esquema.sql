-- Ejecutar dentro de catalogo_favoritos_db.
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL CHECK (length(trim(nombre)) > 0),
  correo VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  rol VARCHAR(15) NOT NULL DEFAULT 'usuario'
      CHECK (rol IN ('usuario', 'administrador')),
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL CHECK (length(trim(nombre)) > 0),
  descripcion VARCHAR(500) NOT NULL CHECK (length(trim(descripcion)) > 0),
  categoria VARCHAR(80) NOT NULL CHECK (length(trim(categoria)) > 0),
  precio NUMERIC(12,2) NOT NULL CHECK (precio > 0),
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favoritos (
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  fecha_agregado TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (usuario_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos (categoria);
CREATE INDEX IF NOT EXISTS idx_favoritos_producto ON favoritos (producto_id);
