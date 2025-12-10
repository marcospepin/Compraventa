<?php
// Configuración de sesiones ANTES de hacer cualquier otra cosa
// IMPORTANTE: Esto DEBE estar antes de cualquier output
if (session_status() === PHP_SESSION_NONE) {
    // Configurar opciones de sesión
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.use_strict_mode', 0);
    ini_set('session.use_only_cookies', 1);
    
    session_start();
}

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'compraventa_db');

// Crear conexión
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer charset UTF-8
$conn->set_charset("utf8mb4");

// Configuración SMTP para envío de correos
define('SMTP_HOST', 'xcp001.www-apps.net');
define('SMTP_PORT', 465);
define('SMTP_SECURE', 'ssl'); // Cambiado a string simple
define('SMTP_USERNAME', 'mcrtest@marcosg.gianhostnetworks.com');
define('SMTP_PASSWORD', '{#wA4=t@[aiN');
define('SMTP_FROM_EMAIL', 'mcrtest@marcosg.gianhostnetworks.com');
define('SMTP_FROM_NAME', 'MCR Motors');
define('SMTP_TO_EMAIL', 'marcosksgomez@gmail.com'); // Email donde se recibirán los mensajes de contacto
?>
