<?php
require_once 'config.php';

// Configurar headers
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Función para obtener vehículos con filtros
function getVehiculos($filtros = []) {
    global $conn;
    
    // Manejo del estado
    $where = [];
    if (!empty($filtros['estado'])) {
        // Si se especifica un estado concreto, filtrar por ese estado
        $where[] = "estado = ?";
        $params[] = $filtros['estado'];
        $types = "s";
    } elseif (empty($filtros['all_status'])) {
        // Si no se especifica estado ni all_status, solo mostrar disponibles
        $where[] = "estado = 'disponible'";
        $params = [];
        $types = "";
    } else {
        $params = [];
        $types = "";
    }
    
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
    
    if (!empty($filtros['potencia'])) {
        // Parse potencia range (e.g., "100-150" or "500+")
        $potencia = $filtros['potencia'];
        if (strpos($potencia, '+') !== false) {
            // 500+
            $min_potencia = intval($potencia);
            $where[] = "potencia >= ?";
            $params[] = $min_potencia;
            $types .= "i";
        } elseif (strpos($potencia, '-') !== false) {
            // 100-150
            list($min_potencia, $max_potencia) = explode('-', $potencia);
            $where[] = "potencia >= ? AND potencia <= ?";
            $params[] = intval($min_potencia);
            $params[] = intval($max_potencia);
            $types .= "ii";
        }
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
    
    $sql = "SELECT * FROM vehiculos";
    if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }
    
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
                'potencia' => $_GET['potencia'] ?? '',
                'tipo' => $_GET['tipo'] ?? '',
                'combustible' => $_GET['combustible'] ?? '',
                'order' => $_GET['order'] ?? 'fecha_registro DESC',
                'all_status' => $_GET['all_status'] ?? ''
            ];
            
            $vehiculos = getVehiculos($filtros);
            echo json_encode(['success' => true, 'vehiculos' => $vehiculos, 'total' => count($vehiculos)]);
            break;
            
        case 'get_all':
            $filtros = [
                'estado' => $_GET['estado'] ?? '',
                'marca' => $_GET['marca'] ?? '',
                'modelo' => $_GET['modelo'] ?? '',
                'order' => $_GET['order'] ?? 'fecha_registro DESC'
            ];
            
            $vehiculos = getVehiculos($filtros);
            echo json_encode($vehiculos);
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

        case 'get_images':
            $vehiculo_id = $_GET['vehiculo_id'] ?? 0;
            $stmt = $conn->prepare("SELECT imagen_url FROM vehiculo_imagenes WHERE vehiculo_id = ? ORDER BY orden");
            $stmt->bind_param("i", $vehiculo_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $imagenes = [];
            while ($row = $result->fetch_assoc()) {
                $imagenes[] = $row['imagen_url'];
            }
            echo json_encode(['success' => true, 'imagenes' => $imagenes]);
            break;

        case 'populares':
            $limit = $_GET['limit'] ?? 3;
            $sql = "SELECT v.* 
                    FROM vehiculos v 
                    WHERE v.estado = 'disponible' 
                    ORDER BY v.precio DESC, v.fecha_registro DESC 
                    LIMIT ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $limit);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $vehiculos = [];
            while ($row = $result->fetch_assoc()) {
                $vehiculos[] = $row;
            }
            echo json_encode($vehiculos);
            break;

        default:
            echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}// Manejar solicitudes POST (solo para admin)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Verificar que el usuario esté autenticado y sea admin
        if (!isset($_SESSION['user_id']) || $_SESSION['user_rol'] !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            exit;
        }
        
        // Obtener la acción desde POST o desde JSON
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            $data = $_POST;
        }
        
        $action = $_POST['action'] ?? ($data['action'] ?? '');
        
        switch ($action) {
        case 'add':
            // Validar que hay imágenes
            if (!isset($_FILES['imagenes']) || empty($_FILES['imagenes']['name'][0])) {
                echo json_encode(['success' => false, 'message' => 'Debes subir al menos una imagen']);
                exit;
            }

            // Validar número máximo de imágenes
            if (count($_FILES['imagenes']['name']) > 7) {
                echo json_encode(['success' => false, 'message' => 'Máximo 7 imágenes permitidas']);
                exit;
            }

            // Insertar vehículo
            $stmt = $conn->prepare("INSERT INTO vehiculos (marca, modelo, anio, tipo, precio, kilometraje, potencia, combustible, transmision, descripcion, imagen_url, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            // Preparar variables para bind_param (no se pueden usar expresiones)
            $marca = $_POST['marca'];
            $modelo = $_POST['modelo'];
            $anio = $_POST['anio'];
            $tipo = $_POST['tipo'];
            $precio = $_POST['precio'];
            $kilometraje = $_POST['kilometraje'];
            $potencia = $_POST['potencia'];
            $combustible = $_POST['combustible'];
            $transmision = $_POST['transmision'];
            $descripcion = $_POST['descripcion'];
            $primera_imagen = null;
            $id_usuario = $_SESSION['user_id'] ?? 0;
            
            $stmt->bind_param("ssississsssi", 
                $marca,
                $modelo,
                $anio,
                $tipo,
                $precio,
                $kilometraje,
                $potencia,
                $combustible,
                $transmision,
                $descripcion,
                $primera_imagen,
                $id_usuario
            );
            
            if ($stmt->execute()) {
                $vehiculo_id = $conn->insert_id;
                $uploadDir = __DIR__ . '/../uploads/vehiculos/';
                
                // Crear directorio si no existe
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                $imagenesCargadas = [];
                
                // Procesar cada imagen subida
                for ($i = 0; $i < count($_FILES['imagenes']['name']); $i++) {
                    if ($_FILES['imagenes']['error'][$i] === UPLOAD_ERR_OK) {
                        $tmpName = $_FILES['imagenes']['tmp_name'][$i];
                        $fileName = $_FILES['imagenes']['name'][$i];
                        
                        // Validar que es una imagen
                        $finfo = finfo_open(FILEINFO_MIME_TYPE);
                        $mimeType = finfo_file($finfo, $tmpName);
                        finfo_close($finfo);
                        
                        if (strpos($mimeType, 'image') === false) {
                            continue;
                        }
                        
                        // Generar nombre único
                        $ext = pathinfo($fileName, PATHINFO_EXTENSION);
                        $newFileName = "vehiculo_" . $vehiculo_id . "_" . time() . "_" . rand(1000, 9999) . "." . $ext;
                        $uploadPath = $uploadDir . $newFileName;
                        
                        // Mover archivo
                        if (move_uploaded_file($tmpName, $uploadPath)) {
                            $imagenUrl = "uploads/vehiculos/" . $newFileName;
                            $imagenesCargadas[] = $imagenUrl;
                            
                            // Si es la primera imagen, actualizar la imagen_url principal
                            if ($i === 0) {
                                $updateStmt = $conn->prepare("UPDATE vehiculos SET imagen_url = ? WHERE id = ?");
                                $updateStmt->bind_param("si", $imagenUrl, $vehiculo_id);
                                $updateStmt->execute();
                                $updateStmt->close();
                            }
                            
                            // Intentar insertar en tabla de imágenes (si existe)
                            $checkTableSql = "SHOW TABLES LIKE 'vehiculo_imagenes'";
                            $tableCheck = $conn->query($checkTableSql);
                            
                            if ($tableCheck && $tableCheck->num_rows > 0) {
                                $imgStmt = $conn->prepare("INSERT INTO vehiculo_imagenes (vehiculo_id, imagen_url, orden) VALUES (?, ?, ?)");
                                if ($imgStmt) {
                                    $orden = $i;
                                    $imgStmt->bind_param("isi", $vehiculo_id, $imagenUrl, $orden);
                                    $imgStmt->execute();
                                    $imgStmt->close();
                                }
                            }
                        }
                    }
                }
                
                if (!empty($imagenesCargadas)) {
                    echo json_encode(['success' => true, 'message' => 'Vehículo añadido con ' . count($imagenesCargadas) . ' imagen(es)', 'id' => $vehiculo_id]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error al guardar las imágenes']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al añadir vehículo: ' . $stmt->error]);
            }
            break;
            
        case 'update':
            $id = $data['id'] ?? 0;
            $stmt = $conn->prepare("UPDATE vehiculos SET marca=?, modelo=?, anio=?, tipo=?, precio=?, kilometraje=?, potencia=?, combustible=?, transmision=?, descripcion=?, imagen_url=?, estado=? WHERE id=?");
            $stmt->bind_param("ssississssssi",
                $data['marca'],
                $data['modelo'],
                $data['anio'],
                $data['tipo'],
                $data['precio'],
                $data['kilometraje'],
                $data['potencia'],
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
            
        case 'update_estado':
            $id = $data['id'] ?? 0;
            $estado = $data['estado'] ?? '';
            
            // Validar estado
            $estados_validos = ['disponible', 'reservado', 'vendido'];
            if (!in_array($estado, $estados_validos)) {
                echo json_encode(['success' => false, 'message' => 'Estado no válido']);
                break;
            }
            
            $stmt = $conn->prepare("UPDATE vehiculos SET estado = ? WHERE id = ?");
            $stmt->bind_param("si", $estado, $id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Estado actualizado']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar estado']);
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
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
    exit;
}
?>
