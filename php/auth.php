<?php
require_once 'config.php';

header('Content-Type: application/json');

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return isset($_SESSION['user_id']);
}

// Función para obtener el usuario actual
function getCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }
    
    global $conn;
    $user_id = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT id, nombre, email, rol FROM usuarios WHERE id = ? AND activo = TRUE");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    
    return null;
}

// Manejar solicitudes GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'check_session':
                echo json_encode([
                    'authenticated' => isAuthenticated(),
                    'user' => getCurrentUser()
                ]);
                break;
                
            case 'logout':
                session_destroy();
                echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
                break;
                
            default:
                echo json_encode(['error' => 'Acción no válida']);
        }
    }
    exit;
}

// Manejar solicitudes POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        $data = $_POST;
    }
    
    $action = $data['action'] ?? '';
    
    switch ($action) {
        case 'login':
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';
            
            if (empty($email) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Email y contraseña son requeridos']);
                exit;
            }
            
            $stmt = $conn->prepare("SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ? AND activo = TRUE");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                
                if (password_verify($password, $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['user_name'] = $user['nombre'];
                    $_SESSION['user_email'] = $user['email'];
                    $_SESSION['user_rol'] = $user['rol'];
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Inicio de sesión exitoso',
                        'user' => [
                            'id' => $user['id'],
                            'nombre' => $user['nombre'],
                            'email' => $user['email'],
                            'rol' => $user['rol']
                        ]
                    ]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
            }
            break;
            
        case 'register':
            $nombre = $data['nombre'] ?? '';
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';
            $telefono = $data['telefono'] ?? null;

            if (empty($nombre) || empty($email) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Nombre, email y contraseña son requeridos']);
                exit;
            }

            // Verificar si el email ya existe
            $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
                exit;
            }

            // Hashear la contraseña
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            // Insertar usuario (sin campo dirección)
            $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, ?, ?, 'usuario')");
            $stmt->bind_param("ssss", $nombre, $email, $hashed_password, $telefono);            if ($stmt->execute()) {
                $user_id = $conn->insert_id;
                
                $_SESSION['user_id'] = $user_id;
                $_SESSION['user_name'] = $nombre;
                $_SESSION['user_email'] = $email;
                $_SESSION['user_rol'] = 'usuario';
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Registro exitoso',
                    'user' => [
                        'id' => $user_id,
                        'nombre' => $nombre,
                        'email' => $email,
                        'rol' => 'usuario'
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al registrar usuario']);
            }
            break;
            
        default:
            echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}
?>
