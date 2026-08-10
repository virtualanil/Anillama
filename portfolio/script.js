// ===== Initialize on DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initDragonBackground();
  initScrollReveal();
  initSmoothScroll();
  initScrollToTop();
});

// ===== Massive Dragon Background Parallax =====
function initDragonBackground() {
  const dragonBg = document.querySelector('.dragon-visual');
  
  if (!dragonBg) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return; // Keep static if reduced motion preferred
  }

  // State
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = 0;
  let currentY = 0;

  // Handle Mouse Move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Handle Touch Move (Mobile)
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Animation Loop
  function animate() {
    // Calculate center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate offset (Parallax effect)
    // The larger the divisor (e.g., 50), the slower/subtler the movement
    const destX = (mouseX - centerX) / 30; 
    const destY = (mouseY - centerY) / 30;

    // Easing
    currentX += (destX - currentX) * 0.05;
    currentY += (destY - currentY) * 0.05;

    // Apply transform (keeping the centering translate from CSS)
    // We append the movement to the existing float animation via JS override
    dragonBg.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;

    requestAnimationFrame(animate);
  }

  animate();
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const sections = document.querySelectorAll('.reveal-section');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// ===== Smooth Scroll for Navigation =====
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ===== Scroll to Top on Page Load =====
function initScrollToTop() {
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname);
    }
  });
}
