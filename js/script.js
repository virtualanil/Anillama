// ===== Initialize on DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initDragon();
  initScrollReveal();
  initSmoothScroll();
  initScrollToTop();
});

// ===== Dragon Movement System (Mobile + Desktop) =====
function initDragon() {
  const dragon = document.getElementById('dragon');
  
  if (!dragon) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    dragon.style.display = 'none';
    return;
  }

  // Initial State
  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  
  let isIdle = true; // Start in idle mode so it moves immediately
  let idleTimer = null;

  // Function to pick a random spot on screen
  const setRandomTarget = () => {
    const margin = 50; // Keep away from edges
    targetX = Math.random() * (window.innerWidth - margin * 2) + margin;
    targetY = Math.random() * (window.innerHeight - margin * 2) + margin;
  };

  // Set first random target
  setRandomTarget();

  // Function to handle interaction (Mouse or Touch)
  const handleInteraction = (x, y) => {
    targetX = x;
    targetY = y;
    isIdle = false;
    
    // Reset idle timer
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isIdle = true;
      setRandomTarget();
    }, 3000); // 3 seconds of no interaction -> start wandering
  };

  // 1. Mouse Move Event (Desktop)
  document.addEventListener('mousemove', (e) => {
    handleInteraction(e.clientX, e.clientY);
  });

  // 2. Touch Events (Mobile)
  // touchstart: When user taps screen
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // touchmove: When user drags finger
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Animation Loop
  function animate() {
    // If in idle mode, check if dragon reached destination
    if (isIdle) {
      const dist = Math.hypot(targetX - currentX, targetY - currentY);
      // If close to target, pick a new random spot
      if (dist < 40) {
        setRandomTarget();
      }
    }

    // Smooth easing movement
    const speed = 0.05; // Lower = smoother/slower
    currentX += (targetX - currentX) * speed;
    currentY += (targetY - currentY) * speed;

    // Apply position to dragon
    // Using transform is smoother than top/left, but we keep top/left for simplicity with CSS
    dragon.style.left = currentX - 20 + 'px'; // Offset by half its size (approx 40px)
    dragon.style.top = currentY - 20 + 'px';

    requestAnimationFrame(animate);
  }

  // Start the loop
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
