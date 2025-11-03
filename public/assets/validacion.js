// **DATOS DE REGIONES Y COMUNAS**
const regionesYComunas = {
  "Región Metropolitana de Santiago": [
    "Santiago",
    "Las Condes",
    "Providencia",
    "Ñuñoa",
    "La Reina",
    "Vitacura",
    "Lo Barnechea",
    "Maipú",
    "La Florida",
    "Peñalolén",
  ],
  "Región de la Araucanía": [
    "Temuco",
    "Villarrica",
    "Pucón",
    "Angol",
    "Nueva Imperial",
    "Carahue",
    "Pitrufquén",
    "Lautaro",
    "Traiguén",
    "Collipulli",
  ],
  "Región de Ñuble": [
    "Chillán",
    "San Carlos",
    "Quirihue",
    "Bulnes",
    "Yungay",
    "Coelemu",
    "El Carmen",
    "Pemuco",
    "Quillón",
    "Ninhue",
  ],
};

// **FUNCIONES DE NAVEGACIÓN**
function showLogin() {
  document.getElementById("loginForm").classList.add("active");
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("header-title").textContent = "Iniciar Sesión";
  clearAlerts();
}

function showRegister() {
  document.getElementById("registerForm").classList.add("active");
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("header-title").textContent = "Registro de Usuario";
  clearAlerts();
}

// **CARGAR REGIONES AL INICIAR**
function loadRegiones() {
  const regionSelect = document.getElementById("region");
  Object.keys(regionesYComunas).forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });
}

// **CARGAR COMUNAS SEGÚN REGIÓN**
document.getElementById("region").addEventListener("change", function () {
  const comunaSelect = document.getElementById("comuna");
  const selectedRegion = this.value;

  // Limpiar comunas
  comunaSelect.innerHTML =
    '<option value="">-- Selecciona la comuna --</option>';

  if (selectedRegion && regionesYComunas[selectedRegion]) {
    regionesYComunas[selectedRegion].forEach((comuna) => {
      const option = document.createElement("option");
      option.value = comuna;
      option.textContent = comuna;
      comunaSelect.appendChild(option);
    });
  }
});

// **VALIDACIONES**
function validateEmail(email) {
  const validDomains = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  return validDomains.some((domain) => email.endsWith(domain));
}

function validatePassword(password) {
  return password.length >= 4 && password.length <= 10;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  const inputElement = document.getElementById(elementId.replace("Error", ""));

  errorElement.textContent = message;
  errorElement.style.display = "block";
  inputElement.classList.add("input-error");
  inputElement.classList.remove("input-success");
}

function showSuccess(elementId) {
  const errorElement = document.getElementById(elementId);
  const inputElement = document.getElementById(elementId.replace("Error", ""));

  errorElement.style.display = "none";
  inputElement.classList.remove("input-error");
  inputElement.classList.add("input-success");
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((error) => {
    error.style.display = "none";
  });
  document.querySelectorAll("input, select").forEach((input) => {
    input.classList.remove("input-error", "input-success");
  });
}

function showAlert(containerId, message, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function clearAlerts() {
  document.getElementById("loginAlert").innerHTML = "";
  document.getElementById("registerAlert").innerHTML = "";
}

// **VALIDACIONES EN TIEMPO REAL**
document.getElementById("loginEmail").addEventListener("blur", function () {
  if (this.value && !validateEmail(this.value)) {
    showError(
      "loginEmailError",
      "Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com"
    );
  } else if (this.value) {
    showSuccess("loginEmailError");
  }
});

document.getElementById("registerEmail").addEventListener("blur", function () {
  if (this.value && !validateEmail(this.value)) {
    showError(
      "registerEmailError",
      "Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com"
    );
  } else if (this.value) {
    showSuccess("registerEmailError");
  }
});

document.getElementById("loginPassword").addEventListener("blur", function () {
  if (this.value && !validatePassword(this.value)) {
    showError(
      "loginPasswordError",
      "La contraseña debe tener entre 4 y 10 caracteres"
    );
  } else if (this.value) {
    showSuccess("loginPasswordError");
  }
});

document
  .getElementById("registerPassword")
  .addEventListener("blur", function () {
    if (this.value && !validatePassword(this.value)) {
      showError(
        "registerPasswordError",
        "La contraseña debe tener entre 4 y 10 caracteres"
      );
    } else if (this.value) {
      showSuccess("registerPasswordError");
    }
  });

document
  .getElementById("confirmPassword")
  .addEventListener("blur", function () {
    const password = document.getElementById("registerPassword").value;
    if (this.value && this.value !== password) {
      showError("confirmPasswordError", "Las contraseñas no coinciden");
    } else if (this.value) {
      showSuccess("confirmPasswordError");
    }
  });

// **MANEJO DEL REGISTRO**
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    clearAlerts();

    const formData = new FormData(this);
    const userData = {};

    formData.forEach((value, key) => {
      userData[key] = value;
    });

    // Validaciones
    let hasErrors = false;

    if (!userData.fullName.trim()) {
      showError("fullNameError", "El nombre completo es requerido");
      hasErrors = true;
    }

    if (!validateEmail(userData.email)) {
      showError(
        "registerEmailError",
        "Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com"
      );
      hasErrors = true;
    }

    if (!validatePassword(userData.password)) {
      showError(
        "registerPasswordError",
        "La contraseña debe tener entre 4 y 10 caracteres"
      );
      hasErrors = true;
    }

    if (userData.password !== userData.confirmPassword) {
      showError("confirmPasswordError", "Las contraseñas no coinciden");
      hasErrors = true;
    }

    if (!userData.region) {
      showError("regionError", "Selecciona una región");
      hasErrors = true;
    }

    if (!userData.comuna) {
      showError("comunaError", "Selecciona una comuna");
      hasErrors = true;
    }

    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((user) => user.email === userData.email)) {
      showAlert(
        "registerAlert",
        "Ya existe un usuario con este correo electrónico",
        "error"
      );
      hasErrors = true;
    }

    if (hasErrors) return;

    // Guardar usuario en localStorage
    delete userData.confirmPassword; // No guardar la confirmación
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    showAlert(
      "registerAlert",
      "¡Registro exitoso! Ahora puedes iniciar sesión.",
      "success"
    );

    // Limpiar formulario
    this.reset();
    clearErrors();

    // Cambiar a login después de 2 segundos
    setTimeout(() => {
      showLogin();
    }, 2000);
  });

// **MANEJO DEL LOGIN**
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();
  clearAlerts();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Validaciones
  let hasErrors = false;

  if (!validateEmail(email)) {
    showError(
      "loginEmailError",
      "Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com"
    );
    hasErrors = true;
  }

  if (!validatePassword(password)) {
    showError(
      "loginPasswordError",
      "La contraseña debe tener entre 4 y 10 caracteres"
    );
    hasErrors = true;
  }

  if (hasErrors) return;

  // Verificar credenciales
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Login exitoso
    localStorage.setItem("currentUser", JSON.stringify(user));
    showAlert("loginAlert", `¡Bienvenido ${user.fullName}!`, "success");

    
    setTimeout(() => {
      alert(
        `Login exitoso! Bienvenido ${user.fullName}\nRegión: ${user.region}\nComuna: ${user.comuna}`
      );
    }, 1500);
  } else {
    showAlert("loginAlert", "Correo o contraseña incorrectos", "error");
  }
});

// **INICIALIZACIÓN**
document.addEventListener("DOMContentLoaded", function () {
  loadRegiones();

  // Verificar si hay un usuario logueado
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    const user = JSON.parse(currentUser);
    showAlert(
      "loginAlert",
      `Ya tienes una sesión activa como ${user.fullName}`,
      "success"
    );
  }
});

const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

function showLogin() {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
}
function showRegister() {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
}
tabLogin.addEventListener("click", showLogin);
tabRegister.addEventListener("click", showRegister);
if (goRegister)
  goRegister.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  });
if (goLogin)
  goLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

// validación nativa + bootstrap styles
document.querySelectorAll("form.needs-validation").forEach((form) => {
  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }
    form.classList.add("was-validated");
  });
});
