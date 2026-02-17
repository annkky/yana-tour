// ===== DOM Elements =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const heroSlides = document.querySelectorAll(".hero-slider .slide");

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Add/remove scrolled class
  if (currentScroll > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Show/hide back to top button
  if (currentScroll > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }

  lastScroll = currentScroll;
});

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");

  // Toggle icon
  const icon = navToggle.querySelector("i");
  if (navLinks.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    const icon = navToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  });
});

// ===== Hero Slider =====
let currentSlide = 0;
const slideInterval = 5000; // Change slide every 5 seconds

function changeSlide() {
  heroSlides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % heroSlides.length;
  heroSlides[currentSlide].classList.add("active");
}

setInterval(changeSlide, slideInterval);

// ===== Statistics Counter Animation =====
const statNumbers = document.querySelectorAll(".stat-number");
let hasAnimated = false;

function animateStats() {
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"));
    const duration = 2000; // Animation duration in ms
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const counter = setInterval(() => {
      current += step;
      if (current >= target) {
        stat.textContent = target.toLocaleString();
        clearInterval(counter);
      } else {
        stat.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  });
}

// Trigger stats animation when hero section is in view
const heroSection = document.querySelector(".hero");
const observerOptions = {
  threshold: 0.5,
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !hasAnimated) {
      animateStats();
      hasAnimated = true;
    }
  });
}, observerOptions);

statsObserver.observe(heroSection);

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===== Back to Top Button =====
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ===== Contact Form Handling =====
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const destination = document.getElementById("destination").value;
  const message = document.getElementById("message").value;

  // Simple validation
  if (!name || !phone) {
    showNotification("Пожалуйста, заполните обязательные поля", "error");
    return;
  }

  // Simulate form submission
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Отправка...";
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    showNotification("Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время!", "success");
    contactForm.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
});

// ===== Notification System =====
function showNotification(message, type = "success") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 20px 25px;
        background: ${type === "success" ? "#10B981" : "#EF4444"};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

  // Add animation keyframes
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
  document.head.appendChild(style);

  // Style notification content
  notification.querySelector(".notification-content").style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;

  notification.querySelector(".notification-close").style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        opacity: 0.8;
    `;

  document.body.appendChild(notification);

  // Close button functionality
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.style.animation = "slideOut 0.3s ease forwards";
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll(".destination-card, .service-card, .testimonial-card, .about-content, .about-images");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
);

revealElements.forEach((element) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(30px)";
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  revealObserver.observe(element);
});

// ===== Active Navigation Link Highlight =====
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth load animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});
