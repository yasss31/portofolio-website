/* ============================================================
   PORTFOLIO JS - DIAS HAFIIDH EGA MAULANA
   Particles, animations, interactions
   ============================================================ */

// ─── LOADING SCREEN ───
(function() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  setTimeout(() => {
    screen.classList.add('blur-out');
    setTimeout(() => { screen.style.display = 'none'; }, 800);
  }, 3000);
})();

// ─── CANVAS PARTICLE SYSTEM ───
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles = [], lines = [];
  const PARTICLE_COUNT = 70;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#00D4FF' : '#00FF88';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00D4FF';
          ctx.globalAlpha = (1 - dist / 120) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  animate();
  window.addEventListener('resize', resize);
})();

// ─── CURSOR GLOW ───
(function initCursor() {
  const cursor = document.querySelector('.cursor-glow');
  if (!cursor) return;

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();

// ─── NAVBAR SCROLL + ACTIVE ───
(function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ─── MOBILE MENU ───
(function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu-close');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));

  // Active state in mobile menu
  const path = location.pathname.split('/').pop() || 'index.html';
  mobileMenu.querySelectorAll('a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

// ─── SCROLL REVEAL ───
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ─── SKILL BAR ANIMATION ───
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const pct = fill.dataset.pct || '0';
        setTimeout(() => { fill.style.width = pct + '%'; }, 100);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => { f.style.width = '0'; observer.observe(f); });
})();

// ─── COUNTER ANIMATION ───
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ─── TYPING EFFECT ───
function typeWriter(el, texts, speed = 80, pause = 2000) {
  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = texts[textIndex];
    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? speed / 2 : speed);
  }
  type();
}

// Start typing on home page
const typingEl = document.getElementById('typing-text');
if (typingEl) {
  typeWriter(typingEl, [
    'IoT & AI Enthusiast',
    'Cloud Explorer',
    'Linux Tinkerer',
    'Network Engineer',
    'Automation Builder'
  ]);
}

// ─── BUTTON RIPPLE ───
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ─── CONTACT FORM ───
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '⟳ Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, var(--neon-green), #00CC66)';

      showToast('✓ Message sent successfully!');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }, 1500);
  });
})();

// ─── TOAST ───
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── PAGE TRANSITION ───
(function initPageTransition() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    a.addEventListener('click', function(e) {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 400);
    });
  });
})();

// ─── BLOG: FETCH MEDIUM ───
(function initBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  // Static blog posts (Medium RSS requires proxy in real deployment)
  const posts = [
    {
      title: 'Getting Started with IoT using ESP32',
      excerpt: 'A beginner\'s guide to building your first IoT project using ESP32 microcontroller for temperature monitoring and data collection.',
      date: 'Jan 2025',
      cat: 'IoT',
      icon: '🔌',
      url: 'https://medium.com/@24.tjkt1.13'
    },
    {
      title: 'Building a WhatsApp Bot with JavaScript',
      excerpt: 'How I built an automated WhatsApp bot using Node.js and JSON configuration for task automation and smart responses.',
      date: 'Dec 2024',
      cat: 'Development',
      icon: '🤖',
      url: 'https://medium.com/@24.tjkt1.13'
    },
    {
      title: 'My Journey Through Samsung Innovation Campus',
      excerpt: 'Reflecting on 6 months of intensive training covering Python, IoT, and AI with Samsung Innovation Campus program.',
      date: 'Mar 2025',
      cat: 'Experience',
      icon: '🚀',
      url: 'https://medium.com/@24.tjkt1.13'
    },
    {
      title: 'Automating Workflows with n8n',
      excerpt: 'Exploring the power of no-code automation using n8n to connect APIs, trigger events, and automate repetitive tasks.',
      date: 'Feb 2025',
      cat: 'Automation',
      icon: '⚙️',
      url: 'https://medium.com/@24.tjkt1.13'
    },
    {
      title: 'Linux Tips for Beginners',
      excerpt: 'Essential Linux commands and system administration tricks I learned during the IDNetworks Linux training program.',
      date: 'Nov 2024',
      cat: 'Linux',
      icon: '🐧',
      url: 'https://medium.com/@24.tjkt1.13'
    },
    {
      title: 'MikroTik Network Configuration Guide',
      excerpt: 'Step-by-step guide on configuring MikroTik routers for LAN networks, learned from hands-on practical training.',
      date: 'Oct 2024',
      cat: 'Networking',
      icon: '🌐',
      url: 'https://medium.com/@24.tjkt1.13'
    }
  ];

  grid.innerHTML = posts.map(p => `
    <article class="blog-card reveal" onclick="window.open('${p.url}','_blank')">
      <div class="blog-thumb">${p.icon}</div>
      <div class="blog-body">
        <div class="blog-meta">
          <span class="blog-date">${p.date}</span>
          <span class="blog-cat">${p.cat}</span>
        </div>
        <h3 class="blog-title">${p.title}</h3>
        <p class="blog-excerpt">${p.excerpt}</p>
        <a href="${p.url}" target="_blank" class="btn btn-ghost" style="font-size:13px;padding:10px 20px;">
          Read on Medium ↗
        </a>
      </div>
    </article>
  `).join('');

  // Re-init reveal for new elements
  document.querySelectorAll('.reveal').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    observer.observe(el);
  });
})();

// ─── SMOOTH NAV HIGHLIGHT ON SCROLL ───
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });
})();

console.log('%c DIAS HAFIIDH EGA MAULANA ', 'background: #00D4FF; color: #060A10; font-weight: bold; font-size: 16px; padding: 8px 16px; border-radius: 4px;');
console.log('%c IoT & AI Enthusiast | Cloud Explorer ', 'color: #00FF88; font-size: 12px;');
