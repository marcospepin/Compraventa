<?php
require_once 'config.php';

// Cargar el autoloader de Composer
require_once __DIR__ . '/../vendor/autoload.php';

// Importar PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener y validar los datos del formulario
    $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
    $asunto = isset($_POST['asunto']) ? trim($_POST['asunto']) : '';
    $mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';
    
    // Validaciones básicas
    if (empty($nombre) || empty($email) || empty($asunto) || empty($mensaje)) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor completa todos los campos obligatorios.'
        ]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor ingresa un email válido.'
        ]);
        exit;
    }
    
    try {
        $mail = new PHPMailer(true);
        
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';
        
        // Remitente y destinatario
        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress(SMTP_TO_EMAIL); // Correo destino
        $mail->addReplyTo($email, $nombre); // Responder al cliente
        
        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = 'Nuevo mensaje de contacto: ' . $asunto;
        
        // Cuerpo del mensaje en HTML
        $mail->Body = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; }
                .field { margin-bottom: 15px; }
                .field strong { color: #007bff; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Nuevo Mensaje de Contacto - MCR Motors</h2>
                </div>
                <div class="content">
                    <div class="field">
                        <strong>Nombre:</strong><br>
                        ' . htmlspecialchars($nombre) . '
                    </div>
                    <div class="field">
                        <strong>Email:</strong><br>
                        ' . htmlspecialchars($email) . '
                    </div>
                    <div class="field">
                        <strong>Teléfono:</strong><br>
                        ' . htmlspecialchars($telefono ? $telefono : 'No proporcionado') . '
                    </div>
                    <div class="field">
                        <strong>Asunto:</strong><br>
                        ' . htmlspecialchars($asunto) . '
                    </div>
                    <div class="field">
                        <strong>Mensaje:</strong><br>
                        ' . nl2br(htmlspecialchars($mensaje)) . '
                    </div>
                </div>
                <div class="footer">
                    <p>Este mensaje fue enviado desde el formulario de contacto de MCR Motors</p>
                    <p>Fecha: ' . date('d/m/Y H:i:s') . '</p>
                </div>
            </div>
        </body>
        </html>
        ';
        
        // Alternativa en texto plano
        $mail->AltBody = "Nuevo mensaje de contacto\n\n" .
                        "Nombre: $nombre\n" .
                        "Email: $email\n" .
                        "Teléfono: " . ($telefono ? $telefono : 'No proporcionado') . "\n" .
                        "Asunto: $asunto\n\n" .
                        "Mensaje:\n$mensaje\n\n" .
                        "Fecha: " . date('d/m/Y H:i:s');
        
        // Enviar el correo
        $mail->send();
        
        echo json_encode([
            'success' => true,
            'message' => '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar el mensaje. Por favor intenta más tarde.'
        ]);
        
        // Log del error (opcional, para debugging)
        error_log('Error al enviar email: ' . $mail->ErrorInfo);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método de solicitud no permitido.'
    ]);
}
?>
