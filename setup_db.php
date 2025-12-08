<?php
require_once 'php/config.php';

echo "=== CREANDO TABLA DE IMÁGENES DE VEHÍCULOS ===\n\n";

// SQL para crear la tabla
$sql = "CREATE TABLE IF NOT EXISTS vehiculo_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    imagen_url VARCHAR(255) NOT NULL,
    orden INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
)";

if ($conn->query($sql) === TRUE) {
    echo "✅ Tabla 'vehiculo_imagenes' creada exitosamente\n\n";
} else {
    echo "❌ Error al crear la tabla: " . $conn->error . "\n\n";
    exit;
}

// Crear índice solo si no existe
$indexCheckSql = "SHOW INDEX FROM vehiculo_imagenes WHERE Key_name = 'idx_vehiculo_id'";
$indexCheck = $conn->query($indexCheckSql);

if ($indexCheck && $indexCheck->num_rows === 0) {
    $indexSql = "CREATE INDEX idx_vehiculo_id ON vehiculo_imagenes(vehiculo_id)";
    if ($conn->query($indexSql) === TRUE) {
        echo "✅ Índice creado exitosamente\n\n";
    } else {
        echo "⚠️ Aviso: " . $conn->error . "\n\n";
    }
} else {
    echo "✅ Índice ya existe\n\n";
}

// Verificar que la tabla fue creada
$checkSql = "SHOW TABLES LIKE 'vehiculo_imagenes'";
$result = $conn->query($checkSql);

if ($result->num_rows > 0) {
    echo "✅ TABLA VERIFICADA: vehiculo_imagenes existe en la base de datos\n\n";
    
    // Mostrar estructura de la tabla
    $structureSql = "DESCRIBE vehiculo_imagenes";
    $structureResult = $conn->query($structureSql);
    
    echo "ESTRUCTURA DE LA TABLA:\n";
    echo str_repeat("-", 80) . "\n";
    while ($row = $structureResult->fetch_assoc()) {
        printf("%-15s %-20s %-10s %-15s\n", $row['Field'], $row['Type'], $row['Null'], $row['Key']);
    }
    echo str_repeat("-", 80) . "\n\n";
    
    echo "✅ BASE DE DATOS LISTA PARA SUBIR IMÁGENES\n";
    echo "\nAhora puedes:\n";
    echo "1. Ir a http://localhost/Compraventa/admin.html\n";
    echo "2. Inicia sesión como admin\n";
    echo "3. Ve a 'Publicar Vehículo'\n";
    echo "4. Sube hasta 7 imágenes por vehículo\n";
} else {
    echo "❌ Error: No se pudo verificar la creación de la tabla\n";
}

$conn->close();
?>
