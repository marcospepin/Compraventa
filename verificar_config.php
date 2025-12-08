<?php
require_once 'php/config.php';

echo "=== VERIFICACIÓN DE CONFIGURACIÓN ===\n\n";

// Verificar tabla vehiculo_imagenes
$checkSql = "SHOW TABLES LIKE 'vehiculo_imagenes'";
$result = $conn->query($checkSql);

if ($result && $result->num_rows > 0) {
    echo "✅ Tabla 'vehiculo_imagenes' existe\n\n";
    
    // Mostrar estructura
    $structureSql = "DESCRIBE vehiculo_imagenes";
    $structureResult = $conn->query($structureSql);
    
    echo "ESTRUCTURA:\n";
    while ($row = $structureResult->fetch_assoc()) {
        echo "- " . $row['Field'] . " (" . $row['Type'] . ")\n";
    }
} else {
    echo "❌ Tabla 'vehiculo_imageles' NO existe\n";
}

// Verificar carpeta uploads
echo "\n=== VERIFICACIÓN DE CARPETAS ===\n\n";

$uploadsDir = __DIR__ . '/uploads/vehiculos/';
if (is_dir($uploadsDir)) {
    echo "✅ Carpeta 'uploads/vehiculos' existe\n";
    echo "   Permisos: " . decoct(fileperms($uploadsDir) & 0777) . "\n";
    echo "   Es escribible: " . (is_writable($uploadsDir) ? 'SÍ' : 'NO') . "\n";
} else {
    echo "❌ Carpeta 'uploads/vehiculos' NO existe\n";
    echo "   Creando carpeta...\n";
    if (mkdir($uploadsDir, 0755, true)) {
        echo "   ✅ Carpeta creada\n";
    } else {
        echo "   ❌ Error al crear carpeta\n";
    }
}

// Verificar tabla vehiculos
echo "\n=== VERIFICACIÓN DE TABLA VEHICULOS ===\n\n";

$vehiculosCheck = $conn->query("SHOW TABLES LIKE 'vehiculos'");
if ($vehiculosCheck && $vehiculosCheck->num_rows > 0) {
    echo "✅ Tabla 'vehiculos' existe\n";
    
    // Contar vehículos
    $countResult = $conn->query("SELECT COUNT(*) as total FROM vehiculos");
    $countRow = $countResult->fetch_assoc();
    echo "   Total de vehículos: " . $countRow['total'] . "\n";
} else {
    echo "❌ Tabla 'vehiculos' NO existe\n";
}

echo "\n✅ Verificación completada\n";

$conn->close();
?>
