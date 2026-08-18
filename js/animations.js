/* ==========================================================================
   Campus Connect - 3D Visual & Animation Engine (animations.js)
   ========================================================================== */

let scrollObserver = null;

/* ---------- SCROLL-BASED CONTENT REVEAL (INTERSECTION OBSERVER) ---------- */
function initScrollObserver() {
  const revealSelectors = '.reveal-on-scroll:not(.is-visible), .reveal-scale:not(.is-visible), .reveal-slide-left:not(.is-visible), .reveal-slide-right:not(.is-visible)';
  const elements = document.querySelectorAll(revealSelectors);
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    if (scrollObserver) scrollObserver.disconnect();

    scrollObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    elements.forEach(el => scrollObserver.observe(el));
  } else {
    elements.forEach(el => el.classList.add('is-visible'));
  }
}

/* ---------- 3D CARD TILT & SPECULAR GLARE ENGINE ---------- */
function init3DTiltCards() {
  // Check if reduced motion is requested
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Skip high 3D tilt calculations on small touch-only devices for performance
  const isTouchMobile = ('ontouchstart' in window) && window.innerWidth < 768;

  const tiltTargets = document.querySelectorAll('.card-3d, [data-tilt], .stat-card-3d, .step-card-3d, .role-select-card');

  tiltTargets.forEach(card => {
    if (card.dataset.tiltInitialized) return;
    card.dataset.tiltInitialized = 'true';

    let rafId = null;
    let rect = card.getBoundingClientRect();

    // Create glare overlay if not exists
    let glare = card.querySelector('.card-glare-effect');
    if (!glare && !card.classList.contains('no-glare')) {
      glare = document.createElement('div');
      glare.className = 'card-glare-effect pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 z-10';
      glare.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)';
      card.appendChild(glare);
    }

    function onPointerEnter() {
      rect = card.getBoundingClientRect();
      card.style.transition = 'none';
      if (glare) glare.style.opacity = '1';
    }

    function onPointerMove(e) {
      if (isTouchMobile) return;
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxTilt = card.dataset.tiltMax ? parseFloat(card.dataset.tiltMax) : 8;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px) scale3d(1.015, 1.015, 1.015)`;

        if (glare) {
          const glareX = (x / rect.width) * 100;
          const glareY = (y / rect.height) * 100;
          const isDark = document.documentElement.classList.contains('dark');
          glare.style.background = isDark
            ? `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(34, 211, 238, 0.18) 0%, rgba(124, 58, 237, 0.1) 40%, rgba(0,0,0,0) 70%)`
            : `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 65%)`;
        }
      });
    }

    function onPointerLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
      if (glare) glare.style.opacity = '0';
    }

    card.addEventListener('pointerenter', onPointerEnter, { passive: true });
    card.addEventListener('pointermove', onPointerMove, { passive: true });
    card.addEventListener('pointerleave', onPointerLeave, { passive: true });
  });
}

/* ---------- ANIMATED STAT COUNTER ---------- */
function animateValue(obj, start, end, duration) {
  if (!obj) return;
  let startTimestamp = null;
  const isPercent = String(end).includes('%');
  const numEnd = parseInt(end, 10) || 0;
  const numStart = parseInt(start, 10) || 0;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
    const current = Math.floor(easeProgress * (numEnd - numStart) + numStart);
    obj.innerText = isPercent ? current + '%' : current;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerText = end;
    }
  };
  window.requestAnimationFrame(step);
}

/* ---------- LANDING STATS & USER STATE RENDERER ---------- */
function renderLandingStats() {
  if (typeof appState === 'undefined') return;

  const total = (appState.complaints || []).length;
  const cleared = (appState.complaints || []).filter(c => c.status === 'Perfectly Completed').length;
  
  const statTotal = document.getElementById('lStatTotal');
  const statCleared = document.getElementById('lStatCleared');
  
  if (statTotal) animateValue(statTotal, 0, total, 1000);
  if (statCleared) {
    const pct = total ? Math.round((cleared / total) * 100) + '%' : '100%';
    animateValue(statCleared, 0, pct, 1200);
  }

  const banner = document.getElementById('loggedInHomeBanner');
  const navSlot = document.getElementById('navRightAuthSlot');
  const userChip = document.getElementById('userChip');

  if (typeof currentSession !== 'undefined' && currentSession) {
    if (banner) banner.classList.remove('hidden');
    if (navSlot) navSlot.classList.add('hidden');
    if (userChip) {
      userChip.classList.remove('hidden');
      userChip.classList.add('flex');
    }
    
    const bannerName = document.getElementById('bannerUserName');
    const bannerRole = document.getElementById('bannerUserRole');
    if (bannerName) bannerName.innerText = currentSession.name;
    if (bannerRole) bannerRole.innerText = (currentSession.role || '').toUpperCase();
  }
}

/* ---------- INITIALIZE EVERYTHING ON DOM READY ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initScrollObserver();
  init3DTiltCards();
  renderLandingStats();
});
