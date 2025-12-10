# MANUAIS DO PROXECTO - MCR MOTORS

## 1. Manual de Instalación

### 1.1. Requisitos Previos

#### Hardware Mínimo:
- Procesador: 1 GHz ou superior
- RAM: 2 GB mínimo
- Espazo en disco: 500 MB dispoñibles
- Conexión a Internet

#### Software Necesario:
- **Servidor Web:** Apache 2.4 ou superior
- **PHP:** Versión 7.4 ou superior
- **Base de Datos:** MySQL 5.7+ ou MariaDB 10.3+
- **Navegador Web:** Chrome, Firefox, Edge ou Safari (última versión)

### 1.2. Instalación en Entorno Local (Desenvolvemento)

#### Paso 1: Instalar XAMPP

1. Descargar XAMPP desde https://www.apachefriends.org/
2. Executar o instalador
3. Seleccionar compoñentes: Apache, MySQL, PHP, phpMyAdmin
4. Completar a instalación

#### Paso 2: Descargar o Código Fonte

**Opción A: Clonar desde GitHub**
```bash
cd C:\xampp\htdocs
git clone https://github.com/marcospepin/Compraventa.git
```

**Opción B: Descargar ZIP**
1. Ir a https://github.com/marcospepin/Compraventa
2. Clic en "Code" → "Download ZIP"
3. Extraer en `C:\xampp\htdocs\`

#### Paso 3: Crear a Base de Datos

1. Iniciar XAMPP Control Panel
2. Iniciar servizos Apache e MySQL
3. Abrir navegador e ir a: `http://localhost/phpmyadmin`
4. Clic en "Nova" para crear base de datos
5. Nome: `mcrmotors_db`
6. Cotexación: `utf8mb4_general_ci`
7. Clic en "Crear"

#### Paso 4: Importar a Estrutura da Base de Datos

1. Seleccionar a base de datos `mcrmotors_db`
2. Clic na pestana "Importar"
3. Clic en "Escoller arquivo"
4. Seleccionar `database/mcrmotors_db.sql` do proxecto
5. Clic en "Executar"

**Alternativa: Crear manualmente**

```sql
-- Táboa usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Táboa vehiculos
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    version VARCHAR(100),
    ano INT NOT NULL,
    km INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    combustible VARCHAR(20) NOT NULL,
    transmision VARCHAR(20) NOT NULL,
    potencia INT,
    descripcion TEXT NOT NULL,
    caracteristicas TEXT,
    estado ENUM('venta', 'vendido') DEFAULT 'venta',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Táboa imagenes
CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_vehiculo INT NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    orden INT DEFAULT 0,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- Táboa favoritos
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (id_usuario, id_vehiculo)
);

-- Crear usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol) 
VALUES ('Administrador', 'admin@mcrmotors.com', '$2y$10$ejemplo_hash_aqui', 'admin');
```

#### Paso 5: Configurar a Conexión á Base de Datos

1. Abrir o arquivo `php/config.php`
2. Editar as credenciais:

```php
<?php
// Configuración da base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'mcrmotors_db');
define('DB_USER', 'root');
define('DB_PASS', '');  // Baleiro por defecto en XAMPP
define('DB_CHARSET', 'utf8mb4');

// Crear conexión
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die("Erro de conexión: " . $e->getMessage());
}
?>
```

#### Paso 6: Crear Carpetas de Uploads

```bash
mkdir uploads
mkdir uploads/vehiculos
```

Ou crear manualmente as carpetas:
- `uploads/`
- `uploads/vehiculos/`

**Importante:** Dar permisos de escritura (CHMOD 755 en Linux/Mac)

#### Paso 7: Probar a Instalación

1. Abrir navegador
2. Ir a: `http://localhost/Compraventa/`
3. Debería aparecer a páxina principal

**Credenciais de administrador por defecto:**
- Email: `admin@mcrmotors.com`
- Contrasinal: `admin123` (cámbialo inmediatamente!)

### 1.3. Instalación en Servidor de Produción

#### Requisitos do Hosting:
- Hosting con PHP 7.4+ e MySQL
- Certificado SSL (HTTPS)
- Acceso FTP ou cPanel
- Mínimo 10GB espazo en disco
- Soporte para `.htaccess` (Apache) ou configuración equivalente

#### Paso 1: Subir Arquivos por FTP

1. Conectar ao servidor por FTP (FileZilla, WinSCP, etc.)
2. Subir todos os arquivos a `public_html` ou directorio correspondente
3. Verificar que todos os arquivos se subiron correctamente

#### Paso 2: Crear Base de Datos no Hosting

1. Acceder a cPanel
2. Ir a "MySQL Databases" ou "Bases de Datos MySQL"
3. Crear nova base de datos: `usuario_mcrmotors`
4. Crear usuario de base de datos
5. Asignar permisos completos ao usuario
6. Anotar: nome de BD, usuario e contrasinal

#### Paso 3: Importar Base de Datos

1. Ir a phpMyAdmin no hosting
2. Seleccionar a base de datos creada
3. Importar o arquivo `.sql`

#### Paso 4: Configurar config.php

```php
define('DB_HOST', 'localhost'); // Normalmente localhost
define('DB_NAME', 'usuario_mcrmotors');
define('DB_USER', 'usuario_bd');
define('DB_PASS', 'contrasinal_seguro');
```

#### Paso 5: Configurar Permisos

- Carpeta `uploads/`: 755
- Carpeta `uploads/vehiculos/`: 755

#### Paso 6: Configurar HTTPS

Asegurarse de que o certificado SSL está activo e redirixir HTTP a HTTPS:

**Arquivo .htaccess:**
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

#### Paso 7: Verificación Final

1. Abrir `https://tudominio.com`
2. Comprobar que todo funciona
3. Probar login de administrador
4. Cambiar contrasinal de administrador por defecto

---

## 2. Manual Técnico

### 2.1. Estrutura do Proxecto

```
Compraventa/
│
├── index.html              # Páxina principal
├── coches-venta.html      # Catálogo público
├── coches-vendidos.html   # Galería de vendidos
├── contacto.html          # Formulario de contacto
├── financiacion.html      # Información de financiación
├── login.html             # Login de usuarios
├── registro.html          # Rexistro de usuarios
├── favoritos.html         # Favoritos (usuarios)
├── admin.html             # Panel de administración
│
├── css/
│   └── style.css          # Estilos personalizados
│
├── js/
│   ├── script.js          # Lóxica xeral
│   └── vehiculos.js       # Xestión de vehículos
│
├── php/
│   ├── config.php         # Configuración de BD
│   ├── auth.php           # Autenticación
│   ├── vehiculos.php      # CRUD de vehículos
│   └── favoritos.php      # Xestión de favoritos
│
├── uploads/
│   └── vehiculos/         # Imaxes de vehículos
│
├── images/                # Imaxes estáticas
│
└── docs/                  # Documentación
```

### 2.2. Arquivos PHP Principais

#### config.php
- **Propósito:** Configuración da conexión á base de datos
- **Contén:** Credenciais de BD, creación de obxecto PDO
- **Usado por:** Todos os demais arquivos PHP

#### auth.php
- **Propósito:** Xestión de autenticación
- **Funcións principais:**
  - `login()`: Autenticación de usuario
  - `register()`: Rexistro de novo usuario
  - `logout()`: Peche de sesión
  - `verificarSesion()`: Comprobar sesión activa

#### vehiculos.php
- **Propósito:** CRUD de vehículos
- **Accións soportadas:**
  - `list`: Listar vehículos (con filtros)
  - `get`: Obter detalle dun vehículo
  - `create`: Crear novo vehículo
  - `update`: Actualizar vehículo
  - `delete`: Eliminar vehículo
  - `upload_images`: Subir imaxes

#### favoritos.php
- **Propósito:** Xestión de favoritos
- **Accións soportadas:**
  - `add`: Engadir a favoritos
  - `remove`: Eliminar de favoritos
  - `list`: Listar favoritos do usuario

### 2.3. Arquivos JavaScript Principais

#### script.js
- **Propósito:** Funcionalidade xeral da aplicación
- **Funcións principais:**
  - Validación de formularios
  - Xestión de sesións
  - Animacións
  - Mensaxes de confirmación

#### vehiculos.js
- **Propósito:** Lóxica específica de vehículos
- **Funcións principais:**
  - Carga dinámica de vehículos
  - Filtros de busca
  - Sistema de favoritos (AJAX)
  - Galería de imaxes

### 2.4. Base de Datos

**Relacións:**
- `favoritos.id_usuario` → `usuarios.id` (ON DELETE CASCADE)
- `favoritos.id_vehiculo` → `vehiculos.id` (ON DELETE CASCADE)
- `imagenes.id_vehiculo` → `vehiculos.id` (ON DELETE CASCADE)

**Índices importantes:**
- `usuarios.email` (UNIQUE)
- `favoritos(id_usuario, id_vehiculo)` (UNIQUE)
- `vehiculos.estado` (para filtrado)

### 2.5. Fluxo de Autenticación

```
1. Usuario vai a login.html
2. Introduce email e contrasinal
3. JavaScript fai POST a php/auth.php?action=login
4. PHP verifica credenciais na BD
5. Se é correcto:
   - Crea $_SESSION['usuario_id']
   - Garda $_SESSION['rol']
   - Devolve JSON success: true
6. JavaScript redirixe a coches-venta.html
7. Páxinas protexidas verifican sesión ao cargar
```

### 2.6. Fluxo de Creación de Vehículo

```
1. Admin vai a admin.html
2. Completa formulario de novo vehículo
3. Selecciona múltiples imaxes
4. JavaScript fai POST a php/vehiculos.php?action=create
5. PHP valida datos
6. PHP procesa imaxes:
   - Valida formato e tamaño
   - Xenera nome único
   - Move a uploads/vehiculos/
7. PHP insire vehículo na BD
8. PHP insire referencias de imaxes na táboa imagenes
9. Devolve JSON con id do vehículo creado
10. JavaScript mostra confirmación
```

### 2.7. Mantemento e Actualización

#### Engadir Nova Marca de Vehículo:

Non require código, só engadir vehículos con esa marca desde o panel admin.

#### Cambiar Cores da Web:

Editar `css/style.css`:
```css
:root {
    --color-primary: #007bff;    /* Azul principal */
    --color-secondary: #6c757d;  /* Gris */
    --color-accent: #28a745;     /* Verde */
}
```

#### Cambiar Información de Contacto:

1. Editar o top-bar en cada arquivo HTML
2. Ou mellor: Crear un `includes/header.php` e incluílo (requeriría renomear .html a .php)

#### Backup da Base de Datos:

```bash
# Desde terminal (ou cron job)
mysqldump -u usuario -p mcrmotors_db > backup_$(date +%Y%m%d).sql
```

Ou desde phpMyAdmin: Exportar → SQL

---

## 3. Melloras Futuras

### 3.1. Funcionalidades Prioritarias

#### 1. Sistema de Notificacións por Email
**Descrición:** Enviar correos automáticos aos administradores cando hai novas consultas de contacto.

**Tecnoloxía:** PHPMailer ou servizo SMTP

**Estimación:** 1 semana

**Beneficio:** Resposta máis rápida aos clientes

---

#### 2. Sistema de Reserva de Citas
**Descrición:** Permitir aos clientes solicitar citas para ver vehículos.

**Funcionalidades:**
- Calendario dispoñible
- Selección de data e hora
- Confirmación automática por email
- Panel admin para xestionar citas

**Estimación:** 2 semanas

**Beneficio:** Mellor organización de visitas

---

#### 3. Sistema de Valoración de Vehículos
**Descrición:** Calculadora online para que clientes coñezan o valor do seu coche usado.

**Funcionalidades:**
- Formulario con datos do vehículo
- Algoritmo de valoración
- Envío de oferta por email

**Estimación:** 1 semana

**Beneficio:** Captación de vehículos para compra

---

#### 4. Comparador de Vehículos
**Descrición:** Permitir comparar ata 3 vehículos lado a lado.

**Funcionalidades:**
- Selección de vehículos a comparar
- Vista comparativa de características
- Táboa comparativa

**Estimación:** 3 días

**Beneficio:** Facilitar decisión de compra

---

#### 5. Sistema de Comentarios/Opinións
**Descrición:** Permitir aos clientes deixar valoracións e comentarios.

**Funcionalidades:**
- Sistema de estrellas (1-5)
- Campo de comentario
- Moderación por admin
- Mostrar valoración media

**Estimación:** 1 semana

**Beneficio:** Xerar confianza en novos clientes

---

### 3.2. Melloras Técnicas

#### 1. Migrar a Framework MVC
**Descrición:** Refactorizar código usando Laravel ou CodeIgniter

**Beneficio:** Código máis mantemible e escalable

**Estimación:** 4 semanas

---

#### 2. Implementar API REST
**Descrición:** Crear API para futuras integracións (app móbil, terceiros)

**Beneficio:** Versatilidade e posibilidade de app nativa

**Estimación:** 2 semanas

---

#### 3. Sistema de Caché
**Descrición:** Implementar Redis ou Memcached para consultas frecuentes

**Beneficio:** Mellor rendemento

**Estimación:** 1 semana

---

#### 4. Optimización de Imaxes Automática
**Descrición:** Redimensionamento e compresión automática ao subir

**Tecnoloxía:** Biblioteca GD ou Imagick de PHP

**Beneficio:** Menor uso de ancho de banda

**Estimación:** 3 días

---

### 3.3. Funcionalidades de Marketing

#### 1. Newsletter
**Descrición:** Sistema de subscrición e envío de boletíns

**Funcionalidades:**
- Formulario de subscrición
- Panel admin para enviar newsletters
- Plantillas de email

**Estimación:** 1 semana

**Beneficio:** Comunicación recurrente con clientes

---

#### 2. Sistema de Recomendacións
**Descrición:** "Vehículos similares" baseados en preferencias

**Tecnoloxía:** Algoritmo de recomendación simple

**Estimación:** 1 semana

**Beneficio:** Aumentar visualizacións de vehículos

---

#### 3. Integración con Redes Sociais
**Descrición:** Compartir vehículos en redes sociais directamente

**Funcionalidades:**
- Botóns de compartir (Facebook, Twitter, WhatsApp)
- Open Graph meta tags para vista previa

**Estimación:** 2 días

**Beneficio:** Maior difusión orgánica

---

### 3.4. Internacionalización

#### 1. Multiidioma (Galego/Español/Inglés)
**Descrición:** Permitir cambiar idioma da interface

**Tecnoloxía:** Arquivos de traducción JSON ou PHP

**Estimación:** 2 semanas

**Beneficio:** Alcance a clientes non galego-falantes

---

### 3.5. Priorización

| Mellora | Prioridade | Impacto | Dificultade | Tempo |
|---------|------------|---------|-------------|-------|
| Notificacións email | ALTA | Alto | Baixa | 1 sem |
| Valoración vehículos | ALTA | Alto | Media | 1 sem |
| Reserva de citas | MEDIA | Medio | Media | 2 sem |
| Comparador | MEDIA | Medio | Baixa | 3 días |
| Newsletter | MEDIA | Medio | Media | 1 sem |
| Optimización imaxes | BAIXA | Alto | Baixa | 3 días |
| API REST | BAIXA | Baixo | Alta | 2 sem |
| Multiidioma | BAIXA | Medio | Alta | 2 sem |

---

**Data de elaboración:** Decembro 2025  
**Autor:** Marcos Pepín  
**Versión:** 1.0
