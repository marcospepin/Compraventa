<?php
require_once 'config.php';

header('Content-Type: application/json');

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Crear tabla de favoritos si no existe
$conn->query("CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorito (id_usuario, id_vehiculo),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE
)");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? 'list';
    
    switch ($action) {
        case 'list':
            // Obtener favoritos del usuario con información del vehículo
            $stmt = $conn->prepare("
                SELECT v.*, f.id as favorito_id, f.fecha_agregado 
                FROM favoritos f 
                INNER JOIN vehiculos v ON f.id_vehiculo = v.id 
                WHERE f.id_usuario = ? 
                ORDER BY f.fecha_agregado DESC
            ");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $favoritos = [];
            while ($row = $result->fetch_assoc()) {
                $favoritos[] = $row;
            }
            
            echo json_encode(['success' => true, 'favoritos' => $favoritos]);
            break;
            
        case 'check':
            // Verificar si un vehículo es favorito
            $vehiculo_id = $_GET['vehiculo_id'] ?? 0;
            
            $stmt = $conn->prepare("SELECT id FROM favoritos WHERE id_usuario = ? AND id_vehiculo = ?");
            $stmt->bind_param("ii", $user_id, $vehiculo_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            echo json_encode(['success' => true, 'is_favorito' => $result->num_rows > 0]);
            break;
            
        default:
            echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        $data = $_POST;
    }
    
    $action = $data['action'] ?? '';
    
    switch ($action) {
        case 'add':
            $vehiculo_id = $data['vehiculo_id'] ?? 0;
            
            if (empty($vehiculo_id)) {
                echo json_encode(['success' => false, 'message' => 'ID de vehículo requerido']);
                exit;
            }
            
            // Verificar que el vehículo existe
            $stmt = $conn->prepare("SELECT id FROM vehiculos WHERE id = ?");
            $stmt->bind_param("i", $vehiculo_id);
            $stmt->execute();
            if ($stmt->get_result()->num_rows === 0) {
                echo json_encode(['success' => false, 'message' => 'Vehículo no encontrado']);
                exit;
            }
            
            // Añadir a favoritos
            $stmt = $conn->prepare("INSERT INTO favoritos (id_usuario, id_vehiculo) VALUES (?, ?)");
            $stmt->bind_param("ii", $user_id, $vehiculo_id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Añadido a favoritos']);
            } else {
                // Puede fallar si ya existe (UNIQUE constraint)
                if ($conn->errno === 1062) {
                    echo json_encode(['success' => false, 'message' => 'Ya está en favoritos']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error al añadir a favoritos']);
                }
            }
            break;
            
        case 'remove':
            $vehiculo_id = $data['vehiculo_id'] ?? 0;
            
            $stmt = $conn->prepare("DELETE FROM favoritos WHERE id_usuario = ? AND id_vehiculo = ?");
            $stmt->bind_param("ii", $user_id, $vehiculo_id);
            
            if ($stmt->execute() && $stmt->affected_rows > 0) {
                echo json_encode(['success' => true, 'message' => 'Eliminado de favoritos']);
            } else {
                echo json_encode(['success' => false, 'message' => 'No se pudo eliminar']);
            }
            break;
            
        case 'toggle':
            $vehiculo_id = $data['vehiculo_id'] ?? 0;
            
            // Verificar si ya existe
            $stmt = $conn->prepare("SELECT id FROM favoritos WHERE id_usuario = ? AND id_vehiculo = ?");
            $stmt->bind_param("ii", $user_id, $vehiculo_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                // Eliminar
                $stmt = $conn->prepare("DELETE FROM favoritos WHERE id_usuario = ? AND id_vehiculo = ?");
                $stmt->bind_param("ii", $user_id, $vehiculo_id);
                $stmt->execute();
                echo json_encode(['success' => true, 'action' => 'removed', 'message' => 'Eliminado de favoritos']);
            } else {
                // Añadir
                $stmt = $conn->prepare("INSERT INTO favoritos (id_usuario, id_vehiculo) VALUES (?, ?)");
                $stmt->bind_param("ii", $user_id, $vehiculo_id);
                $stmt->execute();
                echo json_encode(['success' => true, 'action' => 'added', 'message' => 'Añadido a favoritos']);
            }
            break;
            
        default:
            echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}
?>
