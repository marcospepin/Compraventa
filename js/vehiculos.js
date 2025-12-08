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
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="card car-card h-100" style="cursor: pointer;" onclick="showVehicleModal(${vehicle.id})">
                <div class="car-image-wrapper position-relative">
                    <img src="${imageUrl}" class="card-img-top" alt="${vehicle.marca} ${vehicle.modelo}" onerror="this.src='https://via.placeholder.com/800x500?text=Sin+Imagen'">
                    <span class="car-price">${precio} €</span>
                    <button class="btn btn-favorito ${currentUser ? '' : 'btn-login-required'}" data-vehicle-id="${vehicle.id}" title="${currentUser ? 'Anadir a favoritos' : 'Inicia sesion para anadir a favoritos'}" onclick="event.stopPropagation();">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${vehicle.marca} ${vehicle.modelo}</h5>
                    <p class="card-text text-muted">${vehicle.anio} | ${kilometraje} km | ${vehicle.combustible.charAt(0).toUpperCase() + vehicle.combustible.slice(1)}</p>
                    <div class="car-features">
                        <span><i class="fas fa-calendar"></i> ${vehicle.anio}</span>
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
        order: document.getElementById('sort-by')?.value || 'fecha_registro DESC'
    };
    
    loadVehicles(filters);
}

// Inicializar al cargar la pagina
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando aplicacion...');
    await checkSession();
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
            document.getElementById('modal-vehicle-color').textContent = vehicle.color || 'No especificado';
            document.getElementById('modal-vehicle-status').textContent = vehicle.estado === 'disponible' ? 'Disponible' : vehicle.estado.charAt(0).toUpperCase() + vehicle.estado.slice(1);
            document.getElementById('modal-vehicle-description').textContent = vehicle.descripcion || 'Sin descripción disponible.';
            
            // Crear galeria de imagenes
            const carouselInner = document.getElementById('carousel-inner');
            const carouselIndicators = document.getElementById('carousel-indicators');
            
            // Imagenes del vehiculo (por ahora usamos la imagen principal y placeholders)
            const images = [
                vehicle.imagen_url || 'https://via.placeholder.com/800x500?text=Sin+Imagen',
                vehicle.imagen_url || 'https://via.placeholder.com/800x500?text=Vista+Lateral',
                vehicle.imagen_url || 'https://via.placeholder.com/800x500?text=Interior',
                vehicle.imagen_url || 'https://via.placeholder.com/800x500?text=Motor'
            ];
            
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
                carouselIndicators.appendChild(indicator);
                
                // Crear item del carousel
                const item = document.createElement('div');
                item.className = index === 0 ? 'carousel-item active' : 'carousel-item';
                item.innerHTML = `<img src="${img}" class="d-block w-100" alt="${vehicle.marca} ${vehicle.modelo}" onerror="this.src='https://via.placeholder.com/800x500?text=Sin+Imagen'">`;
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
