// JSON მონაცემები slider-ისთვის
import { sliderData, showSlider } from "./constants/data.js";

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
    const successDiv = successId ? document.getElementById(successId) : null;

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

  if (loginEmail) {
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
  }

  if (loginPassword) {
    loginPassword.addEventListener("input", () => {
      if (loginPassword.classList.contains("error")) {
        ValidationUtils.clearValidation("loginPassword", "loginPasswordError");
      }
    });
  }

  // Register validation
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const registerConfirmPassword = document.getElementById(
    "registerConfirmPassword"
  );

  if (registerName) {
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

    registerName.addEventListener("input", () => {
      if (registerName.classList.contains("error")) {
        ValidationUtils.clearValidation("registerName", "registerNameError");
      }
    });
  }

  if (registerEmail) {
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

    registerEmail.addEventListener("input", () => {
      if (registerEmail.classList.contains("error")) {
        ValidationUtils.clearValidation(
          "registerEmail",
          "registerEmailError",
          "registerEmailSuccess"
        );
      }
    });
  }

  if (registerPassword) {
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
      if (registerConfirmPassword && registerConfirmPassword.value) {
        validatePasswordMatch();
      }
    });
  }

  if (registerConfirmPassword) {
    registerConfirmPassword.addEventListener("input", validatePasswordMatch);
  }

  function validatePasswordMatch() {
    if (!registerPassword || !registerConfirmPassword) return;

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
    showNotification(`Welcome back! Logged in as ${email}`, "success");
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
    showNotification(
      `🎉 Welcome to AI Creative Studio, ${fullName}! Your creative journey begins now.`,
      "success"
    );
    closeModal("register");

    // Reset button
    submitBtn.textContent = "Start Creating";
    submitBtn.disabled = false;
  }, 1500);
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${
      type === "success"
        ? "linear-gradient(135deg, #10b981, #14ff72cb)"
        : type === "error"
        ? "linear-gradient(135deg, #ef4444, #f87171)"
        : type === "warning"
        ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
        : "linear-gradient(135deg, #3b82f6, #60a5fa)"
    };
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.4s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    max-width: 350px;
    font-size: 14px;
    line-height: 1.4;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.4s ease";
    setTimeout(() => notification.remove(), 400);
  }, 4000);
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
    showNotification(`🚀 Starting ${itemName} creation process...`, "success");
  } else {
    showNotification(`📖 Viewing more about ${itemName}...`, "info");
  }
}

// slider-ის ინიციალიზაცია
function initializeSlider() {
  const sliderList = document.getElementById("sliderList");
  if (!sliderList) return;

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

  if (!header) return;

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && headerRight) {
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
  }

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
  if (loginBtn) loginBtn.addEventListener("click", () => openModal("login"));
  if (registerBtn)
    registerBtn.addEventListener("click", () => openModal("register"));
  if (loginCloseBtn)
    loginCloseBtn.addEventListener("click", () => closeModal("login"));
  if (registerCloseBtn)
    registerCloseBtn.addEventListener("click", () => closeModal("register"));

  if (switchToRegister) {
    switchToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      switchModal("login", "register");
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      switchModal("register", "login");
    });
  }

  // Form event listeners
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (registerForm) registerForm.addEventListener("submit", handleRegister);

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

// AI Studio Features Interaction
function initializeAIStudio() {
  // Feature buttons
  const featureButtons = document.querySelectorAll(".feature-button");
  featureButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const featureCard = e.target.closest(".feature-card");
      const featureTitle =
        featureCard.querySelector(".feature-title").textContent;
      showNotification(`🎨 Opening ${featureTitle}...`, "info");
    });
  });

  // CTA buttons
  const ctaButtons = document.querySelectorAll(".cta-button, .cta-primary");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("registerBtn")?.click();
    });
  });

  // Secondary CTA
  const secondaryCTA = document.querySelector(".cta-secondary");
  if (secondaryCTA) {
    secondaryCTA.addEventListener("click", () => {
      showNotification("📞 Contact form opening soon!", "info");
    });
  }

  // Animate stats on scroll
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          animateNumber(stat);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
}

// Animate numbers
function animateNumber(element) {
  const finalValue = element.textContent;
  const numericValue = Number.parseInt(finalValue.replace(/[^\d]/g, ""));
  const suffix = finalValue.replace(/[\d]/g, "");

  let currentValue = 0;
  const increment = numericValue / 50;
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= numericValue) {
      currentValue = numericValue;
      clearInterval(timer);
    }
    element.textContent = Math.floor(currentValue) + suffix;
  }, 30);
}

// Add notification animations to CSS
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(notificationStyles);

// Advanced AI Studio Features
class AdvancedAIStudio {
  constructor() {
    this.isVoiceActive = false;
    this.recognition = null;
    this.canvas = null;
    this.ctx = null;
    this.currentTool = "brush";
    this.isDrawing = false;
    this.particles = [];

    this.initializeAdvancedFeatures();
    this.initializeCanvas();
    this.initializeVoiceCommands();
    this.initializeParticles();
    this.initializeLiveDemo();
  }

  initializeAdvancedFeatures() {
    // Playground tabs
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabId = btn.dataset.tab;

        // Remove active class from all
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        // Add active class to clicked
        btn.classList.add("active");
        document.getElementById(`${tabId}-tab`).classList.add("active");

        this.showNotification(`🎨 Switched to ${tabId} mode`, "info");
      });
    });

    // Interactive feature cards
    const featureCards = document.querySelectorAll(".feature-card.interactive");
    featureCards.forEach((card) => {
      card.addEventListener("click", () => {
        const feature = card.dataset.feature;
        this.handleFeatureClick(feature);
      });
    });
  }

  initializeCanvas() {
    this.canvas = document.getElementById("creativeCanvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    // Canvas event listeners
    this.canvas.addEventListener("mousedown", (e) => {
      this.isDrawing = true;
      this.draw(e);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.isDrawing) this.draw(e);
    });

    this.canvas.addEventListener("mouseup", () => {
      this.isDrawing = false;
      this.ctx.beginPath();
    });

    // Tool buttons
    const toolBtns = document.querySelectorAll(".tool-btn");
    toolBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        toolBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentTool = btn.dataset.tool;
        this.showNotification(`🛠️ Selected ${this.currentTool} tool`, "info");
      });
    });
  }

  draw(e) {
    if (!this.ctx) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.ctx.lineWidth = 3;
    this.ctx.lineCap = "round";

    switch (this.currentTool) {
      case "brush":
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle = "#14ff72cb";
        break;
      case "shapes":
        this.ctx.fillStyle = "#667eea";
        this.ctx.fillRect(x - 10, y - 10, 20, 20);
        return;
      case "text":
        this.ctx.font = "20px Poppins";
        this.ctx.fillStyle = "#764ba2";
        this.ctx.fillText("AI Text", x, y);
        return;
      case "ai":
        this.generateAIBrush(x, y);
        return;
    }

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  generateAIBrush(x, y) {
    // AI-powered brush effect
    const colors = ["#14ff72cb", "#00d4aa", "#667eea", "#764ba2"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;

      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = 0.7;
      this.ctx.beginPath();
      this.ctx.arc(
        x + offsetX,
        y + offsetY,
        Math.random() * 5 + 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  initializeVoiceCommands() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "ka-GE"; // Georgian

      this.recognition.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.toLowerCase();
        this.handleVoiceCommand(transcript);
      };

      const voiceBtn = document.querySelector(".voice-btn");
      if (voiceBtn) {
        voiceBtn.addEventListener("click", () => {
          this.toggleVoiceRecognition();
        });
      }
    }
  }

  toggleVoiceRecognition() {
    if (!this.recognition) {
      this.showNotification("❌ Voice recognition not supported", "error");
      return;
    }

    if (this.isVoiceActive) {
      this.recognition.stop();
      this.isVoiceActive = false;
      document.querySelector(".voice-btn").textContent = "Start Listening";
      this.showNotification("🎤 Voice recognition stopped", "info");
    } else {
      this.recognition.start();
      this.isVoiceActive = true;
      document.querySelector(".voice-btn").textContent = "Stop Listening";
      this.showNotification("🎤 Voice recognition started", "success");
      this.animateVoiceVisualizer();
    }
  }

  handleVoiceCommand(command) {
    console.log("Voice command:", command);

    if (
      command.includes("შექმენი სურათი") ||
      command.includes("create image")
    ) {
      this.showNotification("🎨 Creating image with AI...", "info");
      this.simulateAIGeneration("image");
    } else if (
      command.includes("დაწერე ტექსტი") ||
      command.includes("write text")
    ) {
      this.showNotification("✍️ Writing text with AI...", "info");
      this.simulateAIGeneration("text");
    } else if (
      command.includes("შექმენი ლოგო") ||
      command.includes("create logo")
    ) {
      this.showNotification("🎭 Designing logo with AI...", "info");
      this.simulateAIGeneration("logo");
    }
  }

  animateVoiceVisualizer() {
    const visualizer = document.querySelector(".voice-visualizer");
    if (!visualizer || !this.isVoiceActive) return;

    const bars = [];
    for (let i = 0; i < 20; i++) {
      const bar = document.createElement("div");
      bar.style.cssText = `
        position: absolute;
        left: ${i * 5}%;
        bottom: 0;
        width: 3px;
        background: #14ff72cb;
        border-radius: 2px;
        transition: height 0.1s ease;
      `;
      visualizer.appendChild(bar);
      bars.push(bar);
    }

    const animate = () => {
      if (!this.isVoiceActive) {
        bars.forEach((bar) => bar.remove());
        return;
      }

      bars.forEach((bar) => {
        bar.style.height = Math.random() * 30 + 5 + "px";
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  initializeParticles() {
    const particleContainer = document.createElement("div");
    particleContainer.className = "particles";
    document.querySelector(".ai-studio").appendChild(particleContainer);

    // Create particles
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        this.createParticle(particleContainer);
      }, i * 100);
    }

    // Continuously create new particles
    setInterval(() => {
      this.createParticle(particleContainer);
    }, 2000);
  }

  createParticle(container) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 2 + "s";
    particle.style.animationDuration = Math.random() * 3 + 3 + "s";

    container.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 6000);
  }

  initializeLiveDemo() {
    const generateBtn = document.getElementById("generateBtn");
    const aiPrompt = document.getElementById("aiPrompt");
    const aiModel = document.getElementById("aiModel");
    const demoOutput = document.querySelector(".demo-output");

    if (generateBtn) {
      generateBtn.addEventListener("click", () => {
        const prompt = aiPrompt.value.trim();
        const model = aiModel.value;

        if (!prompt) {
          this.showNotification("⚠️ Please enter a prompt", "warning");
          return;
        }

        this.generateAIContent(prompt, model, demoOutput);
      });
    }
  }

  generateAIContent(prompt, model, outputContainer) {
    // Show loading
    outputContainer.innerHTML = `
      <div class="output-placeholder">
        <div class="loading-animation"></div>
        <p>AI is creating your ${model}...</p>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    `;

    // Add progress bar styles
    const progressStyles = `
      .progress-bar {
        width: 200px;
        height: 6px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        margin: 20px auto;
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #14ff72cb, #00d4aa);
        width: 0%;
        animation: progress 3s ease-in-out forwards;
      }
      @keyframes progress {
        to { width: 100%; }
      }
    `;

    if (!document.getElementById("progress-styles")) {
      const style = document.createElement("style");
      style.id = "progress-styles";
      style.textContent = progressStyles;
      document.head.appendChild(style);
    }

    // Simulate AI generation
    setTimeout(() => {
      this.displayAIResult(prompt, model, outputContainer);
    }, 3000);
  }

  displayAIResult(prompt, model, outputContainer) {
    let resultHTML = "";

    switch (model) {
      case "image":
        resultHTML = `
          <div class="ai-result">
            <img src="/placeholder.svg?height=300&width=300&text=AI+Generated+Image" 
                 alt="AI Generated" style="border-radius: 12px; max-width: 100%;">
            <p style="margin-top: 15px; color: #14ff72cb;">✨ Image generated from: "${prompt}"</p>
            <div class="result-actions">
              <button class="result-btn">Download</button>
              <button class="result-btn">Share</button>
              <button class="result-btn">Edit</button>
            </div>
          </div>
        `;
        break;
      case "text":
        resultHTML = `
          <div class="ai-result">
            <div class="generated-text">
              <h4>AI Generated Text:</h4>
              <p>"${prompt}" - This is a sample AI-generated text based on your prompt. 
              The AI has analyzed your request and created relevant content that matches 
              your specifications with creative flair and professional quality.</p>
            </div>
            <div class="result-actions">
              <button class="result-btn">Copy</button>
              <button class="result-btn">Refine</button>
              <button class="result-btn">Export</button>
            </div>
          </div>
        `;
        break;
      case "logo":
        resultHTML = `
          <div class="ai-result">
            <div class="logo-preview" style="background: linear-gradient(135deg, #14ff72cb, #00d4aa); 
                 width: 150px; height: 150px; border-radius: 12px; display: flex; 
                 align-items: center; justify-content: center; margin: 0 auto; 
                 font-size: 24px; font-weight: bold; color: #000;">
              LOGO
            </div>
            <p style="margin-top: 15px; color: #14ff72cb;">🎭 Logo created for: "${prompt}"</p>
            <div class="result-actions">
              <button class="result-btn">Download SVG</button>
              <button class="result-btn">Variations</button>
              <button class="result-btn">Brand Kit</button>
            </div>
          </div>
        `;
        break;
      case "music":
        resultHTML = `
          <div class="ai-result">
            <div class="music-player">
              <div class="music-visualizer">🎵 ♪ ♫ ♪ 🎵</div>
              <p style="color: #14ff72cb;">🎵 Music composed for: "${prompt}"</p>
              <div class="music-controls">
                <button class="play-btn">▶️ Play</button>
                <div class="music-progress">
                  <div class="progress-track"></div>
                </div>
              </div>
            </div>
            <div class="result-actions">
              <button class="result-btn">Download MP3</button>
              <button class="result-btn">Remix</button>
              <button class="result-btn">Share</button>
            </div>
          </div>
        `;
        break;
    }

    outputContainer.innerHTML = resultHTML;

    // Add result styles
    const resultStyles = `
      .ai-result {
        text-align: center;
        color: #fff;
      }
      .result-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
        flex-wrap: wrap;
      }
      .result-btn {
        background: rgba(255,255,255,0.1);
        border: 2px solid rgba(255,255,255,0.2);
        color: #fff;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
      }
      .result-btn:hover {
        background: rgba(20,255,114,0.2);
        border-color: #14ff72cb;
      }
      .generated-text {
        background: rgba(0,0,0,0.2);
        padding: 20px;
        border-radius: 12px;
        text-align: left;
      }
      .music-visualizer {
        font-size: 24px;
        margin: 20px 0;
        animation: musicPulse 2s infinite;
      }
      @keyframes musicPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      .music-controls {
        display: flex;
        align-items: center;
        gap: 15px;
        justify-content: center;
        margin-top: 15px;
      }
      .play-btn {
        background: #14ff72cb;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      }
      .music-progress {
        width: 150px;
        height: 4px;
        background: rgba(255,255,255,0.2);
        border-radius: 2px;
      }
      .progress-track {
        height: 100%;
        background: #14ff72cb;
        width: 60%;
        border-radius: 2px;
      }
    `;

    if (!document.getElementById("result-styles")) {
      const style = document.createElement("style");
      style.id = "result-styles";
      style.textContent = resultStyles;
      document.head.appendChild(style);
    }

    this.showNotification(`✨ ${model} generated successfully!`, "success");
  }

  handleFeatureClick(feature) {
    switch (feature) {
      case "voice":
        this.toggleVoiceRecognition();
        break;
      case "collaboration":
        this.showNotification("👥 Starting collaboration session...", "info");
        this.simulateCollaboration();
        break;
      case "ar":
        this.showNotification("🥽 Launching AR preview...", "info");
        this.simulateARPreview();
        break;
      case "blockchain":
        this.showNotification("⛓️ Preparing NFT creation...", "info");
        this.simulateNFTCreation();
        break;
    }
  }

  simulateCollaboration() {
    const avatars = document.querySelectorAll(".avatar");
    avatars.forEach((avatar, index) => {
      setTimeout(() => {
        avatar.style.animation = "pulse 1s infinite, bounce 0.5s ease";
        avatar.style.border = "2px solid #14ff72cb";
      }, index * 500);
    });
  }

  simulateARPreview() {
    // Create AR overlay effect
    const arOverlay = document.createElement("div");
    arOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 24px;
      text-align: center;
    `;
    arOverlay.innerHTML = `
      <div>
        <div style="font-size: 64px; margin-bottom: 20px;">🥽</div>
        <p>AR Preview Mode</p>
        <p style="font-size: 16px; margin-top: 10px; opacity: 0.7;">Click anywhere to exit</p>
      </div>
    `;

    arOverlay.addEventListener("click", () => {
      arOverlay.remove();
    });

    document.body.appendChild(arOverlay);
  }

  simulateNFTCreation() {
    this.showNotification("⛓️ Connecting to blockchain...", "info");

    setTimeout(() => {
      this.showNotification(
        "💎 NFT created successfully! Token ID: #AI2024",
        "success"
      );
    }, 2000);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${
        type === "success"
          ? "linear-gradient(135deg, #10b981, #14ff72cb)"
          : type === "error"
          ? "linear-gradient(135deg, #ef4444, #f87171)"
          : type === "warning"
          ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
          : "linear-gradient(135deg, #3b82f6, #60a5fa)"
      };
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      z-index: 10000;
      animation: slideInRight 0.4s ease;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      max-width: 350px;
      font-size: 14px;
      line-height: 1.4;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.4s ease";
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }
}

// Initialize advanced features after DOM load
document.addEventListener("DOMContentLoaded", () => {
  // არსებული slider ფუნქციონალი
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const carousel = document.querySelector(".carousel");
  const list = document.querySelector(".list");
  const runningTime = document.querySelector(".carousel .timeRunning");

  if (nextBtn && prevBtn && carousel && list && runningTime) {
    const timeRunning = 3000;
    const timeAutoNext = 7000;

    nextBtn.onclick = () => {
      showSlider("next");
    };

    prevBtn.onclick = () => {
      showSlider("prev");
    };

    let runTimeOut;
    const runNextAuto = setTimeout(() => {
      nextBtn.click();
    }, timeAutoNext);

    function resetTimeAnimation() {
      runningTime.style.animation = "none";
      runningTime.offsetHeight;
      runningTime.style.animation = null;
      runningTime.style.animation = "runningTime 7s linear 1 forwards";
    }

    // Store references globally for showSlider function
    window.runTimeOut = runTimeOut;
    window.runNextAuto = runNextAuto;

    resetTimeAnimation();
  }

  initializeSlider();
  initializeHeader();
  initializeAIStudio();

  // Initialize advanced AI studio
  const advancedStudio = new AdvancedAIStudio();

  // Enhanced welcome message
  setTimeout(() => {
    advancedStudio.showNotification(
      "🚀 Welcome to Advanced AI Creative Studio! Try voice commands, live demos, and interactive features.",
      "success"
    );
  }, 2000);
});
