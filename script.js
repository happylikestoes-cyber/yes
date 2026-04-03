// ── Counter Animation ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 2400;
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -12 * t);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = target * easedProgress;

    if (decimals > 0) {
      el.textContent = prefix + current.toFixed(decimals) + suffix;
    } else {
      el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (decimals > 0) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

// ── Scroll Reveal with stagger ──
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Check if parent has stagger class
        const parent = entry.target.parentElement;
        if (parent && parent.classList.contains('reveal-stagger')) {
          // Stagger is handled by CSS transition-delay
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.add('visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ── Counter Observer ──
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

// ── Mobile Menu ──
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// ── Search Filter ──
function initSearch() {
  const input = document.querySelector('.search-bar input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('.catalog-card').forEach(card => {
      const name = card.querySelector('.cat-name').textContent.toLowerCase();
      card.style.display = name.includes(q) ? '' : 'none';
    });
  });
}

// ── Parallax on mouse move (hero area) ──
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const orbs = hero.querySelector('.hero-bg');
    if (orbs) {
      orbs.style.transform = `translate(${x * 20}px, ${y * 15}px)`;
      orbs.style.transition = 'transform 0.3s ease-out';
    }
  });
}

// ── Card tilt effect ──
function initTilt() {
  const cards = document.querySelectorAll('.game-card, .glass-card, .value-card, .contact-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 6;
      const rotateY = (x - 0.5) * 6;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── Smooth navbar background on scroll ──
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(6, 6, 12, 0.85)';
      nav.style.borderBottomColor = 'rgba(56, 130, 235, 0.15)';
    } else {
      nav.style.background = 'rgba(6, 6, 12, 0.6)';
      nav.style.borderBottomColor = 'rgba(56, 130, 235, 0.1)';
    }
  }, { passive: true });
}

// ── Scroll-based parallax for sections ──
function initScrollParallax() {
  const elements = document.querySelectorAll('[data-speed]');
  if (!elements.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    elements.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.1;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.style.transform = `translateY(${scrollY * speed}px)`;
      }
    });
  }, { passive: true });
}

// ── 3D Card Carousel ──
function initCarousel() {
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!cards.length) return;

  let current = 0;
  const total = cards.length;
  let autoTimer = null;

  function updatePositions() {
    cards.forEach((card, i) => {
      // Calculate relative position from current
      let diff = i - current;
      // Wrap around
      if (diff < 0) diff += total;
      if (diff >= total) diff -= total;

      // Only show first 3 positions
      if (diff < 3) {
        card.setAttribute('data-pos', diff);
      } else {
        card.setAttribute('data-pos', diff);
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = index % total;
    updatePositions();
    resetAuto();
  }

  function next() {
    goTo((current + 1) % total);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 3500);
  }

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Click on active card cycles to next
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.getAttribute('data-pos') === '0') {
        next();
      }
    });
  });

  // Init
  updatePositions();
  autoTimer = setInterval(next, 3500);
}

// ── Init Everything ──
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initMobileMenu();
  initSearch();
  initParallax();
  initTilt();
  initNavScroll();
  initScrollParallax();
  initCarousel();
});
