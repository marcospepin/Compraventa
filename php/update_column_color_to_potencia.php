<?php
require_once 'config.php';

// Modificar la columna color por potencia
$sql = "ALTER TABLE vehiculos CHANGE COLUMN color potencia INT NULL DEFAULT 0";

if ($conn->query($sql)) {
    echo "✅ Columna 'color' cambiada a 'potencia' correctamente\n";
} else {
    echo "❌ Error al modificar columna: " . $conn->error . "\n";
}

$conn->close();
?>
