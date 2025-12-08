<?php
require_once 'config.php';

header('Content-Type: application/json');

// Función para obtener vehículos con filtros
function getVehiculos($filtros = []) {
    global $conn;
    
    $where = ["estado = 'disponible'"];
    $params = [];
    $types = "";
    
    if (!empty($filtros['marca'])) {
        $where[] = "LOWER(marca) = LOWER(?)";
        $params[] = $filtros['marca'];
        $types .= "s";
    }
    
    if (!empty($filtros['modelo'])) {
        $where[] = "LOWER(modelo) LIKE LOWER(?)";
        $params[] = "%" . $filtros['modelo'] . "%";
        $types .= "s";
    }
    
    if (!empty($filtros['precio_min'])) {
        $where[] = "precio >= ?";
        $params[] = $filtros['precio_min'];
        $types .= "d";
    }
    
    if (!empty($filtros['precio_max'])) {
        $where[] = "precio <= ?";
        $params[] = $filtros['precio_max'];
        $types .= "d";
    }
    
    if (!empty($filtros['anio'])) {
        $where[] = "anio = ?";
        $params[] = $filtros['anio'];
        $types .= "i";
    }
    
    if (!empty($filtros['tipo'])) {
        $where[] = "tipo = ?";
        $params[] = $filtros['tipo'];
        $types .= "s";
    }
    
    if (!empty($filtros['combustible'])) {
        $where[] = "combustible = ?";
        $params[] = $filtros['combustible'];
        $types .= "s";
    }
    
    $sql = "SELECT * FROM vehiculos WHERE " . implode(" AND ", $where);
    
    // Ordenamiento
    $order = $filtros['order'] ?? 'fecha_registro DESC';
    $sql .= " ORDER BY " . $order;
    
    $stmt = $conn->prepare($sql);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $vehiculos = [];
    while ($row = $result->fetch_assoc()) {
        $vehiculos[] = $row;
    }
    
    return $vehiculos;
}

// Manejar solicitudes GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? 'list';
    
    switch ($action) {
        case 'list':
            $filtros = [
                'marca' => $_GET['marca'] ?? '',
                'modelo' => $_GET['modelo'] ?? '',
                'precio_min' => $_GET['precio_min'] ?? '',
                'precio_max' => $_GET['precio_max'] ?? '',
                'anio' => $_GET['anio'] ?? '',
                'tipo' => $_GET['tipo'] ?? '',
                'combustible' => $_GET['combustible'] ?? '',
                'order' => $_GET['order'] ?? 'fecha_registro DESC'
            ];
            
            $vehiculos = getVehiculos($filtros);
            echo json_encode(['success' => true, 'vehiculos' => $vehiculos, 'total' => count($vehiculos)]);
            break;
            
        case 'get':
            $id = $_GET['id'] ?? 0;
            
            $stmt = $conn->prepare("SELECT * FROM vehiculos WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                echo json_encode(['success' => true, 'vehiculo' => $result->fetch_assoc()]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Vehículo no encontrado']);
            }
            break;
            
        case 'marcas':
            $result = $conn->query("SELECT DISTINCT marca FROM vehiculos WHERE estado = 'disponible' ORDER BY marca");
            $marcas = [];
            while ($row = $result->fetch_assoc()) {
                $marcas[] = $row['marca'];
            }
            echo json_encode(['success' => true, 'marcas' => $marcas]);
            break;

        case 'populares':
            $limit = $_GET['limit'] ?? 3;
            $sql = "SELECT v.*, COUNT(f.id) as num_favoritos 
                    FROM vehiculos v 
                    LEFT JOIN favoritos f ON v.id = f.vehiculo_id 
                    WHERE v.estado = 'disponible' 
                    GROUP BY v.id 
                    ORDER BY num_favoritos DESC, v.fecha_registro DESC 
                    LIMIT ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $limit);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $vehiculos = [];
            while ($row = $result->fetch_assoc()) {
                $vehiculos[] = $row;
            }
            echo json_encode(['success' => true, 'vehiculos' => $vehiculos]);
            break;

        default:
            echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}// Manejar solicitudes POST (solo para admin)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar que el usuario esté autenticado y sea admin
    if (!isset($_SESSION['user_id']) || $_SESSION['user_rol'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'No autorizado']);
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        $data = $_POST;
    }
    
    $action = $data['action'] ?? '';
    
    switch ($action) {
        case 'add':
            $stmt = $conn->prepare("INSERT INTO vehiculos (marca, modelo, anio, tipo, precio, kilometraje, color, combustible, transmision, descripcion, imagen_url, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssississsssi", 
                $data['marca'],
                $data['modelo'],
                $data['anio'],
                $data['tipo'],
                $data['precio'],
                $data['kilometraje'],
                $data['color'],
                $data['combustible'],
                $data['transmision'],
                $data['descripcion'],
                $data['imagen_url'],
                $_SESSION['user_id']
            );
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Vehículo añadido', 'id' => $conn->insert_id]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al añadir vehículo']);
            }
            break;
            
        case 'update':
            $id = $data['id'] ?? 0;
            $stmt = $conn->prepare("UPDATE vehiculos SET marca=?, modelo=?, anio=?, tipo=?, precio=?, kilometraje=?, color=?, combustible=?, transmision=?, descripcion=?, imagen_url=?, estado=? WHERE id=?");
            $stmt->bind_param("ssississssssi",
                $data['marca'],
                $data['modelo'],
                $data['anio'],
                $data['tipo'],
                $data['precio'],
                $data['kilometraje'],
                $data['color'],
                $data['combustible'],
                $data['transmision'],
                $data['descripcion'],
                $data['imagen_url'],
                $data['estado'],
                $id
            );
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Vehículo actualizado']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar vehículo']);
            }
            break;
            
        case 'delete':
            $id = $data['id'] ?? 0;
            $stmt = $conn->prepare("DELETE FROM vehiculos WHERE id = ?");
            $stmt->bind_param("i", $id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Vehículo eliminado']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al eliminar vehículo']);
            }
            break;
            
        default:
            echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}
?>
