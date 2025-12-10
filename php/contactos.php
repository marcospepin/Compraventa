<?php
require_once 'config.php';

// Configurar headers
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar autenticación
if (!isset($_SESSION['user_id']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    if ($method === 'GET' && $action === 'list') {
        // Obtener todos los contactos
        $sql = "SELECT * FROM contactos ORDER BY fecha_envio DESC";
        $result = $conn->query($sql);
        
        $contactos = [];
        while ($row = $result->fetch_assoc()) {
            $contactos[] = $row;
        }
        
        echo json_encode(['success' => true, 'contactos' => $contactos]);
        
    } elseif ($method === 'GET' && $action === 'get' && isset($_GET['id'])) {
        // Obtener un contacto específico
        $id = intval($_GET['id']);
        $sql = "SELECT * FROM contactos WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($contacto = $result->fetch_assoc()) {
            // Marcar como leído
            $update_sql = "UPDATE contactos SET leido = 1 WHERE id = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param("i", $id);
            $update_stmt->execute();
            
            echo json_encode(['success' => true, 'contacto' => $contacto]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Contacto no encontrado']);
        }
        
    } elseif ($method === 'DELETE' && isset($_GET['id'])) {
        // Eliminar contacto
        $id = intval($_GET['id']);
        $sql = "DELETE FROM contactos WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Contacto eliminado']);
        } else {
            throw new Exception('Error al eliminar el contacto');
        }
        
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
