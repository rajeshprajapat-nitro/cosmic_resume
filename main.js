/* ═══════════════════════════════════════════
   COSMIC RESUME — MAIN JS
   Starfield, Loader, Cursor, Animations
═══════════════════════════════════════════ */

// ── LOADER ──
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderText = document.getElementById('loaderText');
const universe = document.getElementById('universe');
const messages = ['INITIALIZING...', 'LOADING ASSETS...', 'LAUNCHING...', 'READY'];
let progress = 0;
let msgIdx = 0;

const loaderInterval = setInterval(() => {
  progress += Math.random() * 18 + 5;
  if (progress > 100) progress = 100;
  loaderFill.style.width = progress + '%';
  if (progress > 33 && msgIdx === 0) { loaderText.textContent = messages[1]; msgIdx = 1; }
  if (progress > 66 && msgIdx === 1) { loaderText.textContent = messages[2]; msgIdx = 2; }
  if (progress >= 100) {
    clearInterval(loaderInterval);
    loaderText.textContent = messages[3];
    setTimeout(() => {
      loader.classList.add('hide');
      universe.classList.add('visible');
      startStarfield();
      initAnimations();
    }, 400);
  }
}, 80);

// ── STARFIELD CANVAS ──
function startStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], nebulae = [], meteors = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initStars(); });

  function initStars() {
    stars = [];
    nebulae = [];
    const count = Math.floor((W * H) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.003 + 0.001,
        twinkle: Math.random() * Math.PI * 2,
        color: Math.random() > 0.85
          ? (Math.random() > 0.5 ? '#b44fff' : '#00d4ff')
          : '#ffffff'
      });
    }
    for (let i = 0; i < 6; i++) {
      nebulae.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 300 + 150,
        h: Math.random() * 360,
        alpha: Math.random() * 0.04 + 0.01
      });
    }
  }
  initStars();

  function spawnMeteor() {
    meteors.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.3,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 6,
      alpha: 1,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3
    });
  }
  setInterval(spawnMeteor, 3500);

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    // Nebulae
    nebulae.forEach(n => {
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grd.addColorStop(0, `hsla(${n.h},100%,60%,${n.alpha})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars
    stars.forEach(s => {
      s.twinkle += s.speed;
      const alpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      if (s.r > 1.2) {
        // glowing star
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        grd.addColorStop(0, s.color);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Meteors
    meteors = meteors.filter(m => m.alpha > 0.01);
    meteors.forEach(m => {
      const dx = Math.cos(m.angle) * m.len;
      const dy = Math.sin(m.angle) * m.len;
      const grd = ctx.createLinearGradient(m.x, m.y, m.x + dx, m.y + dy);
      grd.addColorStop(0, `rgba(0,212,255,${m.alpha})`);
      grd.addColorStop(0.5, `rgba(180,79,255,${m.alpha * 0.5})`);
      grd.addColorStop(1, 'transparent');
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x + dx, m.y + dy);
      ctx.stroke();
      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.alpha -= 0.012;
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  tx += (mx - tx) * 0.15;
  ty += (my - ty) * 0.15;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top = ty + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.background = 'var(--c2)';
    cursorTrail.style.width = '50px';
    cursorTrail.style.height = '50px';
    cursorTrail.style.borderColor = 'rgba(180,79,255,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    cursor.style.background = 'var(--c1)';
    cursorTrail.style.width = '30px';
    cursorTrail.style.height = '30px';
    cursorTrail.style.borderColor = 'rgba(0,212,255,0.4)';
  });
});

// ── ANIMATIONS AFTER LOAD ──
function initAnimations() {
  typewriterEffect();
  countUpStats();
  revealOnScroll();
  animateSkillBars();
  activeNavOnScroll();
  particleTrail();
}

// ── TYPEWRITER ──
const roles = [
  'Software Engineer',
  'Full Stack Developer',
  'Backend Architect',
  'Cloud Engineer',
  'Problem Solver ✦'
];
let rIdx = 0, cIdx = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function typewriterEffect() {
  if (!roleEl) return;
  const current = roles[rIdx];
  if (!deleting) {
    roleEl.textContent = current.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) { deleting = true; setTimeout(typewriterEffect, 2000); return; }
  } else {
    roleEl.textContent = current.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  setTimeout(typewriterEffect, deleting ? 60 : 100);
}

// ── COUNT-UP ──
function countUpStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    let val = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      val = Math.min(val + step, target);
      el.textContent = val;
      if (val >= target) clearInterval(interval);
    }, 40);
  });
}

// ── SCROLL REVEAL ──
function revealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
}

// ── SKILL BARS ──
function animateSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.w;
        setTimeout(() => { entry.target.style.width = w + '%'; }, 300);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => obs.observe(bar));
}

// ── ACTIVE NAV ──
function activeNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? 'var(--c1)' : '';
    });
  });
}

// ── PARTICLE TRAIL ──
function particleTrail() {
  document.addEventListener('mousemove', e => {
    if (Math.random() > 0.7) return;
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      position:fixed; pointer-events:none; z-index:9990;
      left:${e.clientX}px; top:${e.clientY}px;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:${Math.random() > 0.5 ? 'var(--c1)' : 'var(--c2)'};
      box-shadow: 0 0 ${size * 3}px ${Math.random() > 0.5 ? 'var(--c1)' : 'var(--c2)'};
      transform:translate(-50%,-50%);
      animation: particleFade 0.8s ease forwards;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFade {
      0% { opacity:1; transform:translate(-50%,-50%) scale(1); }
      100% { opacity:0; transform:translate(calc(-50% + ${(Math.random()-0.5)*40}px), calc(-50% - 30px)) scale(0); }
    }
  `;
  document.head.appendChild(style);
}

// ── PARALLAX NEBULA ──
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelector('.nebula-layer').style.transform = `translateY(${y * 0.3}px)`;
  document.querySelector('.grid-overlay').style.transform = `translateY(${y * 0.1}px)`;
});

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── CARD HOVER GLOW ──
document.querySelectorAll('.glass').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
    card.style.background = `
      radial-gradient(circle at ${x}% ${y}%, rgba(0,212,255,0.05) 0%, rgba(6,18,60,0.6) 60%),
      rgba(6,18,60,0.6)
    `;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});
