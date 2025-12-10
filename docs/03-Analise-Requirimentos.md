# ANÁLISE: REQUIRIMENTOS DO SISTEMA - MCR MOTORS

## 1. Descrición Xeral

MCR Motors é unha aplicación web de compraventa de vehículos de alta gama que permite aos visitantes explorar un catálogo actualizado de vehículos, aos usuarios rexistrados gardar favoritos, e aos administradores xestionar todo o inventario de forma eficiente.

A aplicación procesa información de vehículos (marca, modelo, características técnicas, imaxes, prezos) e permite aos usuarios buscar, filtrar e contactar co concesionario. Os administradores poden realizar operacións CRUD (Crear, Ler, Actualizar, Eliminar) sobre o inventario de vehículos a través dun panel de administración.

## 2. Funcionalidades

### F1: Rexistro de usuario

**Actores:** Visitante anónimo

**Datos de entrada:**
- Nome completo (String, obrigatorio)
- Correo electrónico (String, formato email, obrigatorio, único)
- Teléfono (String, formato numérico, opcional)
- Contrasinal (String, mínimo 8 caracteres, obrigatorio)
- Confirmación de contrasinal (String, debe coincidir)
- Aceptación de termos e condicións (Boolean, obrigatorio)

**Proceso:**
1. O usuario completa o formulario de rexistro
2. O sistema valida que o email non exista na base de datos
3. O sistema valida o formato dos datos
4. O sistema encripta o contrasinal mediante hash
5. O sistema garda o novo usuario na base de datos
6. O sistema crea unha sesión automática
7. O sistema redirixe ao usuario á páxina de coches en venta

**Datos de saída:**
- Confirmación de rexistro exitoso
- Sesión iniciada automaticamente
- ID de usuario asignado

**Validacións:**
- Email único (non pode existir outro usuario co mesmo email)
- Formato de email válido
- Contrasinal mínimo 8 caracteres
- Confirmación de contrasinal coincidente
- Aceptación de termos obrigatoria

---

### F2: Inicio de sesión

**Actores:** Usuario rexistrado

**Datos de entrada:**
- Correo electrónico (String)
- Contrasinal (String)

**Proceso:**
1. O usuario introduce credenciais no formulario
2. O sistema busca o usuario na base de datos polo email
3. O sistema verifica o contrasinal mediante password_verify()
4. Se é correcto, crea unha sesión co ID do usuario
5. Redirixe á páxina de coches en venta

**Datos de saída:**
- Sesión iniciada con datos do usuario
- Redireccionamento á área de usuario

**Validacións:**
- Email debe existir na base de datos
- Contrasinal debe coincidir co hash almacenado

---

### F3: Peche de sesión

**Actores:** Usuario autenticado

**Datos de entrada:**
- Sesión activa do usuario

**Proceso:**
1. O usuario preme o botón de pechar sesión
2. O sistema destrúe a sesión activa
3. Redirixe á páxina de inicio de sesión

**Datos de saída:**
- Sesión eliminada
- Mensaxe de confirmación

---

### F4: Visualización de catálogo de vehículos

**Actores:** Visitante anónimo, Usuario rexistrado, Administrador

**Datos de entrada:**
- Filtros opcionais (marca, modelo, rango de prezo, ano, combustible, etc.)
- Criterio de ordenación (prezo ascendente/descendente, ano, nome)

**Proceso:**
1. O sistema consulta a base de datos de vehículos con estado "en venta"
2. Aplica os filtros seleccionados polo usuario
3. Ordena os resultados segundo o criterio elixido
4. Recupera a primeira imaxe de cada vehículo
5. Presenta os vehículos en formato de tarxetas (cards)

**Datos de saída:**
- Listaxe de vehículos con:
  - Imaxe principal
  - Marca e modelo
  - Ano
  - Quilometraxe
  - Prezo
  - Botón de ver detalles
  - Botón de favoritos (só usuarios rexistrados)

---

### F5: Ver detalle de vehículo

**Actores:** Visitante anónimo, Usuario rexistrado, Administrador

**Datos de entrada:**
- ID do vehículo (Integer)

**Proceso:**
1. O usuario fai clic nunha tarxeta de vehículo
2. O sistema consulta todos os datos do vehículo na base de datos
3. Recupera todas as imaxes asociadas ao vehículo
4. Presenta toda a información en formato de ficha detallada

**Datos de saída:**
- Información completa do vehículo:
  - Galería de imaxes
  - Marca, modelo, versión
  - Ano, quilometraxe
  - Tipo de combustible
  - Transmisión
  - Potencia
  - Descrición completa
  - Prezo
  - Características adicionais
  - Botóns de acción (contacto, WhatsApp, favoritos)

---

### F6: Busca e filtrado de vehículos

**Actores:** Visitante anónimo, Usuario rexistrado, Administrador

**Datos de entrada:**
- Texto de busca libre (String, opcional)
- Filtros:
  - Marca (String, opcional)
  - Modelo (String, opcional)
  - Prezo mínimo (Decimal, opcional)
  - Prezo máximo (Decimal, opcional)
  - Ano mínimo (Integer, opcional)
  - Ano máximo (Integer, opcional)
  - Tipo de combustible (String, opcional)
  - Tipo de transmisión (String, opcional)

**Proceso:**
1. O usuario introduce criterios de busca
2. O sistema xera unha consulta SQL con cláusulas WHERE dinámicas
3. Executa a consulta na base de datos
4. Mostra os resultados que coincidan con todos os criterios

**Datos de saída:**
- Listaxe de vehículos que cumpren os criterios
- Mensaxe se non hai resultados
- Contador de resultados atopados

---

### F7: Engadir vehículo a favoritos

**Actores:** Usuario rexistrado

**Datos de entrada:**
- ID do usuario (obtido da sesión)
- ID do vehículo (Integer)

**Proceso:**
1. O usuario preme o botón de favoritos (corazón)
2. O sistema verifica que o usuario teña sesión activa
3. Comproba se o vehículo xa está nos favoritos
4. Se non está, insire un novo rexistro na táboa de favoritos
5. Actualiza a interface para reflectir o cambio

**Datos de saída:**
- Confirmación de vehículo engadido a favoritos
- Icono de corazón cambia de estado (baleiro a cheo)

**Validacións:**
- Usuario debe estar autenticado
- Non permitir duplicados (un vehículo só pode estar unha vez nos favoritos)

---

### F8: Eliminar vehículo de favoritos

**Actores:** Usuario rexistrado

**Datos de entrada:**
- ID do usuario (obtido da sesión)
- ID do vehículo (Integer)

**Proceso:**
1. O usuario preme o botón de eliminar favorito
2. O sistema elimina o rexistro da táboa de favoritos
3. Actualiza a interface para reflectir o cambio

**Datos de saída:**
- Confirmación de vehículo eliminado de favoritos
- Icono de corazón cambia de estado (cheo a baleiro)

---

### F9: Visualización de favoritos

**Actores:** Usuario rexistrado

**Datos de entrada:**
- ID do usuario (obtido da sesión)

**Proceso:**
1. O usuario accede á páxina de favoritos
2. O sistema consulta todos os vehículos marcados como favoritos polo usuario
3. Mostra unha listaxe similar ao catálogo principal

**Datos de saída:**
- Listaxe de vehículos favoritos do usuario
- Mensaxe se non ten favoritos gardados
- Botón para eliminar de favoritos

---

### F10: Envío de formulario de contacto

**Actores:** Visitante anónimo, Usuario rexistrado

**Datos de entrada:**
- Nome completo (String, obrigatorio)
- Correo electrónico (String, formato email, obrigatorio)
- Teléfono (String, opcional)
- Asunto (String, selección predefinida, obrigatorio)
- Mensaxe (Text, obrigatorio)
- Aceptación de política de privacidade (Boolean, obrigatorio)

**Proceso:**
1. O usuario completa o formulario de contacto
2. O sistema valida todos os campos
3. Garda a consulta na base de datos (opcional)
4. Envía un correo electrónico ao concesionario
5. Envía un correo de confirmación ao usuario
6. Mostra mensaxe de confirmación

**Datos de saída:**
- Confirmación de mensaxe enviada
- Correo electrónico ao concesionario
- Correo de confirmación ao usuario

**Validacións:**
- Todos os campos obrigatorios deben completarse
- Formato de email válido
- Aceptación de privacidade obrigatoria

---

### F11: Crear novo vehículo (Admin)

**Actores:** Administrador

**Datos de entrada:**
- Marca (String, obrigatorio)
- Modelo (String, obrigatorio)
- Versión (String, opcional)
- Ano (Integer, obrigatorio, entre 1950 e ano actual)
- Quilometraxe (Integer, obrigatorio)
- Prezo (Decimal, obrigatorio)
- Tipo de combustible (String, obrigatorio)
- Transmisión (String, obrigatorio)
- Potencia (Integer, opcional)
- Descrición (Text, obrigatorio)
- Características (Array de strings, opcional)
- Imaxes (Arquivos, múltiples, obrigatorio mínimo 1)
- Estado (Enum: 'en venta', 'vendido', obrigatorio)

**Proceso:**
1. O administrador completa o formulario de novo vehículo
2. O sistema valida todos os campos
3. Procesa e garda as imaxes no servidor
4. Insire o novo vehículo na base de datos
5. Asocia as imaxes ao vehículo
6. Redirixe ao listado de vehículos con mensaxe de confirmación

**Datos de saída:**
- ID do novo vehículo creado
- Confirmación de creación exitosa
- Imaxes gardadas no servidor

**Validacións:**
- Todos os campos obrigatorios deben completarse
- Ano debe estar no rango válido
- Prezo debe ser un número positivo
- Imaxes deben ser formato JPG, PNG ou WEBP
- Tamaño máximo de imaxe: 5MB cada unha

---

### F12: Editar vehículo existente (Admin)

**Actores:** Administrador

**Datos de entrada:**
- ID do vehículo (Integer)
- Mesmos campos que crear vehículo (modificables)

**Proceso:**
1. O administrador accede á edición dun vehículo
2. O sistema carga os datos actuais no formulario
3. O administrador modifica os campos desexados
4. O sistema valida os cambios
5. Se hai novas imaxes, procesa e garda
6. Actualiza o rexistro na base de datos
7. Mostra confirmación

**Datos de saída:**
- Confirmación de actualización exitosa
- Datos do vehículo actualizados

---

### F13: Eliminar vehículo (Admin)

**Actores:** Administrador

**Datos de entrada:**
- ID do vehículo (Integer)

**Proceso:**
1. O administrador preme o botón de eliminar
2. O sistema solicita confirmación
3. Se confirma, elimina as imaxes do servidor
4. Elimina o rexistro da base de datos (ou marca como inactivo)
5. Elimina referencias en favoritos se existen
6. Mostra confirmación

**Datos de saída:**
- Confirmación de eliminación
- Vehículo desaparece do listado

---

### F14: Marcar vehículo como vendido (Admin)

**Actores:** Administrador

**Datos de entrada:**
- ID do vehículo (Integer)

**Proceso:**
1. O administrador cambia o estado do vehículo a "vendido"
2. O sistema actualiza o campo de estado na base de datos
3. O vehículo deixa de aparecer no catálogo público
4. O vehículo aparece na sección "Coches Vendidos"

**Datos de saída:**
- Confirmación de cambio de estado
- Vehículo móvese á sección correspondente

---

### F15: Xestión de imaxes de vehículo (Admin)

**Actores:** Administrador

**Datos de entrada:**
- ID do vehículo (Integer)
- Novos arquivos de imaxe (opcional)
- IDs de imaxes a eliminar (Array, opcional)

**Proceso:**
1. O administrador accede á xestión de imaxes
2. Para engadir: selecciona arquivos e o sistema valida e garda
3. Para eliminar: selecciona imaxes e o sistema elimina do servidor e base de datos
4. Actualiza a galería mostrada

**Datos de saída:**
- Listaxe actualizada de imaxes do vehículo
- Confirmacións de operacións realizadas

**Validacións:**
- Formato de imaxe válido (JPG, PNG, WEBP)
- Tamaño máximo por imaxe: 5MB
- Mínimo 1 imaxe por vehículo sempre

---

### F16: Visualización de estatísticas (Admin)

**Actores:** Administrador

**Datos de entrada:**
- Ningún

**Proceso:**
1. O administrador accede ao panel de control
2. O sistema calcula estatísticas:
   - Total de vehículos en venta
   - Total de vehículos vendidos
   - Prezo medio dos vehículos
   - Vehículos máis vistos (futuro)
3. Presenta as estatísticas en formato gráfico

**Datos de saída:**
- Números e gráficos de estatísticas
- Listaxe de últimos vehículos engadidos

---

## 3. Tipos de Usuarios

### 3.1. Visitante Anónimo
**Permisos:**
- Visualizar catálogo de vehículos en venta
- Ver detalles de vehículos
- Usar filtros de busca
- Visualizar vehículos vendidos
- Consultar información sobre financiación
- Enviar formulario de contacto
- Acceder á información corporativa

**Restricións:**
- Non pode gardar favoritos
- Non pode acceder á páxina de favoritos
- Non pode acceder ao panel de administración

### 3.2. Usuario Rexistrado
**Permisos:**
- Todos os permisos de Visitante Anónimo
- Gardar vehículos en favoritos
- Visualizar e xestionar a súa lista de favoritos
- Acceder ao seu perfil de usuario

**Restricións:**
- Non pode acceder ao panel de administración
- Non pode modificar información de vehículos

### 3.3. Administrador
**Permisos:**
- Todos os permisos de Usuario Rexistrado
- Acceder ao panel de administración
- Crear novos vehículos
- Editar vehículos existentes
- Eliminar vehículos
- Marcar vehículos como vendidos
- Xestionar imaxes de vehículos
- Visualizar estatísticas

**Identificación:**
- Campo `rol` na táboa de usuarios con valor 'admin'

---

## 4. Normativa

### 4.1. Ley Orgánica 3/2018 (LOPDGDD)

MCR Motors cumple coa **Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)** que adapta o marco xurídico español ao **Reglamento (UE) 2016/679 (GDPR)**.

**Medidas implementadas:**

1. **Información ao usuario:**
   - Aviso Legal accesible desde o footer
   - Política de Privacidade detallada
   - Información clara sobre o tratamento de datos

2. **Consentimento:**
   - Checkbox obrigatorio de aceptación de termos no rexistro
   - Checkbox de privacidade nos formularios de contacto
   - Consentimento explícito e inequívoco

3. **Dereitos dos usuarios:**
   - Dereito de acceso aos seus datos
   - Dereito de rectificación
   - Dereito de supresión ("dereito ao esquecemento")
   - Dereito de portabilidade
   - Dereito de oposición

4. **Seguridade:**
   - Contrasinais encriptados mediante bcrypt
   - Conexión HTTPS obrigatoria en produción
   - Validación e sanitización de todos os inputs
   - Protección contra SQL Injection mediante Prepared Statements
   - Protección contra XSS
   - Sesións seguras

5. **Responsable do tratamento:**
   - **Identidade:** MCR Motors
   - **Domicilio:** Calle 13 N°5 Sector C Pol. Industrial, San Ciprián De Viñas, Galicia, Spain 32901
   - **Correo electrónico:** info@mcrmotors.com
   - **Teléfono:** 617700519

6. **Finalidade do tratamento:**
   - Xestión de rexistros de usuarios
   - Xestión de favoritos
   - Atención de consultas mediante formularios
   - Comunicacións comerciais (só con consentimento)

7. **Conservación dos datos:**
   - Datos de usuarios: Mentres manteñan a conta activa
   - Consultas de contacto: 2 anos
   - Os usuarios poden solicitar eliminación en calquera momento

### 4.2. Lei de Servizos da Sociedade da Información (LSSI)

Cumprimento da **Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI)**:

- **Aviso Legal:** Información sobre a identidade do titular da web
- **Condicións de uso:** Regulación do uso da plataforma
- **Propiedade intelectual:** Reserva de dereitos sobre contidos

### 4.3. Normativa sobre Cookies

Cumprimento do **Real Decreto-ley 13/2012**:

- **Aviso de cookies:** Banner informativo ao acceder á web
- **Tipos de cookies:** Só cookies técnicas necesarias (sesión)
- **Política de cookies:** Documento específico accesible

### 4.4. Código de Comercio e normativa de consumo

- **Prezos:** Todos os prezos mostrados inclúen IVE
- **Información transparente:** Datos completos dos vehículos
- **Non hai compra online:** A transacción final realízase presencialmente

### 4.5. Normativa sectorial (Automoción)

- **Información obrigatoria:** Ano, quilometraxe, historial (se está dispoñible)
- **Vehículos de segunda man:** Indicación clara do estado
- **ITV:** Información sobre inspección técnica

**Declaración de cumprimento:**
MCR Motors declara que o proxecto cumpre con toda a normativa vixente aplicable tanto a nivel nacional (LOPDGDD, LSSI) como europeo (GDPR), implementando as medidas técnicas e organizativas necesarias para garantir a protección dos datos persoais dos usuarios e o cumprimento dos seus dereitos dixitais.

---

**Data de elaboración:** Decembro 2025  
**Autor:** Marcos Pepín  
**Versión:** 1.0
