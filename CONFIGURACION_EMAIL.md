# Configuración del Sistema de Envío de Correos

## Instalación de PHPMailer

Para que el sistema de contacto funcione correctamente, necesitas instalar PHPMailer. Hay dos formas de hacerlo:

### Opción 1: Usando Composer (Recomendado)

1. Abre una terminal en la carpeta raíz del proyecto (`c:\xampp\htdocs\Compraventa`)
2. Ejecuta el siguiente comando:
```bash
composer require phpmailer/phpmailer
```

### Opción 2: Instalación Manual

1. Descarga PHPMailer desde: https://github.com/PHPMailer/PHPMailer/archive/master.zip
2. Extrae el archivo ZIP
3. Copia la carpeta `src` de PHPMailer a `vendor/PHPMailer/src/`

## Configuración de Gmail para SMTP

Para enviar correos usando Gmail, necesitas crear una "Contraseña de aplicación":

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú izquierdo, haz clic en "Seguridad"
3. En la sección "Cómo iniciar sesión en Google", habilita la "Verificación en dos pasos" (si no está habilitada)
4. Una vez habilitada, busca "Contraseñas de aplicaciones"
5. Selecciona "Correo" y "Windows Computer" (o el dispositivo correspondiente)
6. Google generará una contraseña de 16 caracteres
7. Copia esta contraseña y pégala en el archivo `php/config.php` en la línea:
   ```php
   define('SMTP_PASSWORD', 'tu-contraseña-de-aplicación-aquí');
   ```

## Configuración del archivo config.php

El archivo `php/config.php` ya está configurado con los siguientes parámetros:

```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_SECURE', PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS);
define('SMTP_USERNAME', 'marcosksgomez@gmail.com');
define('SMTP_PASSWORD', ''); // IMPORTANTE: Pon tu contraseña de aplicación aquí
define('SMTP_FROM_EMAIL', 'marcosksgomez@gmail.com');
define('SMTP_FROM_NAME', 'MCR Motors');
define('SMTP_TO_EMAIL', 'marcosksgomez@gmail.com');
```

**IMPORTANTE:** Solo necesitas actualizar la línea `SMTP_PASSWORD` con la contraseña de aplicación que generaste.

## Otros Proveedores SMTP

Si prefieres usar otro proveedor en lugar de Gmail, aquí están las configuraciones:

### Outlook/Hotmail
```php
define('SMTP_HOST', 'smtp-mail.outlook.com');
define('SMTP_PORT', 587);
define('SMTP_SECURE', PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS);
```

### Yahoo
```php
define('SMTP_HOST', 'smtp.mail.yahoo.com');
define('SMTP_PORT', 587);
define('SMTP_SECURE', PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS);
```

### SMTP Genérico
```php
define('SMTP_HOST', 'tu-servidor-smtp.com');
define('SMTP_PORT', 587); // o 465 para SSL
define('SMTP_SECURE', PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS);
```

## Prueba del Sistema

1. Asegúrate de que XAMPP esté ejecutándose
2. Abre el navegador y ve a: http://localhost/Compraventa/contacto.html
3. Completa el formulario de contacto
4. Haz clic en "Enviar Mensaje"
5. Deberías recibir un correo en marcosksgomez@gmail.com

## Solución de Problemas

### Error: "Class 'PHPMailer\PHPMailer\PHPMailer' not found"
- PHPMailer no está instalado correctamente
- Solución: Instala PHPMailer usando Composer o manualmente

### Error: "SMTP Error: Could not authenticate"
- La contraseña de aplicación es incorrecta
- Solución: Genera una nueva contraseña de aplicación en tu cuenta de Google

### Error: "SMTP connect() failed"
- El servidor SMTP no es accesible
- Solución: Verifica que tu firewall no esté bloqueando el puerto 587

### El correo no llega
- Revisa la carpeta de spam
- Verifica que el correo de destino (`SMTP_TO_EMAIL`) sea correcto
- Revisa los logs de PHP para errores

## Archivos Creados/Modificados

- **php/send_email.php**: Procesa el formulario y envía el correo
- **php/config.php**: Configuración SMTP actualizada
- **contacto.html**: JavaScript actualizado para enviar a send_email.php
- **vendor/PHPMailer/**: Librería PHPMailer (debes instalarla)

## Seguridad

⚠️ **IMPORTANTE:** 
- Nunca subas el archivo `config.php` con tu contraseña a un repositorio público
- Añade `config.php` a tu `.gitignore`
- Usa variables de entorno para las contraseñas en producción
