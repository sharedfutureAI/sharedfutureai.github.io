/* ============================================================
   Shared Future AI — JavaScript
   ============================================================ */

'use strict';

// ── Year ──────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Nav: scroll-based style ───────────────────────────────────
(function () {
  const nav = document.getElementById('nav');
  function update() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── Nav: mobile toggle ────────────────────────────────────────
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
})();

// ── Scroll Reveal ─────────────────────────────────────────────
(function () {
  const targets = document.querySelectorAll(
    '.manifesto-intro p, .section-label, .section-title, .section-intro, ' +
    '.principle-card, .research-item, .contact-item, .vision-quote, .vision-coda, ' +
    '.team-placeholder'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => io.observe(el));
})();

// ── Water canvas effect — runs on every .water-canvas ─────────
(function () {
  const C = '0, 102, 68'; // accent color channels

  const WAVES = [
    { amp: 42, freq: 0.0022, speed: 0.28, yFrac: 0.48, alpha: 0.055 },
    { amp: 30, freq: 0.0038, speed: 0.44, yFrac: 0.56, alpha: 0.045 },
    { amp: 20, freq: 0.0058, speed: 0.62, yFrac: 0.64, alpha: 0.036 },
    { amp: 13, freq: 0.0085, speed: 0.82, yFrac: 0.72, alpha: 0.026 },
    { amp:  8, freq: 0.012,  speed: 1.05, yFrac: 0.80, alpha: 0.018 },
    { amp:  5, freq: 0.017,  speed: 1.5,  yFrac: 0.88, alpha: 0.012 },
  ];

  function initWaterCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;
    const ripples = [];
    let STREAMS = [];

    function buildStreams() {
      STREAMS = Array.from({ length: 14 }, (_, i) => ({
        yFrac: 0.08 + (i / 13) * 0.86,
        phase:  Math.random() * Math.PI * 2,
        speed:  0.18 + Math.random() * 0.28,
        amp:    4  + Math.random() * 12,
        freq:   0.0018 + Math.random() * 0.003,
        alpha:  0.025 + Math.random() * 0.038,
        lw:     0.35 + Math.random() * 0.7,
      }));
    }

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function addRipple(x, y, isClick) {
      // tiny random jitter for organic feel
      const jx = (Math.random() - 0.5) * 4;
      const jy = (Math.random() - 0.5) * 4;
      if (isClick) {
        // click: 3 rings, still subtle
        ripples.push({ x: x + jx, y: y + jy, r: 0, maxR: 188, alpha: 0.13 });
        ripples.push({ x: x + jx, y: y + jy, r: 0, maxR: 54, alpha: 0.08 });
        ripples.push({ x: x + jx, y: y + jy, r: 0, maxR: 28, alpha: 0.05 });
      } else {
        // hover: 2 hair-thin, very faint rings
        ripples.push({ x: x + jx, y: y + jy, r: 0, maxR: 60, alpha: 0.13 });
        ripples.push({ x: x + jx, y: y + jy, r: 0, maxR: 24, alpha: 0.028 });
      }
    }

    function drawWaves() {
      WAVES.forEach(w => {
        const yBase = H * w.yFrac;
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W + 4; x += 3) {
          const y = yBase
            + Math.sin(x * w.freq + t * w.speed) * w.amp
            + Math.sin(x * w.freq * 1.9 - t * w.speed * 0.55) * (w.amp * 0.35)
            + Math.cos(x * w.freq * 0.7 + t * w.speed * 0.3)  * (w.amp * 0.18);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = `rgba(${C}, ${w.alpha})`;
        ctx.fill();
      });
    }

    function drawStreams() {
      STREAMS.forEach(s => {
        const yBase = H * s.yFrac;
        ctx.beginPath();
        for (let x = 0; x <= W + 4; x += 3) {
          const y = yBase
            + Math.sin(x * s.freq + t * s.speed + s.phase) * s.amp
            + Math.cos(x * s.freq * 2.3 - t * s.speed * 0.6 + s.phase) * (s.amp * 0.28);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${C}, ${s.alpha})`;
        ctx.lineWidth = s.lw;
        ctx.stroke();
      });
    }

    function drawRipples() {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const progress = rp.r / rp.maxR;
        // linger visible then fade — pow < 1 keeps it present longer before dropping off
        const a = rp.alpha * Math.pow(1 - progress, 1.3);
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, Math.max(rp.r, 0.5), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${C}, ${a.toFixed(4)})`;
        ctx.lineWidth = 0.65 * (1 - progress * 0.4);  // hair-thin
        ctx.stroke();
        rp.r += 1.4;  // constant, gentle expansion (~55px/s at 60fps)
        if (rp.r >= rp.maxR) ripples.splice(i, 1);
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawWaves();
      drawStreams();
      drawRipples();
      t += 0.007;
      requestAnimationFrame(loop);
    }

    // Ripple on mouse move over the parent container (throttled)
    let lastMove = 0;
    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', e => {
      const now = performance.now();
      if (now - lastMove < 160) return;
      lastMove = now;
      const rect = canvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top, false);
    });

    parent.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top, true);
    });

    window.addEventListener('resize', resize);
    resize();
    buildStreams();
    loop();
  }

  document.querySelectorAll('.water-canvas').forEach(initWaterCanvas);
})();

// ── Smooth active nav highlight on scroll ─────────────────────
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActive() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
