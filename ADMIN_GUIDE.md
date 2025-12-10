# 📋 GUÍA: Panel de Administración

## 🔐 Acceso al Panel de Administración

### Credenciales de Administrador
- **Email**: `admin@compraventa.com`
- **Contraseña**: `admin123`

### Cómo Acceder
1. Ve a la página de **Login**: http://localhost/Compraventa/login.html
2. Introduce las credenciales de administrador
3. Una vez autenticado, verás en el menú de usuario (esquina superior derecha):
   - Tu nombre (Admin)
   - Despliega el menú ▼
   - Selecciona **"Panel Admin"** con el icono ⚙️

## 📊 Secciones del Panel de Administración

### 1. **Dashboard** 📈
Página principal con estadísticas en tiempo real:
- **Vehículos Totales**: Cantidad total de vehículos publicados
- **Disponibles**: Vehículos listos para la venta
- **Vendidos**: Vehículos marcados como vendidos
- **Reservados**: Vehículos con reserva activa

### 2. **Publicar Vehículo** ➕
Formulario para añadir nuevos vehículos al catálogo:

#### Campos Obligatorios (*)
- **Marca**: Marca del vehículo (ej: BMW, Audi, Porsche)
- **Modelo**: Modelo específico (ej: M4 Competition)
- **Año**: Año de fabricación (1990-2099)
- **Tipo**: Selecciona entre Coche, Moto o Furgoneta
- **Precio**: Precio en euros (ej: 65900.00)
- **Combustible**: Gasolina, Diesel, Híbrido o Eléctrico
- **Transmisión**: Manual o Automático

#### Campos Opcionales
- **Kilometraje**: Kilómetros recorridos
- **Color**: Color del vehículo
- **URL de Imagen**: Enlace a la imagen del vehículo
- **Descripción**: Descripción detallada

### 3. **Gestionar Vehículos** 📝
Tabla con todos los vehículos publicados:

#### Información Mostrada
- **ID**: Identificador único del vehículo
- **Marca/Modelo**: Nombre completo del vehículo
- **Año**: Año de fabricación
- **Precio**: Precio en euros
- **Estado**: Color según estado
  - 🟢 **Verde**: Disponible
  - 🔴 **Rojo**: Vendido
  - 🟡 **Amarillo**: Reservado

#### Acciones Disponibles
- **✏️ Editar**: Modifica los datos del vehículo
- **🗑️ Eliminar**: Elimina el vehículo del catálogo

## 🚀 Flujo Típico de Trabajo

### Publicar un Nuevo Vehículo
1. Accede al **Panel de Administración**
2. Haz clic en la pestaña **"Publicar Vehículo"**
3. Completa el formulario con los datos del vehículo
4. Haz clic en **"Publicar Vehículo"**
5. Se mostrará un mensaje de confirmación ✅
6. El vehículo aparecerá automáticamente en el catálogo

### Verificar Estadísticas
1. En la pestaña **"Dashboard"** verás estadísticas en tiempo real
2. Se actualiza automáticamente cuando añades o eliminas vehículos

### Gestionar Vehículos Existentes
1. Ve a la pestaña **"Gestionar Vehículos"**
2. Busca el vehículo en la tabla
3. Usa los botones de acción:
   - **Editar**: Para cambiar datos (próximamente)
   - **Eliminar**: Para remover del catálogo

## 💡 Consejos Útiles

### URLs de Imágenes
Para que las imágenes se muestren correctamente, usa URLs de internet:
- **Proveedores recomendados**:
  - Unsplash: https://unsplash.com
  - Pixabay: https://pixabay.com
  - Pexels: https://pexels.com

**Ejemplo válido**:
```
https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500
```

### Formato de Precios
- Usa punto (.) como separador decimal: `65900.00`
- No incluyas el símbolo €, se añade automáticamente

### Descripción de Vehículos
Incluye información relevante como:
- Características principales
- Equipamiento especial
- Historial de mantenimiento
- Particularidades del vehículo

**Ejemplo**:
```
BMW M4 Competition con 510 CV, en perfecto estado con todos 
los extras. Mantenimiento al día, un único propietario, 
garantía de concesionario.
```

## 🔒 Seguridad

### Restricciones
- **Solo administradores** pueden acceder al panel
- Los usuarios normales son automáticamente redirigidos
- La sesión se mantiene segura con encriptación

### Cambiar Contraseña de Admin
Por seguridad, se recomienda cambiar la contraseña predeterminada:
1. Accede a phpMyAdmin: http://localhost/phpmyadmin
2. Selecciona la BD `compraventa_db`
3. Abre la tabla `usuarios`
4. Busca al usuario `admin@compraventa.com`
5. Edita el campo `password` con un nuevo hash bcrypt

**Para generar un hash bcrypt**, usa:
```php
<?php echo password_hash('tu_nueva_contraseña', PASSWORD_BCRYPT); ?>
```

## ⚠️ Problemas Comunes

### "Acceso Denegado"
- Verifica que hayas iniciado sesión como administrador
- Comprueba que tu usuario tenga rol = 'admin' en la BD

### Los cambios no se muestran
- Actualiza la página (F5 o Ctrl+R)
- Limpia la caché del navegador (Ctrl+Shift+Del)
- Verifica tu conexión a internet

### Las imágenes no se cargan
- Verifica que la URL sea válida y accesible
- Prueba la URL en una nueva pestaña del navegador
- Asegúrate de usar HTTPS si está disponible

## 📞 Soporte

Si encuentras problemas:
1. Revisa los errores en la consola (F12 → Console)
2. Verifica que MySQL esté activo en XAMPP
3. Comprueba los logs de PHP en XAMPP

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2025
