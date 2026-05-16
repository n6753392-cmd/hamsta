/* ═══════════════════════════════════════════
   HAMSTA CAFE — Interactive Scripts
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PARTICLE SYSTEM ── */
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;
  const colors = ['rgba(0,184,201,', 'rgba(224,36,94,', 'rgba(232,90,32,'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;
      if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) this.reset();
    }
    draw() {
      const o = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + o + ')';
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = this.color + '0.3)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── HERO PARALLAX (mouse tracking) ── */
  const hero = document.getElementById('hero');
  const parallaxEls = hero.querySelectorAll('[data-parallax]');
  let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - rect.width / 2);
    mouseY = (e.clientY - rect.top - rect.height / 2);
  });

  function animateParallax() {
    // Smooth lerp
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      const x = currentX * speed;
      const y = currentY * speed;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(animateParallax);
  }
  animateParallax();

  /* ── MOBILE MENU ── */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── MENU CATEGORY FILTER ── */
  const catBtns = document.querySelectorAll('.menu-cat-btn');
  const menuCards = document.querySelectorAll('.menu-card');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      menuCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp .4s ease both';
        } else {
          card.classList.add('hidden');
          card.style.animation = '';
        }
      });
    });
  });

  /* ── GALLERY SLIDER ── */
  const track = document.getElementById('gallery-track');
  const items = track.querySelectorAll('.gallery-item');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const dotsWrap = document.getElementById('gallery-dots');
  let currentSlide = 0;
  let slidesVisible = window.innerWidth > 768 ? 2 : 1;
  const maxSlide = () => Math.max(0, items.length - slidesVisible);

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxSlide(); i++) {
      const dot = document.createElement('div');
      dot.className = 'gallery-dot' + (i === currentSlide ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    }
  }
  function goToSlide(n) {
    currentSlide = Math.max(0, Math.min(n, maxSlide()));
    const gap = 24; // 1.5rem
    const itemW = items[0].offsetWidth + gap;
    track.style.transform = `translateX(-${currentSlide * itemW}px)`;
    dotsWrap.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  window.addEventListener('resize', () => {
    slidesVisible = window.innerWidth > 768 ? 2 : 1;
    buildDots();
    goToSlide(Math.min(currentSlide, maxSlide()));
  });
  buildDots();

  /* ── STAT COUNTER ── */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;
  function countUp(el) {
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  /* ── SCROLL REVEAL (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.section-header, .menu-grid, .about-image-col, .about-text-col, .gallery-track-wrapper, .feedback-container');
  revealEls.forEach(el => el.classList.add('reveal'));

  const staggerEls = document.querySelectorAll('.menu-grid, .values-grid, .reserve-info');
  staggerEls.forEach(el => el.classList.add('reveal-stagger'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger children
        if (entry.target.classList.contains('reveal-stagger')) {
          const children = entry.target.querySelectorAll('.menu-card, .value-item, .info-card');
          children.forEach((child, i) => { child.style.transitionDelay = `${i * 0.08}s`; });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Stat counter observer
  const aboutSection = document.getElementById('about');
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsCounted) {
      statsCounted = true;
      statNumbers.forEach(el => countUp(el));
    }
  }, { threshold: 0.3 });
  if (aboutSection) statsObserver.observe(aboutSection);

  /* ── FEEDBACK FORM ── */
  const feedbackForm = document.getElementById('feedback-form');
  const feedbackSuccess = document.getElementById('feedback-success');
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    feedbackForm.classList.add('submitted');
    feedbackSuccess.classList.add('show');
  });

  /* ── STAR RATING ── */
  const starBtns = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('fb-rating');
  let currentRating = 0;

  starBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const val = +btn.dataset.value;
      starBtns.forEach(b => {
        b.classList.toggle('hovered', +b.dataset.value <= val);
      });
    });
    btn.addEventListener('click', () => {
      currentRating = +btn.dataset.value;
      ratingInput.value = currentRating;
      starBtns.forEach(b => {
        b.classList.toggle('active', +b.dataset.value <= currentRating);
      });
    });
  });
  document.getElementById('star-rating').addEventListener('mouseleave', () => {
    starBtns.forEach(b => {
      b.classList.remove('hovered');
    });
  });

  /* ── SMOOTH SCROLL for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
