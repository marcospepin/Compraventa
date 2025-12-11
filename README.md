# 📦 MANUAL DE INSTALACIÓN - MCR MOTORS

**Guía Completa de Instalación**

**Versión:** 1.0 | **Fecha:** Diciembre 2025

Instalación paso a paso en Windows, Linux y macOS

---

## 📑 Índice de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación en Windows (XAMPP)](#instalación-en-windows-xampp)
4. [Instalación en Linux](#instalación-en-linux)
5. [Instalación en macOS](#instalación-en-macos)
6. [Configuración de Base de Datos](#configuración-de-base-de-datos)
7. [Configuración de la Aplicación](#configuración-de-la-aplicación)
8. [Verificación de la Instalación](#verificación-de-la-instalación)
9. [Solución de Problemas](#solución-de-problemas)
10. [Desinstalación](#desinstalación)

---

## 🎯 Introducción

Este manual proporciona instrucciones detalladas para instalar **MCR Motors**, una plataforma web completa de compraventa de vehículos de alta gama, en cualquier ordenador.

### La aplicación incluye:

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend:** PHP 7.4+
- **Base de Datos:** MySQL 8.0 / MariaDB 10.3+
- **Servidor Web:** Apache 2.4+

### ⏱️ Tiempo Estimado de Instalación

- **Instalación básica:** 30-45 minutos
- **Configuración completa:** 1-2 horas
- **Con personalización:** 2-4 horas

### ¿Qué necesitas para empezar?

- ✅ Un ordenador con Windows, Linux o macOS
- ✅ Conexión a Internet para descargar dependencias
- ✅ Privilegios de administrador en el sistema
- ✅ Al menos 1 GB de espacio libre en disco
- ✅ Este manual (puedes imprimirlo o guardarlo como PDF)

---

## 💻 Requisitos del Sistema

### Hardware Mínimo

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **Procesador** | 1 GHz | 2 GHz o superior |
| **Memoria RAM** | 2 GB | 4 GB o más |
| **Espacio en Disco** | 500 MB | 1 GB o más |
| **Internet** | Necesario para descargas | Banda ancha recomendada |

### Software Requerido

| Componente | Versión Mínima | Versión Recomendada | Propósito |
|------------|----------------|---------------------|-----------|
| **Apache** | 2.4 | 2.4.54+ | Servidor web |
| **PHP** | 7.4 | 8.0+ | Backend |
| **MySQL/MariaDB** | 5.7 / 10.3 | 8.0 / 10.6+ | Base de datos |
| **phpMyAdmin** | 5.0 | 5.2+ | Gestión BD (opcional) |

### Extensiones PHP Necesarias

Las siguientes extensiones son requeridas (XAMPP las incluye por defecto):

- `mysqli` o `pdo_mysql` - Conexión a MySQL
- `json` - Procesamiento de JSON
- `mbstring` - Manejo de cadenas multibyte
- `openssl` - Encriptación de contraseñas
- `gd` - Manipulación de imágenes
- `curl` - Peticiones HTTP (opcional)

### Navegadores Soportados

- ✅ Google Chrome 90+
- ✅ Mozilla Firefox 88+
- ✅ Microsoft Edge 90+
- ✅ Safari 14+
- ✅ Opera 76+

---

## 🪟 Instalación en Windows (XAMPP)

XAMPP es la forma más sencilla de instalar Apache, MySQL y PHP en Windows. Incluye todo lo necesario en un solo paquete.

### Paso 1: Descargar XAMPP

1. Visita: **https://www.apachefriends.org/**
2. Haz clic en **"XAMPP para Windows"**
3. Descarga la versión con **PHP 7.4 o superior**
4. Tamaño aproximado: **150-200 MB**
5. Tiempo de descarga: 5-15 minutos (según velocidad de Internet)

### Paso 2: Instalar XAMPP

1. Localiza el archivo descargado: `xampp-windows-x64-xxx-installer.exe`
2. Haz doble clic para ejecutar
3. Si aparece **Control de Cuentas de Usuario (UAC)**, haz clic en **"Sí"**
4. En la ventana de instalación, selecciona componentes:
   - ✅ **Apache** (obligatorio)
   - ✅ **MySQL** (obligatorio)
   - ✅ **PHP** (obligatorio)
   - ✅ **phpMyAdmin** (recomendado)
   - ⬜ FileZilla (opcional)
   - ⬜ Mercury (opcional)
   - ⬜ Tomcat (opcional)
5. Elige ubicación de instalación:
   - **Recomendado:** `C:\xampp`
   - **Evitar:** Rutas con espacios o caracteres especiales
6. Desmarca **"Learn more about Bitnami"** (opcional)
7. Haz clic en **"Next"** y luego **"Finish"**

> ⚠️ **ADVERTENCIA - Antivirus**
>
> Algunos antivirus pueden bloquear la instalación de XAMPP. Si esto ocurre:
> - Desactiva temporalmente el antivirus
> - Agrega XAMPP a la lista de excepciones
> - Ejecuta el instalador como administrador

### Paso 3: Iniciar XAMPP

1. Busca **"XAMPP Control Panel"** en el menú inicio
2. Ejecútalo como **Administrador** (clic derecho → Ejecutar como administrador)
3. Haz clic en **"Start"** junto a **Apache**
4. Haz clic en **"Start"** junto a **MySQL**
5. Los indicadores deben ponerse en **verde**

> ✅ **Verificación Rápida**
>
> Abre tu navegador y visita: **http://localhost**
>
> Deberías ver la página de bienvenida de XAMPP.

### Paso 4: Descargar el Proyecto MCR Motors

#### Opción A: Con Git (Recomendado)

1. Instala Git desde: **https://git-scm.com/download/win**
2. Abre **Git Bash** (buscar en menú inicio)
3. Navega a la carpeta htdocs:
   ```bash
   cd /c/xampp/htdocs
   ```
4. Clona el repositorio:
   ```bash
   git clone https://github.com/marcospepin/Compraventa.git
   ```
5. Espera a que se descarguen todos los archivos

#### Opción B: Descarga Manual (ZIP)

1. Visita: **https://github.com/marcospepin/Compraventa**
2. Haz clic en el botón verde **"Code"**
3. Selecciona **"Download ZIP"**
4. Guarda el archivo en tu ordenador
5. Extrae el ZIP en `C:\xampp\htdocs\`
6. Renombra la carpeta a `Compraventa` (quita el sufijo -main si lo tiene)

**Ruta final del proyecto:** `C:\xampp\htdocs\Compraventa\`

### Paso 5: Crear la Base de Datos

1. Asegúrate de que Apache y MySQL estén ejecutándose en XAMPP
2. Abre tu navegador
3. Ve a: **http://localhost/phpmyadmin**
4. Haz clic en **"Nueva"** en el menú lateral (o "New")
5. Nombre de la base de datos: `mcrmotors_db`
6. Cotejamiento: `utf8mb4_general_ci`
7. Haz clic en **"Crear"**

### Paso 6: Importar Estructura de la Base de Datos

1. En phpMyAdmin, selecciona la base de datos `mcrmotors_db`
2. Haz clic en la pestaña **"Importar"**
3. Haz clic en **"Seleccionar archivo"** o **"Choose File"**
4. Navega a: `C:\xampp\htdocs\Compraventa\database\mcrmotors_db.sql`
5. Haz clic en **"Continuar"** o **"Go"**
6. Espera el mensaje: **"Importación finalizada correctamente"**

> ✅ **Base de Datos Creada**
>
> La base de datos incluye:
> - 4 tablas (usuarios, vehiculos, imagenes, favoritos)
> - 1 usuario administrador (admin@mcrmotors.com / admin123)
> - 1 usuario cliente de prueba (cliente@test.com / cliente123)
> - 6 vehículos de ejemplo

### Paso 7: Configurar la Aplicación

1. Abre el Explorador de Windows
2. Navega a: `C:\xampp\htdocs\Compraventa\php\`
3. Busca el archivo: `config.example.php`
4. Haz copia del archivo (Ctrl+C, Ctrl+V)
5. Renombra la copia a: `config.php`
6. Abre `config.php` con un editor de texto (Notepad, VS Code, etc.)
7. Verifica que las credenciales sean correctas:

```php
<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Vacío por defecto en XAMPP
define('DB_NAME', 'mcrmotors_db');
?>
```

8. Guarda el archivo

### Paso 8: Acceder a la Aplicación

1. Abre tu navegador web
2. Visita: **http://localhost/Compraventa/**
3. Deberías ver la **página principal de MCR Motors**

> ✅ **¡Instalación Completa!**
>
> MCR Motors está instalado y funcionando en tu ordenador.
>
> **URLs importantes:**
> - Página principal: http://localhost/Compraventa/
> - Panel admin: http://localhost/Compraventa/admin.html
> - phpMyAdmin: http://localhost/phpmyadmin

### Paso 9: Credenciales de Administrador

El script de instalación ya incluye un usuario administrador por defecto:

**Email:** admin@mcrmotors.com  
**Contraseña:** admin123  
**URL:** http://localhost/Compraventa/login.html

> ⚠️ **IMPORTANTE - Seguridad**
>
> Esta contraseña es para pruebas. **DEBES cambiarla inmediatamente** si vas a usar la aplicación en producción.

---

## 🐧 Instalación en Linux

Instrucciones para distribuciones basadas en Debian/Ubuntu. Para otras distribuciones, adapta los comandos según tu gestor de paquetes.

### Paso 1: Actualizar Sistema

```bash
sudo apt update
sudo apt upgrade -y
```

### Paso 2: Instalar LAMP Stack

```bash
# Instalar Apache
sudo apt install apache2 -y

# Instalar MySQL
sudo apt install mysql-server -y

# Instalar PHP y extensiones
sudo apt install php php-mysql php-mbstring php-json php-gd php-curl php-zip -y

# Instalar phpMyAdmin (opcional)
sudo apt install phpmyadmin -y

# Reiniciar Apache
sudo systemctl restart apache2

# Habilitar inicio automático
sudo systemctl enable apache2
sudo systemctl enable mysql
```

### Paso 3: Configurar MySQL

```bash
# Ejecutar script de seguridad
sudo mysql_secure_installation

# Acceder a MySQL
sudo mysql -u root -p
```

Dentro de MySQL:

```sql
-- Crear base de datos
CREATE DATABASE mcrmotors_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Crear usuario (opcional, más seguro)
CREATE USER 'mcrmotors'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON mcrmotors_db.* TO 'mcrmotors'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Paso 4: Descargar el Proyecto

```bash
# Navegar al directorio del servidor
cd /var/www/html

# Clonar repositorio
sudo git clone https://github.com/marcospepin/Compraventa.git

# Asignar permisos
sudo chown -R www-data:www-data Compraventa
sudo chmod -R 755 Compraventa
```

### Paso 5: Importar Base de Datos

```bash
sudo mysql -u root -p mcrmotors_db < /var/www/html/Compraventa/database/mcrmotors_db.sql
```

### Paso 6: Configurar Aplicación

```bash
cd /var/www/html/Compraventa/php
sudo cp config.example.php config.php
sudo nano config.php
```

Editar las credenciales:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'mcrmotors');  // o 'root'
define('DB_PASS', 'tu_contraseña');
define('DB_NAME', 'mcrmotors_db');
```

### Paso 7: Establecer Permisos de Uploads

```bash
sudo chmod -R 755 /var/www/html/Compraventa/uploads
sudo chown -R www-data:www-data /var/www/html/Compraventa/uploads
```

### Paso 8: Acceder a la Aplicación

Visita: **http://localhost/Compraventa/**

---

## 🍎 Instalación en macOS

### Paso 1: Instalar Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Paso 2: Instalar PHP y MySQL

```bash
# Instalar PHP
brew install php

# Instalar MySQL
brew install mysql

# Iniciar MySQL
brew services start mysql
```

### Paso 3: Configurar Servidor Web

**Opción A:** Usar MAMP (más fácil) - https://www.mamp.info/

**Opción B:** Configurar Apache integrado de macOS

```bash
# Iniciar Apache
sudo apachectl start

# Habilitar PHP
sudo nano /etc/apache2/httpd.conf
# Descomentar: LoadModule php_module libexec/apache2/libphp.so

# Reiniciar Apache
sudo apachectl restart
```

### Paso 4: Clonar Proyecto

```bash
cd /Applications/MAMP/htdocs  # Si usas MAMP
# o
cd /Library/WebServer/Documents  # Si usas Apache

sudo git clone https://github.com/marcospepin/Compraventa.git
```

Continuar con los pasos de configuración similares a Linux.

---

## 🗄️ Configuración de Base de Datos

### Archivo de Script SQL

El proyecto incluye el archivo `database/mcrmotors_db.sql` que contiene:

- ✅ Creación de la base de datos
- ✅ 4 tablas relacionales (usuarios, vehiculos, imagenes, favoritos)
- ✅ Índices y claves foráneas
- ✅ Vistas SQL para consultas frecuentes
- ✅ Procedimientos almacenados opcionales
- ✅ Triggers para automatización
- ✅ Usuario administrador
- ✅ 6 vehículos de ejemplo

### Estructura de Tablas

| Tabla | Propósito | Campos Principales |
|-------|-----------|-------------------|
| **usuarios** | Clientes y administradores | id, nombre, email, password, rol |
| **vehiculos** | Inventario de vehículos | id, marca, modelo, precio, estado |
| **imagenes** | Fotos de vehículos | id, id_vehiculo, ruta, orden |
| **favoritos** | Vehículos guardados por usuarios | id, id_usuario, id_vehiculo |

### Verificar Instalación de BD

```sql
-- Conectar a MySQL
mysql -u root -p

-- Seleccionar base de datos
USE mcrmotors_db;

-- Ver tablas
SHOW TABLES;

-- Verificar datos
SELECT COUNT(*) as Total FROM usuarios;
SELECT COUNT(*) as Total FROM vehiculos;
```

---

## ⚙️ Configuración de la Aplicación

### Archivo config.php

**Ubicación:** `php/config.php`

Parámetros configurables:

```php
<?php
// ===================================
// CONFIGURACIÓN DE BASE DE DATOS
// ===================================
define('DB_HOST', 'localhost');      // Host del servidor MySQL
define('DB_USER', 'root');           // Usuario de MySQL
define('DB_PASS', '');               // Contraseña (vacío en XAMPP)
define('DB_NAME', 'mcrmotors_db');   // Nombre de la BD

// ===================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ===================================
define('SITE_URL', 'http://localhost/Compraventa');
define('UPLOAD_PATH', __DIR__ . '/../uploads/vehiculos/');
define('MAX_UPLOAD_SIZE', 5242880);  // 5MB en bytes

// ===================================
// CONFIGURACIÓN DE SESIÓN
// ===================================
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0);  // Cambiar a 1 con HTTPS

// ===================================
// ZONA HORARIA
// ===================================
date_default_timezone_set('Europe/Madrid');

// ===================================
// MODO DESARROLLO (Desactivar en producción)
// ===================================
ini_set('display_errors', 1);
error_reporting(E_ALL);
?>
```

### Permisos de Carpetas

#### Windows:

Generalmente no requiere cambios. La carpeta `uploads/` debe tener permisos de escritura.

#### Linux/macOS:

```bash
# Dar permisos a carpeta uploads
sudo chmod -R 755 uploads/
sudo chown -R www-data:www-data uploads/

# Verificar permisos
ls -la uploads/
```

### Configuración de Email (Opcional)

Para el formulario de contacto, editar `php/send_email.php`:

```php
// Configuración SMTP (ejemplo con Gmail)
$mail->isSMTP();
$mail->Host       = 'smtp.gmail.com';
$mail->SMTPAuth   = true;
$mail->Username   = 'tu_email@gmail.com';
$mail->Password   = 'tu_contraseña_aplicacion';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = 587;
```

---

## ✅ Verificación de la Instalación

### Checklist de Verificación

- [ ] Apache está ejecutándose (verde en XAMPP)
- [ ] MySQL está ejecutándose (verde en XAMPP)
- [ ] La base de datos mcrmotors_db existe
- [ ] Las 4 tablas están creadas
- [ ] Hay usuarios de ejemplo en la BD
- [ ] Hay vehículos de ejemplo en la BD
- [ ] El archivo config.php existe y está configurado
- [ ] La carpeta uploads/ tiene permisos de escritura
- [ ] La página principal carga correctamente
- [ ] Las imágenes se muestran correctamente
- [ ] El formulario de registro funciona
- [ ] El login funciona correctamente
- [ ] Puedo acceder al panel de administración

### Pruebas Funcionales

#### 1. Probar Página Principal

1. Ir a: `http://localhost/Compraventa/`
2. Verificar que carga sin errores
3. Verificar que el menú de navegación funciona

#### 2. Probar Registro de Usuario

1. Ir a: `http://localhost/Compraventa/registro.html`
2. Completar el formulario con datos de prueba
3. Verificar que te redirige al catálogo después de registrarte

#### 3. Probar Login

1. Ir a: `http://localhost/Compraventa/login.html`
2. Email: `admin@mcrmotors.com`
3. Password: `admin123`
4. Verificar que puedes iniciar sesión

#### 4. Probar Panel de Administración

1. Iniciar sesión como administrador
2. Ir a: `http://localhost/Compraventa/admin.html`
3. Intentar crear un vehículo de prueba
4. Subir una imagen
5. Verificar que el vehículo aparece en el catálogo público

### Verificar Logs de Errores

#### Windows (XAMPP):

```
C:\xampp\apache\logs\error.log
C:\xampp\mysql\data\mysql_error.log
```

#### Linux:

```bash
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/mysql/error.log
```

> ✅ **Si todas las pruebas pasan...**
>
> ¡Felicidades! MCR Motors está completamente instalado y funcionando correctamente en tu sistema.

---

## 🔧 Solución de Problemas

### ❌ Apache no inicia

**Síntoma:** Al hacer clic en "Start" en XAMPP, Apache no se inicia o se detiene inmediatamente.

**Causas comunes:**
- Puerto 80 ocupado por otro programa (Skype, IIS, otro servidor)
- Puerto 443 ocupado
- Conflicto con firewall o antivirus

#### Solución 1: Cambiar puerto de Apache

1. En XAMPP Control Panel, clic en "Config" junto a Apache
2. Seleccionar "httpd.conf"
3. Buscar `Listen 80`
4. Cambiar a `Listen 8080`
5. Guardar y reiniciar Apache
6. Acceder con: `http://localhost:8080/Compraventa/`

#### Solución 2: Verificar qué programa usa el puerto 80

```powershell
# Windows PowerShell (como Administrador)
netstat -ano | findstr :80

# Ver proceso
tasklist | findstr [PID]

# Detener IIS si está activo
net stop was /y
```

#### Solución 3: Deshabilitar Skype

1. Abrir Skype
2. Herramientas → Opciones → Avanzado → Conexión
3. Desmarcar "Usar puertos 80 y 443"

### ❌ MySQL no inicia

**Causa común:** Puerto 3306 ocupado o servicio MySQL ya instalado.

#### Solución 1: Detener servicio MySQL de Windows

```powershell
# PowerShell como Administrador
net stop MySQL80
# o
net stop MySQL
```

#### Solución 2: Cambiar puerto MySQL

1. XAMPP Control Panel → Config (MySQL) → my.ini
2. Buscar `port=3306`
3. Cambiar a `port=3307`
4. Guardar y reiniciar
5. Actualizar config.php: `define('DB_HOST', 'localhost:3307');`

### ❌ Error "Access Denied" en MySQL

**Síntoma:** No puedes conectarte a MySQL o importar la base de datos.

**Solución:**

```bash
# En XAMPP, root NO tiene contraseña por defecto
mysql -u root
# (sin -p)
```

Si configuraste contraseña y la olvidaste:

1. Detener MySQL en XAMPP
2. Editar my.ini y añadir bajo [mysqld]:
   ```
   skip-grant-tables
   ```
3. Iniciar MySQL
4. Conectar y cambiar contraseña:
   ```sql
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_contraseña';
   FLUSH PRIVILEGES;
   ```
5. Quitar skip-grant-tables y reiniciar

### ❌ Página en blanco

**Síntoma:** Al acceder a la aplicación, solo ves una página blanca.

**Causas:** Error de PHP no mostrado.

**Solución:**

1. Abrir `php/config.php`
2. Añadir al inicio:
   ```php
   ini_set('display_errors', 1);
   error_reporting(E_ALL);
   ```
3. Recargar la página para ver el error
4. Revisar logs de Apache

### ❌ Las imágenes no se suben

**Síntoma:** Al intentar subir imágenes en el panel admin, falla.

#### Solución 1: Verificar permisos (Linux/macOS)

```bash
sudo chmod -R 755 uploads/vehiculos/
sudo chown -R www-data:www-data uploads/
```

#### Solución 2: Aumentar tamaño máximo de subida

1. Editar `php.ini` (en XAMPP: Config → PHP → php.ini)
2. Buscar y modificar:
   ```ini
   upload_max_filesize = 10M
   post_max_size = 10M
   max_execution_time = 300
   ```
3. Guardar y reiniciar Apache

#### Solución 3: Verificar que la carpeta existe

```bash
# Windows
mkdir C:\xampp\htdocs\Compraventa\uploads\vehiculos

# Linux/macOS
mkdir -p uploads/vehiculos
```

### ❌ Sesiones no funcionan

**Síntoma:** No puedes iniciar sesión o la sesión se pierde inmediatamente.

**Solución (Linux):**

```bash
# Verificar carpeta de sesiones
ls -la /var/lib/php/sessions

# Crear si no existe
sudo mkdir -p /var/lib/php/sessions
sudo chmod 1733 /var/lib/php/sessions
```

**Solución (Windows):** Generalmente no hay problema. Verificar en php.ini que:

```ini
session.save_path = "C:\xampp\tmp"
```

### ❌ Error 404 - Página no encontrada

**Causa:** Ruta incorrecta o mod_rewrite deshabilitado.

**Solución:**

1. Verificar que accedes a la URL correcta:
   - ✅ `http://localhost/Compraventa/`
   - ❌ `http://localhost/compraventa/` (minúsculas)
2. Verificar que la carpeta está en htdocs
3. Verificar que el archivo index.html existe

### 🆘 Más Ayuda

Si ninguna solución funciona:

- 📧 Email: info@mcrmotors.com
- 📱 Teléfono: 617 700 519
- 🐛 GitHub Issues: https://github.com/marcospepin/Compraventa/issues
- 📖 Documentación completa: http://localhost/Compraventa/documentacion.html

---

## 🗑️ Desinstalación

> ⚠️ **Advertencia**
>
> La desinstalación eliminará todos los datos, incluyendo vehículos, usuarios e imágenes. Asegúrate de hacer un respaldo antes.

### Crear Respaldo Antes de Desinstalar

```bash
# Respaldar base de datos
mysqldump -u root -p mcrmotors_db > backup_mcrmotors.sql

# Respaldar archivos
# Windows: Copiar carpeta C:\xampp\htdocs\Compraventa a otro lugar
# Linux: 
tar -czf backup_compraventa.tar.gz /var/www/html/Compraventa
```

### Windows - Desinstalar XAMPP

1. Abrir XAMPP Control Panel
2. Detener Apache y MySQL (clic en "Stop")
3. Cerrar XAMPP Control Panel
4. Ir a: Panel de Control → Programas → Desinstalar un programa
5. Buscar "XAMPP" y hacer clic en "Desinstalar"
6. Seguir el asistente de desinstalación
7. Eliminar manualmente la carpeta `C:\xampp` si queda algo

### Linux - Desinstalar LAMP

```bash
# Eliminar archivos del proyecto
sudo rm -rf /var/www/html/Compraventa

# Eliminar base de datos
sudo mysql -u root -p
DROP DATABASE mcrmotors_db;
DROP USER IF EXISTS 'mcrmotors'@'localhost';
EXIT;

# Desinstalar paquetes (opcional)
sudo apt remove --purge apache2 mysql-server php -y
sudo apt autoremove -y
```

### macOS - Desinstalar

```bash
# Si usaste Homebrew
brew services stop mysql
brew uninstall mysql php

# Si usaste MAMP
# Arrastrar MAMP a la Papelera desde Aplicaciones
```

### Eliminar Solo el Proyecto (Mantener XAMPP)

#### Windows:

1. Eliminar carpeta: `C:\xampp\htdocs\Compraventa`
2. En phpMyAdmin, eliminar base de datos `mcrmotors_db`

#### Linux:

```bash
sudo rm -rf /var/www/html/Compraventa
sudo mysql -u root -p -e "DROP DATABASE mcrmotors_db;"
```

---

## 📞 Contacto y Soporte

**MCR MOTORS** - Manual de Instalación Completo

- 📧 **Email:** info@mcrmotors.com
- 📱 **Teléfono:** 617 700 519
- 📍 **Ubicación:** San Ciprián de Viñas, Galicia, España
- 🐙 **GitHub:** https://github.com/marcospepin/Compraventa

---

**Manual Versión 1.0 | Diciembre 2025**

© 2025 MCR Motors. Todos los derechos reservados.

*Desarrollado por Marcos Pepín | Proyecto Final DAW*
