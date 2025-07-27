// JSON მონაცემები slider-ისთვის
import { sliderData } from "./constants/data.js";

// Modal ფუნქციები
function openModal(type) {
  const modal = document.getElementById(type + "Modal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(type) {
  const modal = document.getElementById(type + "Modal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 300);
}

// Validation Functions
const ValidationUtils = {
  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation
  validatePassword(password) {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    let strength = "weak";

    if (score >= 5) strength = "strong";
    else if (score >= 4) strength = "good";
    else if (score >= 3) strength = "fair";

    return { requirements, strength, score };
  },

  // Name validation
  validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  },

  // Show error message
  showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);

    input.classList.add("error");
    input.classList.remove("success");
    errorDiv.textContent = message;
    errorDiv.classList.add("show");
  },

  // Show success message
  showSuccess(inputId, successId, message = "") {
    const input = document.getElementById(inputId);
    const successDiv = document.getElementById(successId);

    input.classList.add("success");
    input.classList.remove("error");

    if (successDiv && message) {
      successDiv.textContent = message;
      successDiv.classList.add("show");
    }
  },

  // Clear validation
  clearValidation(inputId, errorId, successId = null) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    const successDiv = successId ? document.getElementById(successId) : null;

    input.classList.remove("error", "success");
    errorDiv.classList.remove("show");
    if (successDiv) successDiv.classList.remove("show");
  },
};

// Password Strength Indicator
function updatePasswordStrength(password) {
  const validation = ValidationUtils.validatePassword(password);
  const strengthFill = document.getElementById("strengthFill");
  const strengthText = document.getElementById("strengthText");
  const passwordStrength = document.getElementById("passwordStrength");

  if (password.length === 0) {
    passwordStrength.classList.remove("show");
    return;
  }

  passwordStrength.classList.add("show");

  // Update strength bar
  strengthFill.className = `strength-fill ${validation.strength}`;

  // Update strength text
  const strengthTexts = {
    weak: "Weak password",
    fair: "Fair password",
    good: "Good password",
    strong: "Strong password",
  };

  strengthText.textContent = strengthTexts[validation.strength];
  strengthText.className = `strength-text ${validation.strength}`;

  // Update requirements
  const requirements = [
    "length",
    "uppercase",
    "lowercase",
    "number",
    "special",
  ];
  requirements.forEach((req) => {
    const element = document.getElementById(`${req}Req`);
    if (validation.requirements[req]) {
      element.classList.add("met");
    } else {
      element.classList.remove("met");
    }
  });
}

// Real-time validation setup
function setupValidation() {
  // Login validation
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  loginEmail.addEventListener("blur", () => {
    const email = loginEmail.value.trim();
    if (email && !ValidationUtils.validateEmail(email)) {
      ValidationUtils.showError(
        "loginEmail",
        "loginEmailError",
        "Please enter a valid email address"
      );
    } else if (email) {
      ValidationUtils.clearValidation("loginEmail", "loginEmailError");
      loginEmail.classList.add("success");
    }
  });

  loginEmail.addEventListener("input", () => {
    if (loginEmail.classList.contains("error")) {
      ValidationUtils.clearValidation("loginEmail", "loginEmailError");
    }
  });

  loginPassword.addEventListener("input", () => {
    if (loginPassword.classList.contains("error")) {
      ValidationUtils.clearValidation("loginPassword", "loginPasswordError");
    }
  });

  // Register validation
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const registerConfirmPassword = document.getElementById(
    "registerConfirmPassword"
  );

  registerName.addEventListener("blur", () => {
    const name = registerName.value.trim();
    if (name && !ValidationUtils.validateName(name)) {
      ValidationUtils.showError(
        "registerName",
        "registerNameError",
        "Name must be at least 2 characters and contain only letters"
      );
    } else if (name) {
      ValidationUtils.clearValidation("registerName", "registerNameError");
      registerName.classList.add("success");
    }
  });

  registerEmail.addEventListener("blur", () => {
    const email = registerEmail.value.trim();
    if (email && !ValidationUtils.validateEmail(email)) {
      ValidationUtils.showError(
        "registerEmail",
        "registerEmailError",
        "Please enter a valid email address"
      );
    } else if (email) {
      ValidationUtils.clearValidation(
        "registerEmail",
        "registerEmailError",
        "registerEmailSuccess"
      );
      ValidationUtils.showSuccess(
        "registerEmail",
        "registerEmailSuccess",
        "Valid email address"
      );
    }
  });

  registerPassword.addEventListener("input", () => {
    const password = registerPassword.value;
    updatePasswordStrength(password);

    if (registerPassword.classList.contains("error")) {
      ValidationUtils.clearValidation(
        "registerPassword",
        "registerPasswordError"
      );
    }

    // Check confirm password match if it has value
    const confirmPassword = registerConfirmPassword.value;
    if (confirmPassword) {
      validatePasswordMatch();
    }
  });

  registerConfirmPassword.addEventListener("input", validatePasswordMatch);

  function validatePasswordMatch() {
    const password = registerPassword.value;
    const confirmPassword = registerConfirmPassword.value;

    if (confirmPassword && password !== confirmPassword) {
      ValidationUtils.showError(
        "registerConfirmPassword",
        "registerConfirmPasswordError",
        "Passwords do not match"
      );
    } else if (confirmPassword && password === confirmPassword) {
      ValidationUtils.clearValidation(
        "registerConfirmPassword",
        "registerConfirmPasswordError",
        "registerConfirmPasswordSuccess"
      );
      ValidationUtils.showSuccess(
        "registerConfirmPassword",
        "registerConfirmPasswordSuccess",
        "Passwords match"
      );
    }
  }
  // Clear validation on input for all fields
  [registerName, registerEmail].forEach((input) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("error")) {
        const errorId = input.id + "Error";
        const successId =
          input.id === "registerEmail" ? "registerEmailSuccess" : null;
        ValidationUtils.clearValidation(input.id, errorId, successId);
      }
    });
  });
}

// Form handlers
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const submitBtn = document.getElementById("loginSubmitBtn");

  // Clear previous validations
  ValidationUtils.clearValidation("loginEmail", "loginEmailError");
  ValidationUtils.clearValidation("loginPassword", "loginPasswordError");

  let isValid = true;

  // Validate email
  if (!email) {
    ValidationUtils.showError(
      "loginEmail",
      "loginEmailError",
      "Email is required"
    );
    isValid = false;
  } else if (!ValidationUtils.validateEmail(email)) {
    ValidationUtils.showError(
      "loginEmail",
      "loginEmailError",
      "Please enter a valid email address"
    );
    isValid = false;
  }

  // Validate password
  if (!password) {
    ValidationUtils.showError(
      "loginPassword",
      "loginPasswordError",
      "Password is required"
    );
    isValid = false;
  } else if (password.length < 6) {
    ValidationUtils.showError(
      "loginPassword",
      "loginPasswordError",
      "Password must be at least 6 characters"
    );
    isValid = false;
  }

  if (!isValid) return;

  // Show loading state
  submitBtn.textContent = "Signing In...";
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    console.log("Login attempt:", { email, password });
    alert(`Login successful for ${email}!`);
    closeModal("login");

    // Reset button
    submitBtn.textContent = "Sign In";
    submitBtn.disabled = false;
  }, 1000);
}

function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById(
    "registerConfirmPassword"
  ).value;
  const submitBtn = document.getElementById("registerSubmitBtn");

  // Clear previous validations
  ValidationUtils.clearValidation("registerName", "registerNameError");
  ValidationUtils.clearValidation(
    "registerEmail",
    "registerEmailError",
    "registerEmailSuccess"
  );
  ValidationUtils.clearValidation("registerPassword", "registerPasswordError");
  ValidationUtils.clearValidation(
    "registerConfirmPassword",
    "registerConfirmPasswordError",
    "registerConfirmPasswordSuccess"
  );

  let isValid = true;

  // Validate name
  if (!fullName) {
    ValidationUtils.showError(
      "registerName",
      "registerNameError",
      "Full name is required"
    );
    isValid = false;
  } else if (!ValidationUtils.validateName(fullName)) {
    ValidationUtils.showError(
      "registerName",
      "registerNameError",
      "Name must be at least 2 characters and contain only letters"
    );
    isValid = false;
  }

  // Validate email
  if (!email) {
    ValidationUtils.showError(
      "registerEmail",
      "registerEmailError",
      "Email is required"
    );
    isValid = false;
  } else if (!ValidationUtils.validateEmail(email)) {
    ValidationUtils.showError(
      "registerEmail",
      "registerEmailError",
      "Please enter a valid email address"
    );
    isValid = false;
  }

  // Validate password
  if (!password) {
    ValidationUtils.showError(
      "registerPassword",
      "registerPasswordError",
      "Password is required"
    );
    isValid = false;
  } else {
    const passwordValidation = ValidationUtils.validatePassword(password);
    if (passwordValidation.score < 4) {
      ValidationUtils.showError(
        "registerPassword",
        "registerPasswordError",
        "Password must meet at least 4 requirements"
      );
      isValid = false;
    }
  }

  // Validate confirm password
  if (!confirmPassword) {
    ValidationUtils.showError(
      "registerConfirmPassword",
      "registerConfirmPasswordError",
      "Please confirm your password"
    );
    isValid = false;
  } else if (password !== confirmPassword) {
    ValidationUtils.showError(
      "registerConfirmPassword",
      "registerConfirmPasswordError",
      "Passwords do not match"
    );
    isValid = false;
  }

  if (!isValid) return;

  // Show loading state
  submitBtn.textContent = "Creating Account...";
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    console.log("Register attempt:", { fullName, email, password });
    alert(`Account created successfully for ${fullName}!`);
    closeModal("register");

    // Reset button
    submitBtn.textContent = "Create Account";
    submitBtn.disabled = false;
  }, 1500);
}

// ფუნქცია slider item-ის შესაქმნელად
function createSliderItem(data) {
  const item = document.createElement("div");
  item.className = "item";
  item.style.backgroundImage = `url(${data.image})`;
  item.innerHTML = `
    <div class="content">
      <div class="title">${data.title}</div>
      <div class="name">${data.name}</div>
      <div class="des">${data.description}</div>
      <div class="btn">
        <button data-item="${data.name}" data-type="primary">${data.buttons.primary}</button>
        <button data-item="${data.name}" data-type="secondary">${data.buttons.secondary}</button>
      </div>
    </div>
  `;
  return item;
}

// ღილაკების click handler
function handleButtonClick(itemName, buttonType) {
  console.log(`${buttonType} button clicked for ${itemName}`);
  if (buttonType === "primary") {
    alert(`See More clicked for ${itemName}`);
  } else {
    alert(`Subscribe clicked for ${itemName}`);
  }
}

// slider-ის ინიციალიზაცია
function initializeSlider() {
  const sliderList = document.getElementById("sliderList");
  sliderData.forEach((data) => {
    const item = createSliderItem(data);
    sliderList.appendChild(item);
  });

  // Add event listeners for slider buttons
  sliderList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.item) {
      handleButtonClick(e.target.dataset.item, e.target.dataset.type);
    }
  });
}

// Header scroll effect და mobile menu
function initializeHeader() {
  const header = document.getElementById("header");
  const headerRight = document.getElementById("headerRight");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", () => {
    headerRight.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");
  });

  // Close mobile menu when clicking on nav links
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      headerRight.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
    });
  });

  // Modal event listeners
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const loginCloseBtn = document.getElementById("loginCloseBtn");
  const registerCloseBtn = document.getElementById("registerCloseBtn");
  const switchToRegister = document.getElementById("switchToRegister");
  const switchToLogin = document.getElementById("switchToLogin");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Button event listeners
  loginBtn.addEventListener("click", () => openModal("login"));
  registerBtn.addEventListener("click", () => openModal("register"));
  loginCloseBtn.addEventListener("click", () => closeModal("login"));
  registerCloseBtn.addEventListener("click", () => closeModal("register"));
  switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    switchModal("login", "register");
  });
  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchModal("register", "login");
  });

  // Form event listeners
  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);

  // Setup validation
  setupValidation();

  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      e.target.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal-overlay.active");
      if (activeModal) {
        activeModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    }
  });
}

// DOM-ის ჩატვირთვის შემდეგ ინიციალიზაცია
document.addEventListener("DOMContentLoaded", () => {
  initializeSlider();
  initializeHeader();

  // არსებული slider ფუნქციონალი
  var nextBtn = document.querySelector(".next"),
    prevBtn = document.querySelector(".prev"),
    carousel = document.querySelector(".carousel"),
    list = document.querySelector(".list"),
    runningTime = document.querySelector(".carousel .timeRunning");

  const timeRunning = 3000;
  const timeAutoNext = 7000;

  nextBtn.onclick = () => {
    showSlider("next");
  };

  prevBtn.onclick = () => {
    showSlider("prev");
  };

  let runTimeOut;
  let runNextAuto = setTimeout(() => {
    nextBtn.click();
  }, timeAutoNext);

  function resetTimeAnimation() {
    runningTime.style.animation = "none";
    runningTime.offsetHeight;
    runningTime.style.animation = null;
    runningTime.style.animation = "runningTime 7s linear 1 forwards";
  }

  function showSlider(type) {
    const sliderItemsDom = list.querySelectorAll(".carousel .list .item");
    if (type === "next") {
      list.appendChild(sliderItemsDom[0]);
      carousel.classList.add("next");
    } else {
      list.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
      carousel.classList.add("prev");
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
      carousel.classList.remove("next");
      carousel.classList.remove("prev");
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
      nextBtn.click();
    }, timeAutoNext);

    resetTimeAnimation();
  }

  resetTimeAnimation();
});
