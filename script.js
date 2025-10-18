// ============================
//   CONFIGURAÇÕES GLOBAIS
// ============================
const CONFIG = {
  animationDuration: 300,
  scrollOffset: 80,
  mobileBreakpoint: 768
};

// ============================
//   UTILITÁRIOS
// ============================
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static isMobile() {
    return window.innerWidth <= CONFIG.mobileBreakpoint;
  }
}

// ============================
//   MENU MOBILE
// ============================
class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    if (!this.menuToggle || !this.mobileMenu) return;
    
    this.bindEvents();
    this.setupAccessibility();
  }

  bindEvents() {
    this.menuToggle.addEventListener('click', () => this.toggle());
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.mobileMenu.contains(e.target) && !this.menuToggle.contains(e.target)) {
        this.close();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close menu when clicking on links
    const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => this.close(), CONFIG.animationDuration);
      });
    });
  }

  setupAccessibility() {
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.menuToggle.setAttribute('aria-controls', 'mobileMenu');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.mobileMenu.classList.add('active');
    this.menuToggle.setAttribute('aria-expanded', 'true');
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first link
    const firstLink = this.mobileMenu.querySelector('.mobile-nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.mobileMenu.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.menuToggle.focus();
  }
}

// ============================
//   SCROLL SUAVE
// ============================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => this.handleClick(e, link));
    });
  }

  handleClick(e, link) {
    const href = link.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = target.offsetTop - headerHeight - CONFIG.scrollOffset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ============================
//   SCROLL ANIMATIONS
// ============================
class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        { 
          threshold: 0.1, 
          rootMargin: '0px 0px -50px 0px' 
        }
      );
      
      this.observeElements();
    }
  }

  observeElements() {
    const elements = document.querySelectorAll(`
      .service-card, 
      .feature-card, 
      .testimonial-card, 
      .stat,
      .hero-text,
      .hero-visual
    `);
    
    elements.forEach(el => {
      el.classList.add('scroll-reveal');
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================
//   HEADER SCROLL EFFECT
// ============================
class HeaderScroll {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScrollY = window.scrollY;
    this.init();
  }

  init() {
    if (!this.header) return;
    
    window.addEventListener('scroll', Utils.throttle(() => {
      this.handleScroll();
    }, 100));
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      this.header.style.background = 'rgba(255, 255, 255, 0.98)';
      this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      this.header.style.background = 'rgba(255, 255, 255, 0.95)';
      this.header.style.boxShadow = 'none';
    }
    
    this.lastScrollY = currentScrollY;
  }
}

// ============================
//   COUNTER ANIMATION
// ============================
class CounterAnimation {
  constructor() {
    this.init();
  }

  init() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      this.animateCounter(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/\d/g, '');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  }
}

// ============================
//   SKILL BARS ANIMATION
// ============================
class SkillBarsAnimation {
  constructor() {
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        { threshold: 0.5 }
      );
      
      this.observeSkillBars();
    }
  }

  observeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
      this.observer.observe(bar);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateSkillBar(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  animateSkillBar(bar) {
    const width = bar.style.width;
    bar.style.width = '0%';
    
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  }
}

// ============================
//   FORM HANDLING
// ============================
class FormHandler {
  constructor() {
    this.init();
  }

  init() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });
  }

  handleSubmit(e, form) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        this.showSuccessMessage();
      }, 2000);
    }
  }

  showSuccessMessage() {
    // Create success message
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
      ">
        ✅ Mensagem enviada com sucesso!
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 3000);
  }
}

// ============================
//   PERFORMANCE MONITOR
// ============================
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => this.logPerformance(), 1000);
      });
    }
  }

  logPerformance() {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
      console.log('🚀 Performance Metrics:', {
        loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
        firstPaint: this.getFirstPaint()
      });
    }
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : 'N/A';
  }
}

// ============================
//   LAZY LOADING
// ============================
class LazyLoader {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        { threshold: 0.1 }
      );
      
      this.observeImages();
    } else {
      this.loadAllImages();
    }
  }

  observeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => this.observer.observe(img));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }

  loadAllImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => this.loadImage(img));
  }
}

// ============================
//   INICIALIZAÇÃO
// ============================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new MobileMenu();
  new SmoothScroll();
  new ScrollAnimations();
  new HeaderScroll();
  new CounterAnimation();
  new SkillBarsAnimation();
  new FormHandler();
  new LazyLoader();
  new PerformanceMonitor();
  
  console.log('🚀 WideCodeBR website loaded successfully!');
});

// ============================
//   CSS ANIMATIONS
// ============================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .loaded {
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  
  img[data-src] {
    opacity: 0;
  }
`;
document.head.appendChild(style);