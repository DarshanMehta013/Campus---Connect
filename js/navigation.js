/* ==========================================================================
   Campus Connect - Shared Navigation Engine (navigation.js)
   ========================================================================== */

let lastScrollY = window.scrollY;
let isHeaderHidden = false;

/* ---------- DYNAMIC NAVBAR SCROLL PHYSICS ---------- */
function initDynamicNavbarAndScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    if (scrollDelta > 8 && currentScrollY > 80 && !isHeaderHidden) {
      header.classList.add('navbar-hidden');
      isHeaderHidden = true;
    } else if ((scrollDelta < -8 || currentScrollY <= 40) && isHeaderHidden) {
      header.classList.remove('navbar-hidden');
      isHeaderHidden = false;
    }

    if (currentScrollY > 20) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }

    lastScrollY = Math.max(0, currentScrollY);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ---------- ACTIVE NAVBAR STATE DETECTION ---------- */
function initActiveNav() {
  const path = window.location.pathname.toLowerCase();
  
  document.querySelectorAll('.nav-route-btn, .mobile-nav-btn').forEach(btn => {
    btn.classList.remove('nav-active-pill');
  });

  let activeId = 'nav-item-home';
  let activeMobileId = 'mob-nav-home';

  if (path.includes('portal.html') || path.endsWith('/portal')) {
    activeId = 'nav-item-portal';
    activeMobileId = 'mob-nav-portal';
  } else if (path.includes('roles.html') || path.endsWith('/roles')) {
    activeId = 'nav-item-roles';
    activeMobileId = 'mob-nav-roles';
  } else if (path.includes('feed.html') || path.endsWith('/feed')) {
    activeId = 'nav-item-feed';
    activeMobileId = 'mob-nav-feed';
  } else if (path.includes('login.html') || path.endsWith('/login')) {
    activeId = 'navLoginBtn';
    activeMobileId = 'mob-nav-login';
  } else {
    activeId = 'nav-item-home';
    activeMobileId = 'mob-nav-home';
  }

  const activeBtn = document.getElementById(activeId);
  if (activeBtn) activeBtn.classList.add('nav-active-pill');

  const activeMobBtn = document.getElementById(activeMobileId);
  if (activeMobBtn) activeMobBtn.classList.add('nav-active-pill');
}

/* ---------- NAVBAR PROFILE & SESSION SYNCHRONIZATION ---------- */
function syncNavProfile() {
  const chip = document.getElementById('userChip');
  const chipName = document.getElementById('chipName');
  const chipRole = document.getElementById('chipRole');
  const chipAvatar = document.getElementById('chipAvatar');
  const navAuthSlot = document.getElementById('navRightAuthSlot');
  const notifWrap = document.getElementById('notifWrap');

  if (!chip) return;

  if (currentSession) {
    if (navAuthSlot) navAuthSlot.classList.add('hidden');
    chip.classList.remove('hidden');
    chip.classList.add('flex');
    if (notifWrap) notifWrap.classList.remove('hidden');

    if (chipName) chipName.textContent = currentSession.name;
    if (chipRole) {
      let roleLabel = (currentSession.role || '').toUpperCase();
      if (currentSession.role === 'faculty') roleLabel = `${currentSession.dept} Faculty`;
      if (currentSession.role === 'technician') roleLabel = `Tech (${currentSession.dept})`;
      chipRole.textContent = roleLabel;
    }

    if (chipAvatar) {
      if (currentSession.avatar) {
        chipAvatar.style.backgroundImage = `url(${currentSession.avatar})`;
        chipAvatar.textContent = '';
      } else {
        chipAvatar.style.backgroundImage = 'none';
        chipAvatar.textContent = (currentSession.name || 'U').charAt(0);
      }
    }
  } else {
    if (navAuthSlot) navAuthSlot.classList.remove('hidden');
    chip.classList.add('hidden');
    chip.classList.remove('flex');
    if (notifWrap) notifWrap.classList.add('hidden');
  }
}

/* ---------- NAVIGATION HELPERS ---------- */
function goHome() {
  window.location.href = 'index.html';
}

function goToAuth(preselectRole = 'student') {
  window.location.href = `login.html?role=${encodeURIComponent(preselectRole)}`;
}

function openDashboardView() {
  if (!currentSession) {
    window.location.href = 'login.html';
    return;
  }
  window.location.href = `roles.html?role=${encodeURIComponent(currentSession.role)}`;
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenuDrawer');
  if (menu) menu.classList.toggle('hidden');
}

function initPageTransitions() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  document.querySelectorAll('a[href$=".html"], a[href="index.html"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetUrl = this.getAttribute('href');
      if (!targetUrl || targetUrl.startsWith('#') || targetUrl.startsWith('javascript:')) return;
      if (this.target === '_blank') return;

      const mainEl = document.querySelector('main');
      if (mainEl) {
        e.preventDefault();
        mainEl.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
        mainEl.style.opacity = '0';
        mainEl.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 220);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDynamicNavbarAndScroll();
  initActiveNav();
  syncNavProfile();
  initPageTransitions();
});
