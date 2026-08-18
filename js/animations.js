/* ==========================================================================
   Campus Connect - Visual Animation Engine (animations.js)
   ========================================================================== */

let scrollObserver = null;

function initScrollObserver() {
  const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
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
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => scrollObserver.observe(el));
  } else {
    elements.forEach(el => el.classList.add('is-visible'));
  }
}

function renderLandingStats() {
  const total = (appState.complaints || []).length;
  const cleared = (appState.complaints || []).filter(c => c.status === 'Perfectly Completed').length;
  
  const statTotal = document.getElementById('lStatTotal');
  const statCleared = document.getElementById('lStatCleared');
  
  if (statTotal) statTotal.innerText = total;
  if (statCleared) statCleared.innerText = total ? Math.round((cleared / total) * 100) + '%' : '100%';

  const banner = document.getElementById('loggedInHomeBanner');
  const navSlot = document.getElementById('navRightAuthSlot');
  const userChip = document.getElementById('userChip');

  if (currentSession) {
    if (banner) banner.classList.remove('hidden');
    if (navSlot) navSlot.classList.add('hidden');
    if (userChip) {
      userChip.classList.remove('hidden');
      userChip.classList.add('flex');
    }
    
    const bannerName = document.getElementById('bannerUserName');
    const bannerRole = document.getElementById('bannerUserRole');
    if (bannerName) bannerName.innerText = currentSession.name;
    if (bannerRole) bannerRole.innerText = currentSession.role.toUpperCase();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollObserver();
  renderLandingStats();
});
