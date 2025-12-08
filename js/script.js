document.addEventListener("DOMContentLoaded", () => {
  // Verificar sesión del usuario en todas las páginas
  checkUserSession();

  // Intro Screen Animation
  const introScreen = document.getElementById("intro-screen")

  // Hide intro screen after 0.5 seconds
  if (introScreen) {
    setTimeout(() => {
      introScreen.classList.add("fade-out")
      // Remove from DOM after animation completes
      setTimeout(() => {
        introScreen.style.display = "none"
      }, 500)
    }, 500)
  }

  // Dynamic Models based on Brand Selection
  const brandSelect = document.getElementById("marca")
  const modelSelect = document.getElementById("modelo")

  if (brandSelect && modelSelect) {
    // Car models by brand
    const carModels = {
      audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "RS6", "RS7", "TT"],
      bmw: [
        "Serie 1",
        "Serie 2",
        "Serie 3",
        "Serie 4",
        "Serie 5",
        "Serie 6",
        "Serie 7",
        "X1",
        "X3",
        "X5",
        "X6",
        "M3",
        "M4",
        "M5",
      ],
      mercedes: [
        "Clase A",
        "Clase B",
        "Clase C",
        "Clase E",
        "Clase S",
        "CLA",
        "CLS",
        "GLA",
        "GLC",
        "GLE",
        "AMG GT",
        "AMG C63",
        "AMG E63",
      ],
      porsche: ["911", "718 Boxster", "718 Cayman", "Panamera", "Taycan", "Macan", "Cayenne"],
      volkswagen: ["Polo", "Golf", "Passat", "Arteon", "T-Cross", "T-Roc", "Tiguan", "Touareg"],
    }

    // Update models when brand changes
    brandSelect.addEventListener("change", function () {
      const brand = this.value

      // Clear current options
      modelSelect.innerHTML = '<option value="">Modelo</option>'

      // If a brand is selected, populate models
      if (brand && carModels[brand]) {
        carModels[brand].forEach((model) => {
          const option = document.createElement("option")
          option.value = model.toLowerCase().replace(" ", "-")
          option.textContent = model
          modelSelect.appendChild(option)
        })
      }
    })
  }

  // Search Form Submission
  const searchForm = document.getElementById("search-form")

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const brand = document.getElementById("marca").value
      const model = document.getElementById("modelo").value
      const price = document.getElementById("precio-max").value
      const year = document.getElementById("ano").value

      // Build query string
      let queryString = ""
      if (brand) queryString += `marca=${brand}&`
      if (model) queryString += `modelo=${model}&`
      if (price) queryString += `precio=${price}&`
      if (year) queryString += `ano=${year}&`

      // Redirect to search results page
      window.location.href = `coches-venta.html?${queryString}`
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Initialize animation on scroll
  const animateElements = document.querySelectorAll(".animate-fadeIn")

  function checkIfInView() {
    const windowHeight = window.innerHeight
    const windowTopPosition = window.scrollY
    const windowBottomPosition = windowTopPosition + windowHeight

    animateElements.forEach((element) => {
      const elementHeight = element.offsetHeight
      const elementTopPosition = element.offsetTop
      const elementBottomPosition = elementTopPosition + elementHeight

      // Check if element is in viewport
      if (elementBottomPosition >= windowTopPosition && elementTopPosition <= windowBottomPosition) {
        element.classList.add("visible")
      }
    })
  }

  // Check elements on load
  window.addEventListener("load", checkIfInView)
  // Check elements on scroll
  window.addEventListener("scroll", checkIfInView)
})

// Función para verificar sesión del usuario
async function checkUserSession() {
  try {
    const response = await fetch('php/auth.php?action=check_session');
    const data = await response.json();
    
    const authButtons = document.getElementById('auth-buttons');
    
    if (data.authenticated && authButtons) {
      authButtons.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <i class="fas fa-user me-1"></i>${data.user.nombre}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="favoritos.html"><i class="fas fa-heart me-2"></i>Mis Favoritos</a></li>
            ${data.user.rol === 'admin' ? '<li><a class="dropdown-item" href="admin.html"><i class="fas fa-cog me-2"></i>Panel Admin</a></li>' : ''}
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
          </ul>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al verificar sesión:', error);
  }
}

// Función para cerrar sesión
async function logout() {
  try {
    await fetch('php/auth.php?action=logout');
    window.location.reload();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}


