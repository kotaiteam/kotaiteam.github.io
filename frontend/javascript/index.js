import "$styles/index.css"

// Lucide icons — CDN fallback used; import here for npm bundle path
// If lucide is installed via npm, uncomment the lines below:
// import { createIcons, icons } from 'lucide'

document.addEventListener('DOMContentLoaded', function () {

  // Initialize Lucide icons (CDN or npm bundle)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ===== DETECT CURRENT PAGE =====
  var currentPage = document.body.getAttribute('data-page') || 'home';

  // ===== MODE STATE =====
  // Always default to 'digital' on page load so Home always opens the Digital page.
  // TODO: Restore localStorage persistence when Fractional page comes back:
  //   var currentMode = localStorage.getItem('kotai-mode') || 'digital';
  var currentMode = 'digital';

  // ===== DOM REFERENCES =====
  var scrollProgress = document.getElementById('scrollProgress');
  var backToTopBtn = document.getElementById('backToTop');
  var contactForm = document.getElementById('contactForm');

  // Toggle buttons
  var toggleDigital = document.getElementById('toggleDigital');
  var toggleFractional = document.getElementById('toggleFractional');
  var bottomToggleDigital = document.getElementById('bottomToggleDigital');
  var bottomToggleFractional = document.getElementById('bottomToggleFractional');

  // Home page elements
  var pageHomeDigital = document.getElementById('page-home-digital');
  var pageHomeFractional = document.getElementById('page-home-fractional');

  // Services page elements
  var servicesTitle = document.getElementById('servicesTitle');
  var servicesSubtitle = document.getElementById('servicesSubtitle');
  var digitalServicesContent = document.getElementById('digitalServicesContent');
  var fractionalServicesContent = document.getElementById('fractionalServicesContent');
  var servicesCTATitle = document.getElementById('servicesCTATitle');
  var servicesCTAText = document.getElementById('servicesCTAText');


  // ===== MOBILE MENU TOGGLE =====
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var menuIconOpen = document.getElementById('menuIconOpen');
  var menuIconClose = document.getElementById('menuIconClose');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileMenuOpen = false;

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileMenuOpen = !mobileMenuOpen;
      if (mobileMenuOpen) {
        mobileMenu.classList.add('open');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
      } else {
        mobileMenu.classList.remove('open');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      }
    });
  }

  // Close mobile menu when a link is tapped
  if (mobileMenu) {
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenuOpen = false;
        mobileMenu.classList.remove('open');
        if (menuIconOpen) menuIconOpen.classList.remove('hidden');
        if (menuIconClose) menuIconClose.classList.add('hidden');
      });
    });
  }


  // ===== SCROLL PROGRESS =====
  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = progress + '%';
    }
  }


  // ===== BACK TO TOP =====
  function updateBackToTop() {
    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ===== SCROLL EVENT =====
  window.addEventListener('scroll', function () {
    updateScrollProgress();
    updateBackToTop();
  });

  updateScrollProgress();
  updateBackToTop();


  // ===== MODE SWITCHING (Digital / Fractional) =====
  function setMode(mode) {
    currentMode = mode;
    localStorage.setItem('kotai-mode', mode);

    // Update desktop toggles
    if (toggleDigital && toggleFractional) {
      toggleDigital.classList.toggle('active', mode === 'digital');
      toggleFractional.classList.toggle('active', mode === 'fractional');
    }

    // Update bottom toggles
    if (bottomToggleDigital && bottomToggleFractional) {
      bottomToggleDigital.classList.toggle('active', mode === 'digital');
      bottomToggleFractional.classList.toggle('active', mode === 'fractional');
    }

    if (currentPage === 'home') {
      updateHomePage();
    }

    if (currentPage === 'services') {
      updateServicesPage();
    }
  }

  function updateHomePage() {
    if (pageHomeDigital && pageHomeFractional) {
      if (currentMode === 'digital') {
        pageHomeDigital.classList.add('active');
        pageHomeFractional.classList.remove('active');
      } else {
        pageHomeDigital.classList.remove('active');
        pageHomeFractional.classList.add('active');
      }

      if (typeof lucide !== 'undefined') {
        setTimeout(function () { lucide.createIcons(); }, 50);
      }

      setTimeout(observeAnimations, 100);
    }
  }

  function updateServicesPage() {
    if (currentMode === 'digital') {
      if (servicesTitle) servicesTitle.textContent = 'Digital Services';
      if (servicesSubtitle) servicesSubtitle.textContent = 'Comprehensive technology solutions designed to accelerate your digital transformation journey.';
      if (digitalServicesContent) digitalServicesContent.style.display = 'block';
      if (fractionalServicesContent) fractionalServicesContent.style.display = 'none';
      if (servicesCTATitle) servicesCTATitle.textContent = "Let's Build Together";
      if (servicesCTAText) servicesCTAText.textContent = 'Discover how our technology solutions can transform your business.';
    } else {
      if (servicesTitle) servicesTitle.textContent = 'Fractional Leadership';
      if (servicesSubtitle) servicesSubtitle.textContent = 'Executive expertise on-demand, tailored to your specific business needs and growth stage.';
      if (digitalServicesContent) digitalServicesContent.style.display = 'none';
      if (fractionalServicesContent) fractionalServicesContent.style.display = 'block';
      if (servicesCTATitle) servicesCTATitle.textContent = 'Ready to Bring On Executive Talent?';
      if (servicesCTAText) servicesCTAText.textContent = 'Connect with our fractional executives to discuss your leadership needs.';
    }

    if (typeof lucide !== 'undefined') {
      setTimeout(function () { lucide.createIcons(); }, 50);
    }

    setTimeout(observeAnimations, 100);
  }

  // Desktop toggle click handlers
  if (toggleDigital) {
    toggleDigital.addEventListener('click', function () {
      setMode('digital');
      if (currentPage === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  if (toggleFractional) {
    toggleFractional.addEventListener('click', function () {
      setMode('fractional');
      if (currentPage === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Bottom toggle click handlers
  if (bottomToggleDigital) {
    bottomToggleDigital.addEventListener('click', function () {
      setMode('digital');
      if (currentPage === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  if (bottomToggleFractional) {
    bottomToggleFractional.addEventListener('click', function () {
      setMode('fractional');
      if (currentPage === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }


  // ===== CONTACT FORM =====
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameField = contactForm.querySelector('[name="name"]');
      var companyField = contactForm.querySelector('[name="company"]');
      var emailField = contactForm.querySelector('[name="email"]');
      var name = nameField ? nameField.value : '';
      var company = companyField ? companyField.value : '';
      var email = emailField ? emailField.value : '';
      alert('Thank you for your inquiry, ' + name + ' from ' + company + '! We\'ll be in touch at ' + email + ' soon.');
      contactForm.reset();
    });
  }


  // ===== SCROLL ANIMATIONS (IntersectionObserver) =====
  function setupAnimations() {
    var selectors = [
      '.section-header',
      '.stat-item',
      '.project-card',
      '.hero-feature-card',
      '.process-step',
      '.service-card',
      '.fractional-role-card',
      '.value-card',
      '.team-card',
      '.vm-card',
      '.split-content',
      '.split-image',
      '.testimonial-card',
      '.partner-logo',
      '.contact-info',
      '.contact-form-wrapper',
      '.about-verticals',
      '.hero-badge',
      '.page-hero-content',
      '.cta-content',
      '.footer-col'
    ];

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (!el.classList.contains('animate-in')) {
          el.classList.add('animate-in');
        }
      });
    });
  }

  function observeAnimations() {
    var elements = document.querySelectorAll('.animate-in:not(.visible)');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var siblings = entry.target.parentElement.querySelectorAll('.animate-in');
            var siblingIndex = Array.from(siblings).indexOf(entry.target);
            var delay = siblingIndex * 0.1;
            entry.target.style.transitionDelay = delay + 's';
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '-50px 0px'
      });

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }


  // ===== INITIALIZE =====
  setMode(currentMode);
  setupAnimations();
  observeAnimations();

});
