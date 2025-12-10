// Script para cargar vehiculos dinamicamente desde la base de datos
let currentUser = null;
let allVehicles = [];
let currentPage = 1;
const vehiclesPerPage = 9;

// Verificar sesion del usuario
async function checkSession() {
    try {
        const response = await fetch('php/auth.php?action=check_session');
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            updateAuthUI();
        }
    } catch (error) {
        console.error('Error al verificar sesion:', error);
    }
}

// Actualizar interfaz de autenticacion
function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    
    if (currentUser) {
        authButtons.innerHTML = `
            <div class="dropdown">
              <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>${currentUser.nombre}
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="favoritos.html"><i class="fas fa-heart me-2"></i>Mis Favoritos</a></li>
                ${currentUser.rol === 'admin' ? '<li><a class="dropdown-item" href="admin.html"><i class="fas fa-cog me-2"></i>Panel Admin</a></li>' : ''}
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesion</a></li>
              </ul>
            </div>
        `;
    }
}

// Cerrar sesion
async function logout() {
    try {
        await fetch('php/auth.php?action=logout');
        window.location.reload();
    } catch (error) {
        console.error('Error al cerrar sesion:', error);
    }
}

// Cargar vehiculos desde la base de datos
async function loadVehicles(filters = {}) {
    const container = document.getElementById('vehicles-container');
    const countElement = document.getElementById('vehicles-count');
    
    if (!container) {
        console.error('No se encontro el contenedor de vehiculos');
        return;
    }
    
    container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    try {
        const params = new URLSearchParams(filters);
        console.log('Cargando vehiculos con filtros:', filters);
        
        const response = await fetch(`php/vehiculos.php?action=list&${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Respuesta de la API:', data);
        
        if (data.success) {
            allVehicles = data.vehiculos;
            
            // Actualizar marcas y modelos en cada carga
            updateBrandsAndModels(allVehicles);
            
            if (allVehicles.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="fas fa-car fa-4x text-muted mb-3"></i>
                        <h3>No se encontraron vehiculos</h3>
                        <p class="text-muted">Intenta cambiar los filtros de busqueda</p>
                    </div>
                `;
                if (countElement) {
                    countElement.textContent = 'No hay vehiculos disponibles';
                }
                return;
            }
            
            if (countElement) {
                countElement.textContent = `Mostrando ${allVehicles.length} vehiculo${allVehicles.length !== 1 ? 's' : ''}`;
            }
            currentPage = 1;
            renderVehicles(allVehicles);
            updatePagination();
        } else {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
                    <h3>Error al cargar vehiculos</h3>
                    <p class="text-muted">${data.message || 'Intenta recargar la pagina'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar vehiculos:', error);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-circle fa-4x text-danger mb-3"></i>
                <h3>Error de conexion</h3>
                <p class="text-muted">No se pudo conectar con el servidor</p>
                <p class="text-muted small">Error: ${error.message}</p>
                <button class="btn btn-primary mt-3" onclick="loadVehicles()">Reintentar</button>
            </div>
        `;
    }
}

// Renderizar vehiculos en el DOM
function renderVehicles(vehicles) {
    const container = document.getElementById('vehicles-container');
    container.innerHTML = '';
    
    // Calcular vehiculos a mostrar en la pagina actual
    const startIndex = (currentPage - 1) * vehiclesPerPage;
    const endIndex = startIndex + vehiclesPerPage;
    const vehiclesToShow = vehicles.slice(startIndex, endIndex);
    
    vehiclesToShow.forEach(vehicle => {
        const card = createVehicleCard(vehicle);
        container.innerHTML += card;
    });
    
    // Agregar event listeners a los botones de favoritos
    document.querySelectorAll('.btn-favorito').forEach(btn => {
        btn.addEventListener('click', handleFavoriteClick);
    });
}

// Crear tarjeta HTML para un vehiculo
function createVehicleCard(vehicle) {
    const imageUrl = vehicle.imagen_url || 'https://via.placeholder.com/800x500?text=Sin+Imagen';
    const precio = parseFloat(vehicle.precio).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const kilometraje = vehicle.kilometraje ? parseInt(vehicle.kilometraje).toLocaleString('es-ES') : 'N/D';
    
    // Iconos segun el combustible
    const combustibleIcon = {
        'gasolina': 'fa-gas-pump',
        'diesel': 'fa-gas-pump',
        'hibrido': 'fa-leaf',
        'electrico': 'fa-bolt'
    };
    
    const icon = combustibleIcon[vehicle.combustible] || 'fa-gas-pump';
    
    // Botón de editar solo para administradores
    const editButton = currentUser && currentUser.rol === 'admin' ? 
        `<button class="btn btn-edit-vehicle position-absolute" data-vehicle-id="${vehicle.id}" title="Editar vehículo" onclick="event.stopPropagation(); window.location.href='admin.html?edit=${vehicle.id}';" style="top: 10px; left: 10px; z-index: 10; background: rgba(47, 103, 255, 0.9); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: all 0.3s;">
            <i class="fas fa-pencil-alt"></i>
        </button>` : '';
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="card car-card h-100" style="cursor: pointer;" onclick="showVehicleModal(${vehicle.id})">
                <div class="car-image-wrapper position-relative">
                    ${editButton}
                    <img src="${imageUrl}" class="card-img-top" alt="${vehicle.marca} ${vehicle.modelo}" onerror="this.src='https://via.placeholder.com/800x500?text=Sin+Imagen'">
                    <span class="car-price">${precio} €</span>
                    <button class="btn btn-favorito ${currentUser ? '' : 'btn-login-required'}" data-vehicle-id="${vehicle.id}" title="${currentUser ? 'Anadir a favoritos' : 'Inicia sesion para anadir a favoritos'}" onclick="event.stopPropagation();">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${vehicle.marca} ${vehicle.modelo}</h5>
                    <p class="card-text text-muted">${vehicle.anio} | ${kilometraje} km</p>
                    <div class="car-features">
                        <span><i class="fas fa-tachometer-alt"></i> ${vehicle.potencia || 0} CV</span>
                        <span><i class="fas ${icon}"></i> ${vehicle.combustible.charAt(0).toUpperCase() + vehicle.combustible.slice(1)}</span>
                        <span><i class="fas fa-cog"></i> ${vehicle.transmision.charAt(0).toUpperCase() + vehicle.transmision.slice(1)}</span>
                    </div>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick="showVehicleModal(${vehicle.id}); event.stopPropagation();">Ver Detalles</button>
                        <a href="contacto.html" class="btn btn-primary btn-sm" onclick="event.stopPropagation();">Contactar</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Manejar clic en boton de favoritos
async function handleFavoriteClick(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const vehicleId = btn.dataset.vehicleId;
    
    // Si no hay sesion, redirigir a login
    if (!currentUser) {
        const currentPage = window.location.pathname;
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        return;
    }
    
    // Cambiar estado visual temporalmente
    const icon = btn.querySelector('i');
    const wasFavorite = icon.classList.contains('fas');
    
    btn.disabled = true;
    
    try {
        const response = await fetch('php/favoritos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'toggle',
                vehiculo_id: vehicleId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Cambiar icono
            if (data.action === 'added') {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.title = 'Quitar de favoritos';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.title = 'Anadir a favoritos';
            }
            
            // Mostrar notificacion
            showNotification(data.message, 'success');
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al procesar la solicitud', 'error');
    } finally {
        btn.disabled = false;
    }
}

// Mostrar notificacion
function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-danger' : 'alert-info';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alert.style.zIndex = '9999';
    alert.innerHTML = `
        <i class="fas ${icon} me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Manejar filtros
function setupFilters() {
    const filterForm = document.getElementById('filter-form');
    const sortBy = document.getElementById('sort-by');
    
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', () => {
            applyFilters();
        });
    }
}

// Aplicar filtros
function applyFilters() {
    const filters = {
        marca: document.getElementById('filter-marca')?.value || '',
        modelo: document.getElementById('filter-modelo')?.value || '',
        precio_min: document.getElementById('filter-precio-min')?.value || '',
        precio_max: document.getElementById('filter-precio-max')?.value || '',
        anio: document.getElementById('filter-ano')?.value || '',
        potencia: document.getElementById('filter-potencia')?.value || '',
        order: document.getElementById('sort-by')?.value || 'fecha_registro DESC'
    };
    
    loadVehicles(filters);
}

// Cargar marcas y modelos únicos desde la base de datos
async function loadBrandsAndModels() {
    try {
        const response = await fetch('php/vehiculos.php?action=list');
        const data = await response.json();
        
        if (data.success && data.vehiculos) {
            updateBrandsAndModels(data.vehiculos);
        }
    } catch (error) {
        console.error('Error al cargar marcas y modelos:', error);
    }
}

// Actualizar datalists con marcas y modelos únicos
function updateBrandsAndModels(vehiculos) {
    // Obtener marcas únicas desde la BD
    const marcasSet = new Set(vehiculos.map(v => v.marca).filter(Boolean));
    const marcasBD = Array.from(marcasSet);
    
    // Marcas predefinidas
    const predefinidas = ['Audi', 'BMW', 'Ford', 'Mercedes', 'Peugeot', 'Porsche', 'Renault', 'Seat', 'Toyota', 'Volkswagen'];
    
    // Combinar todas las marcas (predefinidas + BD) y eliminar duplicados
    const todasMarcas = [...new Set([...predefinidas, ...marcasBD])];
    
    // Ordenar alfabéticamente
    todasMarcas.sort((a, b) => a.localeCompare(b, 'es'));
    
    const marcasList = document.getElementById('marcas-list');
    if (marcasList) {
        // Crear HTML con todas las marcas ordenadas
        marcasList.innerHTML = todasMarcas.map(marca => `<option value="${marca}">`).join('\n            ');
    }
    
    // Hacer lo mismo con los modelos
    const modelosSet = new Set(vehiculos.map(v => v.modelo).filter(Boolean));
    const modelosBD = Array.from(modelosSet);
    
    // Modelos predefinidos
    const predefinidosModelos = ['911', 'A3', 'A4', 'Cayenne', 'Clase A', 'Clase C', 'Golf', 'Passat', 'Serie 3', 'Serie 5'];
    
    // Combinar todos los modelos (predefinidos + BD) y eliminar duplicados
    const todosModelos = [...new Set([...predefinidosModelos, ...modelosBD])];
    
    // Ordenar alfabéticamente
    todosModelos.sort((a, b) => a.localeCompare(b, 'es'));
    
    const modelosList = document.getElementById('modelos-list');
    if (modelosList) {
        // Crear HTML con todos los modelos ordenados
        modelosList.innerHTML = todosModelos.map(modelo => `<option value="${modelo}">`).join('\n            ');
    }
}

// Inicializar al cargar la pagina
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando aplicacion...');
    await checkSession();
    await loadBrandsAndModels();
    setupFilters();
    loadVehicles();
});

// Actualizar paginacion
function updatePagination() {
    const totalPages = Math.ceil(allVehicles.length / vehiclesPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) {
            paginationContainer.parentElement.parentElement.style.display = 'none';
        }
        return;
    }
    
    paginationContainer.parentElement.parentElement.style.display = 'block';
    paginationContainer.innerHTML = '';
    
    // Boton Anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>Anterior</a>`;
    if (currentPage > 1) {
        prevLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPage--;
            renderVehicles(allVehicles);
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    paginationContainer.appendChild(prevLi);
    
    // Numeros de pagina
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        firstLi.innerHTML = '<a class="page-link" href="#">1</a>';
        firstLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = 1;
            renderVehicles(allVehicles);
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(firstLi);
        
        if (startPage > 2) {
            const dotsLi = document.createElement('li');
            dotsLi.className = 'page-item disabled';
            dotsLi.innerHTML = '<a class="page-link" href="#">...</a>';
            paginationContainer.appendChild(dotsLi);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        if (i !== currentPage) {
            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                renderVehicles(allVehicles);
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        paginationContainer.appendChild(li);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dotsLi = document.createElement('li');
            dotsLi.className = 'page-item disabled';
            dotsLi.innerHTML = '<a class="page-link" href="#">...</a>';
            paginationContainer.appendChild(dotsLi);
        }
        
        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        lastLi.innerHTML = `<a class="page-link" href="#">${totalPages}</a>`;
        lastLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = totalPages;
            renderVehicles(allVehicles);
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(lastLi);
    }
    
    // Boton Siguiente
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" ${currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>Siguiente</a>`;
    if (currentPage < totalPages) {
        nextLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPage++;
            renderVehicles(allVehicles);
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    paginationContainer.appendChild(nextLi);
}

// Mostrar modal de detalles del vehiculo
async function showVehicleModal(vehicleId) {
    try {
        const response = await fetch(`php/vehiculos.php?action=get&id=${vehicleId}`);
        const data = await response.json();
        
        if (data.success && data.vehiculo) {
            const vehicle = data.vehiculo;
            const modal = new bootstrap.Modal(document.getElementById('vehicleModal'));
            
            // Actualizar titulo y precio
            document.getElementById('modal-vehicle-name').textContent = `${vehicle.marca} ${vehicle.modelo}`;
            document.getElementById('modal-vehicle-price').textContent = `${parseFloat(vehicle.precio).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
            
            // Actualizar especificaciones
            document.getElementById('modal-vehicle-year').textContent = vehicle.anio;
            document.getElementById('modal-vehicle-km').textContent = vehicle.kilometraje ? `${parseInt(vehicle.kilometraje).toLocaleString('es-ES')} km` : 'N/D';
            document.getElementById('modal-vehicle-fuel').textContent = vehicle.combustible.charAt(0).toUpperCase() + vehicle.combustible.slice(1);
            document.getElementById('modal-vehicle-transmission').textContent = vehicle.transmision.charAt(0).toUpperCase() + vehicle.transmision.slice(1);
            document.getElementById('modal-vehicle-potencia').textContent = vehicle.potencia ? `${vehicle.potencia} CV` : 'No especificado';
            document.getElementById('modal-vehicle-status').textContent = vehicle.estado === 'disponible' ? 'Disponible' : vehicle.estado.charAt(0).toUpperCase() + vehicle.estado.slice(1);
            
            // Descripción con saltos de línea preservados
            const descripcionElement = document.getElementById('modal-vehicle-description');
            const descripcionTexto = vehicle.descripcion || 'Sin descripción disponible.';
            descripcionElement.innerHTML = descripcionTexto.replace(/\n/g, '<br>');
            
            // Crear galeria de imagenes
            const carouselInner = document.getElementById('carousel-inner');
            const carouselIndicators = document.getElementById('carousel-indicators');
            
            // Cargar imágenes del vehículo desde la base de datos
            let images = [];
            try {
                const imagesResponse = await fetch(`php/vehiculos.php?action=get_images&vehiculo_id=${vehicleId}`);
                const imagesData = await imagesResponse.json();
                
                if (imagesData.success && imagesData.imagenes && imagesData.imagenes.length > 0) {
                    images = imagesData.imagenes;
                } else {
                    // Si no hay imágenes en la tabla, usar la imagen principal
                    images = [vehicle.imagen_url || 'https://via.placeholder.com/800x500?text=Sin+Imagen'];
                }
            } catch (error) {
                console.error('Error loading images:', error);
                images = [vehicle.imagen_url || 'https://via.placeholder.com/800x500?text=Sin+Imagen'];
            }
            
            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';
            
            images.forEach((img, index) => {
                // Crear indicador
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#vehicleCarousel');
                indicator.setAttribute('data-bs-slide-to', index);
                if (index === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-label', `Imagen ${index + 1}`);
                indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
                carouselIndicators.appendChild(indicator);
                
                // Crear item del carousel
                const item = document.createElement('div');
                item.className = index === 0 ? 'carousel-item active' : 'carousel-item';
                const imgElement = document.createElement('img');
                imgElement.src = img;
                imgElement.className = 'd-block w-100';
                imgElement.alt = `${vehicle.marca} ${vehicle.modelo}`;
                imgElement.style.cursor = 'pointer';
                imgElement.onerror = function() {
                    this.src = 'https://via.placeholder.com/800x500?text=Sin+Imagen';
                };
                imgElement.onclick = function() {
                    openImageLightbox(images, index);
                };
                item.appendChild(imgElement);
                carouselInner.appendChild(item);
            });
            
            // Configurar boton de favoritos
            const favBtn = document.getElementById('modal-btn-favorito');
            favBtn.setAttribute('data-vehicle-id', vehicleId);
            favBtn.onclick = async function(e) {
                e.preventDefault();
                if (!currentUser) {
                    window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
                    return;
                }
                
                try {
                    const response = await fetch('php/favoritos.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'toggle',
                            vehiculo_id: vehicleId
                        })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        const icon = favBtn.querySelector('i');
                        if (data.action === 'added') {
                            icon.classList.remove('far');
                            icon.classList.add('fas');
                            favBtn.innerHTML = '<i class="fas fa-heart me-2"></i>Quitar de Favoritos';
                        } else {
                            icon.classList.remove('fas');
                            icon.classList.add('far');
                            favBtn.innerHTML = '<i class="far fa-heart me-2"></i>Añadir a Favoritos';
                        }
                        showNotification(data.message, 'success');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showNotification('Error al procesar la solicitud', 'error');
                }
            };
            
            modal.show();
        } else {
            showNotification('Error al cargar los detalles del vehículo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar los detalles del vehículo', 'error');
    }
}

// Función para abrir imagen en lightbox
let lightboxImages = [];
let currentLightboxIndex = 0;

function openImageLightbox(images, startIndex) {
    lightboxImages = images;
    currentLightboxIndex = startIndex;
    
    // Crear el lightbox si no existe
    let lightbox = document.getElementById('image-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'image-lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const img = document.createElement('img');
        img.id = 'lightbox-image';
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
            transition: opacity 0.2s ease;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            background: transparent;
            border: none;
            color: white;
            font-size: 50px;
            font-weight: 300;
            cursor: pointer;
            z-index: 10001;
            transition: transform 0.2s ease;
        `;
        closeBtn.onmouseover = function() {
            this.style.transform = 'scale(1.2)';
        };
        closeBtn.onmouseout = function() {
            this.style.transform = 'scale(1)';
        };
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            closeLightbox();
        };
        
        // Botón anterior
        const prevBtn = document.createElement('button');
        prevBtn.id = 'lightbox-prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.style.cssText = `
            position: absolute;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10001;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        prevBtn.onmouseover = function() {
            this.style.background = 'rgba(255, 255, 255, 0.4)';
            this.style.transform = 'translateY(-50%) scale(1.1)';
        };
        prevBtn.onmouseout = function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.transform = 'translateY(-50%)';
        };
        prevBtn.onclick = function(e) {
            e.stopPropagation();
            showPreviousImage();
        };
        
        // Botón siguiente
        const nextBtn = document.createElement('button');
        nextBtn.id = 'lightbox-next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.style.cssText = `
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10001;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        nextBtn.onmouseover = function() {
            this.style.background = 'rgba(255, 255, 255, 0.4)';
            this.style.transform = 'translateY(-50%) scale(1.1)';
        };
        nextBtn.onmouseout = function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.transform = 'translateY(-50%)';
        };
        nextBtn.onclick = function(e) {
            e.stopPropagation();
            showNextImage();
        };
        
        // Contador de imágenes
        const counter = document.createElement('div');
        counter.id = 'lightbox-counter';
        counter.style.cssText = `
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 16px;
            background: rgba(0, 0, 0, 0.5);
            padding: 8px 16px;
            border-radius: 20px;
            z-index: 10001;
        `;
        
        lightbox.appendChild(img);
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(prevBtn);
        lightbox.appendChild(nextBtn);
        lightbox.appendChild(counter);
        document.body.appendChild(lightbox);
        
        // Cerrar al hacer click en el fondo
        lightbox.onclick = function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        };
        
        // Navegación con teclado
        document.addEventListener('keydown', handleLightboxKeydown);
    }
    
    // Mostrar la imagen actual
    updateLightboxImage();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Fade in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
}

function updateLightboxImage() {
    const img = document.getElementById('lightbox-image');
    const counter = document.getElementById('lightbox-counter');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    // Fade out
    img.style.opacity = '0';
    
    setTimeout(() => {
        img.src = lightboxImages[currentLightboxIndex];
        counter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
        
        // Mostrar/ocultar botones si solo hay una imagen
        if (lightboxImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
        
        // Fade in
        img.style.opacity = '1';
    }, 200);
}

function showPreviousImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
}

function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightboxImage();
}

function handleLightboxKeydown(e) {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox && lightbox.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}
