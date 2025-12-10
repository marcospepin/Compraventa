# DESEÑO - MCR MOTORS

## 1. Diagrama da Arquitectura

### 1.1. Arquitectura Xeral

MCR Motors segue unha **arquitectura cliente-servidor de tres capas**:

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                    │
│                         (Frontend)                           │
├─────────────────────────────────────────────────────────────┤
│  • HTML5 + CSS3 + Bootstrap 5                               │
│  • JavaScript (ES6+)                                         │
│  • Font Awesome (iconos)                                     │
│  • Responsive Design                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ Peticións AJAX
┌──────────────────────▼──────────────────────────────────────┐
│                     CAPA DE NEGOCIO                          │
│                       (Backend)                              │
├─────────────────────────────────────────────────────────────┤
│  • PHP 7.4+                                                  │
│  • Lóxica de aplicación                                      │
│  • Xestión de sesións                                        │
│  • Validación de datos                                       │
│  • Procesamento de formularios                               │
│  • Autenticación e autorización                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ PDO / MySQLi
                       │ Consultas SQL
┌──────────────────────▼──────────────────────────────────────┐
│                     CAPA DE DATOS                            │
│                      (Base de Datos)                         │
├─────────────────────────────────────────────────────────────┤
│  • MySQL 8.0 / MariaDB 10.6                                 │
│  • Táboas relacionais                                        │
│  • Constraints e FKs                                         │
│  • Stored procedures (opcional)                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2. Arquitectura de Arquivos

```
Compraventa/
│
├── index.html                 # Páxina principal
├── coches-venta.html         # Catálogo de vehículos
├── coches-vendidos.html      # Galería de vendidos
├── contacto.html             # Formulario de contacto
├── financiacion.html         # Info sobre financiación
├── login.html                # Inicio de sesión
├── registro.html             # Rexistro de usuarios
├── favoritos.html            # Favoritos (usuarios)
├── admin.html                # Panel de administración
│
├── css/
│   └── style.css             # Estilos personalizados
│
├── js/
│   ├── script.js             # Lóxica xeral
│   └── vehiculos.js          # Lóxica de vehículos
│
├── php/
│   ├── config.php            # Configuración BD
│   ├── auth.php              # Autenticación
│   ├── vehiculos.php         # CRUD vehículos
│   └── favoritos.php         # Xestión de favoritos
│
├── images/                   # Imaxes estáticas
│   └── logo-ppal.png
│
├── uploads/
│   └── vehiculos/            # Imaxes de vehículos
│
├── pdf/
│   └── terminos-condiciones.pdf
│
└── docs/                     # Documentación do proxecto
    ├── 01-Anteproxecto.md
    ├── 02-Estudo-Preliminar.md
    ├── 03-Analise-Requirimentos.md
    ├── 04-Planificacion.md
    ├── 05-Orzamento.md
    ├── 06-Deseño.md
    ├── 07-Codificacion.md
    └── 08-Manuais.md
```

### 1.3. Fluxo de Datos Principal

```
[Usuario] → [Navegador] → [index.html/coches-venta.html]
                              ↓
                         [script.js]
                              ↓ AJAX
                    [php/vehiculos.php?action=list]
                              ↓ PDO
                    [Base de Datos: vehiculos]
                              ↓
                    [JSON Response]
                              ↓
                    [Renderización Dinámica]
                              ↓
                    [Mostrar Vehículos]
```

---

## 2. Diagrama de Base de Datos

### 2.1. Modelo Entidade-Relación

```
┌─────────────┐              ┌─────────────┐              ┌─────────────┐
│  USUARIOS   │              │  FAVORITOS  │              │  VEHICULOS  │
├─────────────┤              ├─────────────┤              ├─────────────┤
│ id (PK)     │              │ id (PK)     │              │ id (PK)     │
│ nombre      │◄────────────┤│ id_usuario  │├────────────►│ marca       │
│ email (UK)  │     1:N      │ id_vehiculo │     N:1      │ modelo      │
│ telefono    │              │ fecha       │              │ version     │
│ password    │              └─────────────┘              │ ano         │
│ rol         │                                           │ km          │
│ fecha       │                                           │ precio      │
└─────────────┘                                           │ combustible │
                                                          │ transmision │
                                                          │ potencia    │
                                                          │ descripcion │
                                                          │ estado      │
                                                          │ fecha       │
                                                          └─────────────┘
                                                                 │
                                                                 │ 1:N
                                                                 ▼
                                                          ┌─────────────┐
                                                          │  IMAGENES   │
                                                          ├─────────────┤
                                                          │ id (PK)     │
                                                          │ id_vehiculo │
                                                          │ ruta        │
                                                          │ orden       │
                                                          │ fecha       │
                                                          └─────────────┘
```

### 2.2. Modelo Relacional

#### Táboa: `usuarios`

| Campo | Tipo | Restricións | Descrición |
|-------|------|-------------|------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| `nombre` | VARCHAR(100) | NOT NULL | Nome completo |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Correo electrónico |
| `telefono` | VARCHAR(20) | NULL | Teléfono |
| `password` | VARCHAR(255) | NOT NULL | Contrasinal hash |
| `rol` | ENUM('cliente','admin') | DEFAULT 'cliente' | Rol do usuario |
| `fecha_registro` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de alta |

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Táboa: `vehiculos`

| Campo | Tipo | Restricións | Descrición |
|-------|------|-------------|------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| `marca` | VARCHAR(50) | NOT NULL | Marca do vehículo |
| `modelo` | VARCHAR(50) | NOT NULL | Modelo do vehículo |
| `version` | VARCHAR(100) | NULL | Versión específica |
| `ano` | INT | NOT NULL | Ano de fabricación |
| `km` | INT | NOT NULL | Quilometraxe |
| `precio` | DECIMAL(10,2) | NOT NULL | Prezo en euros |
| `combustible` | VARCHAR(20) | NOT NULL | Tipo: Gasolina, Diésel, Híbrido, Eléctrico |
| `transmision` | VARCHAR(20) | NOT NULL | Manual ou Automático |
| `potencia` | INT | NULL | Potencia en CV |
| `descripcion` | TEXT | NOT NULL | Descrición detallada |
| `caracteristicas` | TEXT | NULL | JSON con características |
| `estado` | ENUM('venta','vendido') | DEFAULT 'venta' | Estado actual |
| `fecha_creacion` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de alta |

```sql
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
```

#### Táboa: `imagenes`

| Campo | Tipo | Restricións | Descrición |
|-------|------|-------------|------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| `id_vehiculo` | INT | FOREIGN KEY, NOT NULL | Referencia a vehiculos.id |
| `ruta` | VARCHAR(255) | NOT NULL | Ruta do arquivo |
| `orden` | INT | DEFAULT 0 | Orde de visualización |
| `fecha_subida` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de carga |

```sql
CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_vehiculo INT NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    orden INT DEFAULT 0,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE
);
```

#### Táboa: `favoritos`

| Campo | Tipo | Restricións | Descrición |
|-------|------|-------------|------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| `id_usuario` | INT | FOREIGN KEY, NOT NULL | Referencia a usuarios.id |
| `id_vehiculo` | INT | FOREIGN KEY, NOT NULL | Referencia a vehiculos.id |
| `fecha_agregado` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de engadido |

```sql
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (id_usuario, id_vehiculo)
);
```

### 2.3. Relacións

- **usuarios ↔ favoritos:** 1:N (un usuario pode ter múltiples favoritos)
- **vehiculos ↔ favoritos:** 1:N (un vehículo pode estar nos favoritos de múltiples usuarios)
- **vehiculos ↔ imagenes:** 1:N (un vehículo pode ter múltiples imaxes)

---

## 3. Deseño de Interface de Usuarios

### 3.1. Paleta de Cores

```
Cor Principal:     #007bff (Azul primario)
Cor Secundaria:    #6c757d (Gris)
Cor de Acento:     #28a745 (Verde)
Cor de Perigo:     #dc3545 (Vermello)
Cor de Fondo:      #f8f9fa (Gris claro)
Cor de Texto:      #212529 (Negro case)
Cor Branco:        #ffffff
```

### 3.2. Tipografía

- **Familia:** Montserrat (Google Fonts)
- **Pesos:**
  - Light (300): Textos secundarios
  - Regular (400): Corpo de texto
  - Medium (500): Subtítulos
  - Semi-Bold (600): Destacados
  - Bold (700): Títulos
  - Extra-Bold (800): Títulos principais

### 3.3. Wireframes das Páxinas Principais

#### 3.3.1. Páxina Principal (index.html)

```
┌────────────────────────────────────────────────────────┐
│  [Logo]              [ Inicio | Venta | Vendidos |    │
│                        Financiación | Contacto ]       │
├────────────────────────────────────────────────────────┤
│                                                        │
│            [ HERO - Imaxe Principal ]                 │
│         MCR MOTORS - O teu concesionario              │
│              [ Ver Coches en Venta ]                  │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Sobre Nós                                            │
│  Texto descritivo da empresa...                       │
├────────────────────────────────────────────────────────┤
│  Vehículos Destacados                                 │
│  ┌────────┐  ┌────────┐  ┌────────┐                 │
│  │ Coche 1│  │ Coche 2│  │ Coche 3│                 │
│  └────────┘  └────────┘  └────────┘                 │
├────────────────────────────────────────────────────────┤
│  Por Que Elixirnos                                    │
│  [Icono] Calidade  [Icono] Confianza  [Icono] Servizo│
├────────────────────────────────────────────────────────┤
│  FOOTER                                               │
│  Contacto | Redes Sociais | Copyright                │
└────────────────────────────────────────────────────────┘
```

#### 3.3.2. Catálogo de Vehículos (coches-venta.html)

```
┌────────────────────────────────────────────────────────┐
│  NAVEGACIÓN (igual que index)                         │
├────────────────────────────────────────────────────────┤
│  COCHES EN VENTA                                      │
├────────────────────────────────────────────────────────┤
│  FILTROS:                                             │
│  [Marca ▼] [Modelo ▼] [Prezo Min] [Prezo Max]       │
│  [Combustible ▼] [Ano Min] [Ano Max] [Buscar]       │
├────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │  [Imaxe]     │  │  [Imaxe]     │  │  [Imaxe]     ││
│  │  BMW M3      │  │  Audi RS5    │  │  Mercedes C63││
│  │  2020        │  │  2019        │  │  2021        ││
│  │  45.000 km   │  │  38.000 km   │  │  22.000 km   ││
│  │  52.990€     │  │  58.990€     │  │  64.990€     ││
│  │  [Ver +] ♥   │  │  [Ver +] ♥   │  │  [Ver +] ♥   ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │  [Máis...]   │  │  [Máis...]   │  │  [Máis...]   ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
├────────────────────────────────────────────────────────┤
│  FOOTER                                               │
└────────────────────────────────────────────────────────┘
```

#### 3.3.3. Detalle de Vehículo

```
┌────────────────────────────────────────────────────────┐
│  NAVEGACIÓN                                           │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  │  BMW M3 Competition     │
│  │                      │  │  2020 • 45.000 km       │
│  │   [GALERÍA IMAXES]   │  │  52.990€                │
│  │   [◄] [►] [...]      │  │                          │
│  │                      │  │  ♥ Engadir a Favoritos  │
│  └──────────────────────┘  │  📱 WhatsApp            │
│                            │  📧 Contactar           │
├────────────────────────────┴──────────────────────────┤
│  CARACTERÍSTICAS PRINCIPAIS                           │
│  Combustible: Gasolina | Transmisión: Automático     │
│  Potencia: 510 CV | Cor: Azul Marina                 │
├────────────────────────────────────────────────────────┤
│  DESCRICIÓN COMPLETA                                  │
│  [Texto detallado do vehículo...]                    │
├────────────────────────────────────────────────────────┤
│  CARACTERÍSTICAS ADICIONAIS                           │
│  ✓ Navegador GPS   ✓ Cámara traseira                 │
│  ✓ Asientos coiro  ✓ Sistema de son premium          │
├────────────────────────────────────────────────────────┤
│  FOOTER                                               │
└────────────────────────────────────────────────────────┘
```

#### 3.3.4. Panel de Administración (admin.html)

```
┌────────────────────────────────────────────────────────┐
│  MCR MOTORS - PANEL DE ADMINISTRACIÓN                 │
│  [Menú Lateral]       Olá, Admin | Saír               │
├──────────┬─────────────────────────────────────────────┤
│ MENÚ     │  ESTATÍSTICAS                              │
│ • Panel  │  ┌────────┐ ┌────────┐ ┌────────┐         │
│ • Vehíc. │  │   23   │ │   12   │ │ 58.500€│         │
│ • Users  │  │En Venda│ │Vendidos│ │ Medio  │         │
│          │  └────────┘ └────────┘ └────────┘         │
│          ├─────────────────────────────────────────────┤
│          │  VEHÍCULOS                                 │
│          │  [+ Novo Vehículo]                         │
│          │  ┌───────────────────────────────────────┐ │
│          │  │ BMW M3 | 2020 | 52.990€ [✏️] [🗑️]   │ │
│          │  │ Audi RS5 | 2019 | 58.990€ [✏️] [🗑️] │ │
│          │  │ Mercedes C63 | 2021 | ... [✏️] [🗑️] │ │
│          │  └───────────────────────────────────────┘ │
└──────────┴─────────────────────────────────────────────┘
```

### 3.4. Responsive Design

**Breakpoints de Bootstrap 5:**

- **XS (Extra Small):** < 576px (móbiles verticais)
- **SM (Small):** ≥ 576px (móbiles horizontais)
- **MD (Medium):** ≥ 768px (tablets)
- **LG (Large):** ≥ 992px (portátiles)
- **XL (Extra Large):** ≥ 1200px (escritorio)
- **XXL:** ≥ 1400px (escritorio grande)

**Adaptacións:**
- Móbil: Navegación colapsable, 1 vehículo por fila
- Tablet: 2 vehículos por fila
- Escritorio: 3 vehículos por fila

### 3.5. Compoñentes Reutilizables

**Header:**
- Top bar con contacto e redes sociais
- Navbar con navegación principal
- Botóns de login/rexistro

**Cards de Vehículo:**
- Imaxe principal
- Información básica (marca, modelo, ano, km, prezo)
- Botón de ver detalle
- Botón de favoritos

**Footer:**
- Información da empresa
- Enlaces rápidos
- Información de contacto
- Redes sociais
- Copyright

---

**Data de elaboración:** Decembro 2025  
**Autor:** Marcos Pepín  
**Versión:** 1.0

**Nota:** Este documento inclúe os deseños principais. Débense engadir capturas de pantalla dos mockups finais cando estean dispoñibles.
