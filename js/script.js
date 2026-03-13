// ===== Initialize on DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
  initSmoothScroll();
  initScrollToTop();
});

// ===== Particle Background System =====
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  let particles = [];
  let animationId = null;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function createParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.max(0.5, Math.random() * 2),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.1, p.radius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249, 115, 22, ${p.opacity})`;
      ctx.fill();
    });
    
    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          const opacity = Math.max(0, (1 - dist / 120) * 0.15);
          ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  }
  
  function updateParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }
  
  function animate() {
    updateParticles();
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }
  
  // Initialize
  resize();
  createParticles();
  animate();
  
  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      createParticles();
    }, 250);
  });
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
        // Stagger animation delay
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
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Remove hash if any
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname);
    }
  });
}
