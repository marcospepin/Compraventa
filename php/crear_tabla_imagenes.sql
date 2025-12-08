-- Crear tabla para almacenar múltiples imágenes por vehículo
CREATE TABLE IF NOT EXISTS vehiculo_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    imagen_url VARCHAR(255) NOT NULL,
    orden INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_vehiculo_id ON vehiculo_imagenes(vehiculo_id);
