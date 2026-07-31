/**
 * Adventure Travel Booking Platform - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initFaqAccordion();
  initTestimonialSlider();
  initDateConstraints();
  initFilters();
  handleQueryParams();
  initFormValidations();
  initDashboardSidebar();
  initDashboardRoles();
});

/* ==========================================================================
   Header Scroll and Sticky Navbar
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  if (!header) return;

  // On subpages, header is solid by default (.scrolled class in HTML).
  // We only toggle .scrolled dynamically on scroll if we are on index.html (which doesn't have .scrolled default).
  const isHomepage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/') || 
                     (!window.location.pathname.includes('.html'));

  if (isHomepage) {
    header.classList.remove('scrolled'); // start transparent
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/* ==========================================================================
   Mobile Navigation Drawer (Hamburger)
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const navbar = document.querySelector('.navbar');
  const links = document.querySelectorAll('.nav-links a');

  if (!menuToggle || !navbar) return;

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navbar.classList.add('active');
    document.body.classList.add('menu-open');
    document.documentElement.classList.add('menu-open');
  });

  if (drawerClose) {
    drawerClose.addEventListener('click', () => {
      navbar.classList.remove('active');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    });
  }

  // Close menu when clicking a link
  links.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    });
  });

  // Click outside drawer to close
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && 
        !navbar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      navbar.classList.remove('active');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    }
  });
}

/* ==========================================================================
   Scroll Entrance Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.fade-in-element, .zoom-in-element, .slide-left-element, .slide-right-element'
  );

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   FAQ Accordion Interaction
   ========================================================================== */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqContent = faqItem.querySelector('.faq-content');
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current item
      faqItem.classList.toggle('active');
      if (faqItem.classList.contains('active')) {
        faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
      } else {
        faqContent.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   Testimonial Slider (Carousel)
   ========================================================================== */
function initTestimonialSlider() {
  const wrapper = document.querySelector('.testimonials-wrapper');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!wrapper || slides.length === 0 || !dotsContainer) return;

  let currentIndex = 0;
  let autoplayInterval;

  // Create dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      stopAutoplay();
      startAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function goToSlide(index) {
    currentIndex = index;
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, 6000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Autoplay control on hover
  const container = document.querySelector('.testimonials-slider-container');
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* ==========================================================================
   Date picker constraint (No past dates)
   ========================================================================== */
function initDateConstraints() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });
}

/* ==========================================================================
   Catalog Filters (for destinations.html and packages.html)
   ========================================================================== */
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.filterable-item');

  if (filterButtons.length === 0 || items.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterVal === 'all' || itemCategory === filterVal) {
          item.classList.remove('hidden');
          // Trigger micro-entrance animation
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 40);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   URL Query Parameters (Auto prefill on contact.html)
   ========================================================================== */
function handleQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const dest = params.get('dest');
  const date = params.get('date');
  const travelers = params.get('travelers');
  const budget = params.get('budget');
  const search = params.get('search');

  // 1. Prefill Contact / Booking Form (contact.html)
  const destInput = document.getElementById('contactDest');
  const msgInput = document.getElementById('contactMessage');
  
  if (destInput || msgInput) {
    if (dest && destInput) {
      destInput.value = decodeURIComponent(dest);
      destInput.classList.add('is-valid');
    }

    if (msgInput && (date || travelers || budget)) {
      let details = "I'm planning an expedition. Details of my criteria:\n";
      if (date) details += `• Proposed Travel Date: ${date}\n`;
      if (travelers) details += `• Number of Travelers: ${travelers}\n`;
      if (budget) details += `• Estimated Budget Limit: $${budget}\n`;
      details += "\nPlease let me know availability and customizable packages.";
      
      msgInput.value = details;
      msgInput.classList.add('is-valid');
    }
  }

  // 2. Filter list by search query (destinations.html & packages.html)
  if (search) {
    const items = document.querySelectorAll('.filterable-item');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (items.length > 0) {
      // deactivate active filters
      filterButtons.forEach(b => b.classList.remove('active'));

      const searchLower = decodeURIComponent(search).toLowerCase();
      items.forEach(item => {
        const titleEl = item.querySelector('.dest-title, .pkg-title');
        const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
        const category = item.getAttribute('data-category') || '';

        if (titleText.includes(searchLower) || category.toLowerCase().includes(searchLower)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }
  }
}

/* ==========================================================================
   Form Validation Logic
   ========================================================================== */
function initFormValidations() {
  const bookingForm = document.getElementById('bookingSearchForm');
  const contactForm = document.getElementById('contactInquiryForm');
  
  // Custom Success Modal elements
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('closeModalBtn');
  const successMsgText = document.getElementById('successMsgText');

  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = ''; // restore scroll
    });
  }

  // Regex patterns
  const namePattern = /^[a-zA-Z\s]+$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^\d{10}$/;

  /* Helper to set input status */
  function markInvalid(input, errorEl, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  function markValid(input, errorEl) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  }

  /* Booking Search Form validation (Home Hero Section Redirects to contact.html) */
  if (bookingForm) {
    const destInput = document.getElementById('bookingDest');
    const dateInput = document.getElementById('bookingDate');
    const travelersInput = document.getElementById('bookingTravelers');
    const budgetInput = document.getElementById('bookingBudget');

    // Real-time listener setups
    destInput.addEventListener('input', () => {
      const errorEl = destInput.parentElement.nextElementSibling;
      if (!destInput.value.trim()) {
        markInvalid(destInput, errorEl, 'Destination is mandatory.');
      } else {
        markValid(destInput, errorEl);
      }
    });

    dateInput.addEventListener('change', () => {
      const errorEl = dateInput.parentElement.nextElementSibling;
      const today = new Date().setHours(0, 0, 0, 0);
      const selected = new Date(dateInput.value).setHours(0, 0, 0, 0);
      if (!dateInput.value) {
        markInvalid(dateInput, errorEl, 'Date is required.');
      } else if (selected < today) {
        markInvalid(dateInput, errorEl, 'Travel date cannot be in the past.');
      } else {
        markValid(dateInput, errorEl);
      }
    });

    travelersInput.addEventListener('input', () => {
      const errorEl = travelersInput.parentElement.nextElementSibling;
      const val = parseInt(travelersInput.value, 10);
      if (!travelersInput.value) {
        markInvalid(travelersInput, errorEl, 'Number of travelers is required.');
      } else if (isNaN(val) || val <= 0) {
        markInvalid(travelersInput, errorEl, 'Must be a positive numeric value.');
      } else {
        markValid(travelersInput, errorEl);
      }
    });

    budgetInput.addEventListener('input', () => {
      const errorEl = budgetInput.parentElement.nextElementSibling;
      const val = parseFloat(budgetInput.value);
      if (!budgetInput.value) {
        markInvalid(budgetInput, errorEl, 'Budget is required.');
      } else if (isNaN(val) || val <= 0) {
        markInvalid(budgetInput, errorEl, 'Budget must be a positive number.');
      } else {
        markValid(budgetInput, errorEl);
      }
    });

    // Form Submit Listener (Validates first, then navigates to contact.html via GET parameters)
    bookingForm.addEventListener('submit', (e) => {
      let isValid = true;

      // Validate Destination
      if (!destInput.value.trim()) {
        markInvalid(destInput, destInput.parentElement.nextElementSibling, 'Destination is mandatory.');
        isValid = false;
      } else {
        markValid(destInput, destInput.parentElement.nextElementSibling);
      }

      // Validate Date
      const today = new Date().setHours(0, 0, 0, 0);
      const selected = new Date(dateInput.value).setHours(0, 0, 0, 0);
      if (!dateInput.value) {
        markInvalid(dateInput, dateInput.parentElement.nextElementSibling, 'Date is required.');
        isValid = false;
      } else if (selected < today) {
        markInvalid(dateInput, dateInput.parentElement.nextElementSibling, 'Travel date cannot be in the past.');
        isValid = false;
      } else {
        markValid(dateInput, dateInput.parentElement.nextElementSibling);
      }

      // Validate Travelers
      const tVal = parseInt(travelersInput.value, 10);
      if (!travelersInput.value || isNaN(tVal) || tVal <= 0) {
        markInvalid(travelersInput, travelersInput.parentElement.nextElementSibling, 'Must be a positive numeric value.');
        isValid = false;
      } else {
        markValid(travelersInput, travelersInput.parentElement.nextElementSibling);
      }

      // Validate Budget
      const bVal = parseFloat(budgetInput.value);
      if (!budgetInput.value || isNaN(bVal) || bVal <= 0) {
        markInvalid(budgetInput, budgetInput.parentElement.nextElementSibling, 'Budget must be a positive number.');
        isValid = false;
      } else {
        markValid(budgetInput, budgetInput.parentElement.nextElementSibling);
      }

      if (!isValid) {
        e.preventDefault(); // stop navigation if search inputs are invalid
      }
    });
  }

  /* Contact & Inquiry Form validation */
  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const destInput = document.getElementById('contactDest');
    const msgInput = document.getElementById('contactMessage');
    const termsInput = document.getElementById('contactTerms');
    const termsWrapper = document.querySelector('.checkbox-label');

    // Real-time validations
    nameInput.addEventListener('input', () => {
      nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, '');
      const errorEl = nameInput.nextElementSibling;
      if (!nameInput.value.trim()) {
        markInvalid(nameInput, errorEl, 'Name is required.');
      } else if (!namePattern.test(nameInput.value)) {
        markInvalid(nameInput, errorEl, 'Name must contain only letters and spaces.');
      } else {
        markValid(nameInput, errorEl);
      }
    });

    emailInput.addEventListener('input', () => {
      const errorEl = emailInput.nextElementSibling;
      if (!emailInput.value) {
        markInvalid(emailInput, errorEl, 'Email is required.');
      } else if (!emailPattern.test(emailInput.value)) {
        markInvalid(emailInput, errorEl, 'Please enter a valid email format.');
      } else {
        markValid(emailInput, errorEl);
      }
    });

    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, '');
      const errorEl = phoneInput.nextElementSibling;
      if (!phoneInput.value) {
        markInvalid(phoneInput, errorEl, 'Mobile number is required.');
      } else if (!phonePattern.test(phoneInput.value)) {
        markInvalid(phoneInput, errorEl, 'Must be exactly 10 digits (numbers only).');
      } else {
        markValid(phoneInput, errorEl);
      }
    });

    destInput.addEventListener('input', () => {
      const errorEl = destInput.nextElementSibling;
      if (!destInput.value.trim()) {
        markInvalid(destInput, errorEl, 'Destination is mandatory.');
      } else {
        markValid(destInput, errorEl);
      }
    });

    msgInput.addEventListener('input', () => {
      const errorEl = msgInput.nextElementSibling;
      const len = msgInput.value.length;
      if (len < 20) {
        markInvalid(msgInput, errorEl, `Message is too short. Minimum 20 characters (Current: ${len}).`);
      } else if (len > 500) {
        markInvalid(msgInput, errorEl, `Message is too long. Maximum 500 characters (Current: ${len}).`);
      } else {
        markValid(msgInput, errorEl);
      }
    });

    if (termsInput && termsWrapper) {
      termsInput.addEventListener('change', () => {
        const errorEl = termsWrapper.nextElementSibling;
        if (!termsInput.checked) {
          termsWrapper.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'You must accept the Terms and Conditions.';
            errorEl.style.display = 'block';
          }
        } else {
          termsWrapper.classList.remove('is-invalid');
          if (errorEl) {
            errorEl.style.display = 'none';
          }
        }
      });
    }

    // Form Submit Validation
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        markInvalid(nameInput, nameInput.nextElementSibling, 'Name is required.');
        isValid = false;
      } else if (!namePattern.test(nameInput.value)) {
        markInvalid(nameInput, nameInput.nextElementSibling, 'Name must contain only letters and spaces.');
        isValid = false;
      } else {
        markValid(nameInput, nameInput.nextElementSibling);
      }

      // Validate Email
      if (!emailInput.value) {
        markInvalid(emailInput, emailInput.nextElementSibling, 'Email is required.');
        isValid = false;
      } else if (!emailPattern.test(emailInput.value)) {
        markInvalid(emailInput, emailInput.nextElementSibling, 'Please enter a valid email format.');
        isValid = false;
      } else {
        markValid(emailInput, emailInput.nextElementSibling);
      }

      // Validate Phone
      if (!phoneInput.value) {
        markInvalid(phoneInput, phoneInput.nextElementSibling, 'Mobile number is required.');
        isValid = false;
      } else if (!phonePattern.test(phoneInput.value)) {
        markInvalid(phoneInput, phoneInput.nextElementSibling, 'Must be exactly 10 digits (numbers only).');
        isValid = false;
      } else {
        markValid(phoneInput, phoneInput.nextElementSibling);
      }

      // Validate Destination
      if (!destInput.value.trim()) {
        markInvalid(destInput, destInput.nextElementSibling, 'Destination is mandatory.');
        isValid = false;
      } else {
        markValid(destInput, destInput.nextElementSibling);
      }

      // Validate Message
      const msgLen = msgInput.value.length;
      if (msgLen < 20) {
        markInvalid(msgInput, msgInput.nextElementSibling, `Message is too short. Minimum 20 characters.`);
        isValid = false;
      } else if (msgLen > 500) {
        markInvalid(msgInput, msgInput.nextElementSibling, `Message is too long. Maximum 500 characters.`);
        isValid = false;
      } else {
        markValid(msgInput, msgInput.nextElementSibling);
      }

      // Validate Terms Checkbox
      if (termsInput && termsWrapper) {
        if (!termsInput.checked) {
          termsWrapper.classList.add('is-invalid');
          const errorEl = termsWrapper.nextElementSibling;
          if (errorEl) {
            errorEl.textContent = 'You must accept the Terms and Conditions.';
            errorEl.style.display = 'block';
          }
          isValid = false;
        } else {
          termsWrapper.classList.remove('is-invalid');
          const errorEl = termsWrapper.nextElementSibling;
          if (errorEl) {
            errorEl.style.display = 'none';
          }
        }
      }

      if (isValid) {
        // Success Action
        if (successModal) {
          successMsgText.innerHTML = `Thank you, <strong>${nameInput.value}</strong>! Your inquiry about traveling to <strong>${destInput.value}</strong> has been received. A trip coordinator will call you at <strong>${phoneInput.value}</strong> or email you at <strong>${emailInput.value}</strong> shortly.`;
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden'; // lock scroll
          
          // Clear inputs and classes
          contactForm.reset();
          const inputs = contactForm.querySelectorAll('.form-control');
          inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
          termsWrapper.classList.remove('is-invalid');
        }
      }
    });
  }
}

/* ==========================================================================
   PORTAL ALERTS & DASHBOARD INITIALIZERS
   ========================================================================== */
window.showCustomAlert = function(message, type = 'success') {
  if (document.querySelector('.custom-alert-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'custom-alert-overlay';

  const modal = document.createElement('div');
  modal.className = 'custom-alert-modal glass-card';

  const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
  const iconColor = type === 'success' ? '#10b981' : '#ff7a00';

  modal.innerHTML = `
      <div class="custom-alert-icon" style="color: ${iconColor}; font-size: 3.5rem; margin-bottom: 1.5rem; text-align: center;">
          <i class="fa-solid ${iconClass}"></i>
      </div>
      <p class="custom-alert-message" style="color: var(--color-text-white); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; text-align: center;">${message}</p>
      <button class="custom-alert-btn btn btn-primary" style="width: 120px; margin: 0 auto; display: block;">OK</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  setTimeout(() => {
      overlay.classList.add('active');
  }, 10);

  const closeBtn = modal.querySelector('.custom-alert-btn');
  const closeAlert = () => {
      overlay.classList.remove('active');
      setTimeout(() => {
          overlay.remove();
      }, 300);
  };

  closeBtn.addEventListener('click', closeAlert);
  overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAlert();
  });
};

function initDashboardSidebar() {
  const dbHamburger = document.querySelector('.db-hamburger');
  const dbSidebarClose = document.querySelector('.db-sidebar-close');
  const dbSidebar = document.querySelector('.db-sidebar');
  const dbOverlay = document.querySelector('.db-sidebar-overlay');

  if (dbHamburger && dbSidebar && dbOverlay) {
      dbHamburger.addEventListener('click', () => {
          dbSidebar.classList.add('active');
          dbOverlay.classList.add('active');
          document.body.classList.add('menu-open');
          document.documentElement.classList.add('menu-open');
      });
  }

  const closeDbSidebar = () => {
      if (dbSidebar) dbSidebar.classList.remove('active');
      if (dbOverlay) dbOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
  };

  if (dbSidebarClose) {
      dbSidebarClose.addEventListener('click', closeDbSidebar);
  }
  if (dbOverlay) {
      dbOverlay.addEventListener('click', closeDbSidebar);
  }
}

function initDashboardRoles() {
  const role = localStorage.getItem('loggedInUserRole') || 'client';
  const userName = localStorage.getItem('loggedInUserName') || 'EXPLORER';

  // Update username indicators
  document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = role === 'advisor' ? `Guide ${userName}` : userName;
  });

  const initials = userName.substring(0, 2).toUpperCase();
  document.querySelectorAll('.user-avatar').forEach(el => {
      el.textContent = initials;
  });

  // Swapping modules for Expedition Guide / Admin Role
  if (role === 'advisor') {
      const sidebar = document.querySelector('.db-sidebar');
      if (sidebar) {
          const menuContainer = sidebar.querySelector('div[style*="overflow-y"]');
          if (menuContainer) {
              const path = window.location.pathname.split('/').pop() || 'studio-portal.html';
              const isControl = path.includes('studio-portal') || path === '';
              const isClientExp = path.includes('client-expeditions');
              const isSchedule = path.includes('guide-schedule');
              const isLogs = path.includes('safety-incident-logs');
              
              menuContainer.innerHTML = `
                  <button class="db-sidebar-close" aria-label="Close Menu"><i class="fa-solid fa-xmark"></i></button>
                  <div style="overflow-y: auto; height: calc(100% - 60px); padding-right: 5px;">
                      <a href="studio-portal.html" class="sidebar-logo"><div class="logo" style="margin: 0 auto 1.5rem auto;"><img src="images/logo.webp" alt="Logo" class="logo-img"></div></a>
                      
                      <!-- Group 1: Guide Command -->
                      <div class="sidebar-section-title" style="margin-top: 1rem;">Main</div>
                      <nav class="sidebar-menu">
                          <a href="studio-portal.html" class="sidebar-link ${isControl ? 'active' : ''}"><i class="fa-solid fa-chart-pie"></i> Control Board</a>
                          <a href="client-expeditions.html" class="sidebar-link ${isClientExp ? 'active' : ''}"><i class="fa-solid fa-users"></i> Client Expeditions</a>
                          <a href="guide-schedule.html" class="sidebar-link ${isSchedule ? 'active' : ''}"><i class="fa-solid fa-calendar-check"></i> Guide Schedule</a>
                      </nav>

                      <!-- Group 2: Agency Oversight -->
                      <div class="sidebar-section-title" style="margin-top: 1rem;">Agency Oversight</div>
                      <nav class="sidebar-menu">
                          <a href="safety-incident-logs.html" class="sidebar-link ${isLogs ? 'active' : ''}"><i class="fa-solid fa-file-shield"></i> Safety & Incident Logs</a>
                      </nav>
                  </div>
              `;
              
              // Re-bind close action for advisor sidebar
              const sidebarCloseNew = menuContainer.querySelector('.db-sidebar-close');
              if (sidebarCloseNew) {
                sidebarCloseNew.addEventListener('click', () => {
                  sidebar.classList.remove('active');
                  const dbOverlay = document.querySelector('.db-sidebar-overlay');
                  if (dbOverlay) dbOverlay.classList.remove('active');
                  document.body.classList.remove('menu-open');
                  document.documentElement.classList.remove('menu-open');
                });
              }
          }
      }

      // Customize main dashboard panel for Guide
      if (window.location.pathname.endsWith('studio-portal.html') || window.location.pathname.endsWith('studio-portal')) {
          const welcomeHero = document.querySelector('.db-welcome-hero');
          if (welcomeHero) {
              welcomeHero.innerHTML = `
                  <h1>Hello, <span class="user-name" style="font-size: inherit; font-weight: inherit; color: inherit;">Guide ${userName}</span></h1>
                  <p>Expedition Command Panel. Authorize climber permits, inspect equipment checklist logs, and schedule emergency satellite response tests.</p>
              `;
          }

          const statCards = document.querySelectorAll('.stat-card');
          if (statCards.length >= 4) {
              statCards[0].innerHTML = `
                  <div>
                      <div class="stat-label">Total Guided Climbers</div>
                      <h3 class="stat-value">1,240 Climbers</h3>
                  </div>
                  <div class="stat-icon-wrapper" style="background: rgba(16, 185, 129, 0.1); color: var(--color-accent-green);"><i class="fa-solid fa-people-group"></i></div>
              `;
              statCards[1].innerHTML = `
                  <div>
                      <div class="stat-label">Active Expeditions</div>
                      <h3 class="stat-value">48 Groups</h3>
                  </div>
                  <div class="stat-icon-wrapper" style="background: rgba(245, 158, 11, 0.1); color: var(--color-accent-orange);"><i class="fa-solid fa-route"></i></div>
              `;
              statCards[2].innerHTML = `
                  <div>
                      <div class="stat-label">Agency Safety Rating</div>
                      <h3 class="stat-value">99.8% Perfect</h3>
                  </div>
                  <div class="stat-icon-wrapper" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;"><i class="fa-solid fa-shield-halved"></i></div>
              `;
              statCards[3].innerHTML = `
                  <div>
                      <div class="stat-label">Assigned Sector</div>
                      <h3 class="stat-value">Patagonia CIO</h3>
                  </div>
                  <div class="stat-icon-wrapper" style="background: rgba(168, 85, 247, 0.1); color: #a855f7;"><i class="fa-solid fa-mountain"></i></div>
              `;
          }

          const tableTitle = document.querySelector('.panel-box-title');
          if (tableTitle) {
              tableTitle.textContent = "High-Priority Client Expeditions";
          }
          const table = document.querySelector('.db-table');
          if (table) {
              const tbody = table.querySelector('tbody');
              if (tbody) {
                  tbody.innerHTML = `
                      <tr>
                          <td class="text-light-value" data-label="Expedition">Serengeti Safari Group</td>
                          <td data-label="Climber">Alexander Hamilton</td>
                          <td data-label="Value">$15,400 Booking</td>
                          <td data-label="Action"><span class="badge-status status-active" style="cursor:pointer;" onclick="window.showCustomAlert('Serengeti climbing log updated. Route safe.', 'success')">Inspect</span></td>
                      </tr>
                      <tr>
                          <td class="text-light-value" data-label="Expedition">Patagonia Ridge Climb</td>
                          <td data-label="Climber">Fiona Vance (Leader)</td>
                          <td data-label="Value">$24,800 Booking</td>
                          <td data-label="Action"><span class="badge-status status-active" style="cursor:pointer;" onclick="window.showCustomAlert('Patagonia ridge climb request approved.', 'success')">Inspect</span></td>
                      </tr>
                  `;
              }
          }
      }
  }
}
