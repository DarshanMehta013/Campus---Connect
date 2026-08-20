/* ==========================================================================
   Campus Connect - High-Speed Shared Navigation Engine (navigation.js)
   ========================================================================== */

let lastScrollY = window.scrollY;
let isHeaderHidden = false;
const prefetchedUrls = new Set();

/* ---------- HIGH-SPEED LINK PREFETCHER ---------- */
function prefetchUrl(url) {
  if (!url || prefetchedUrls.has(url)) return;
  if (url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) return;

  prefetchedUrls.add(url);

  // Use <link rel="prefetch"> for browser cache warming
  try {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  } catch (err) {
    // Fallback silent fetch
    fetch(url, { priority: 'low' }).catch(() => {});
  }
}

function initInstantPrefetch() {
  const links = document.querySelectorAll('a[href$=".html"], a[href="index.html"], .nav-route-btn');
  links.forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href) return;

    // Prefetch on hover, touchstart, or focus for an instant headstart
    anchor.addEventListener('pointerenter', () => prefetchUrl(href), { passive: true, once: true });
    anchor.addEventListener('touchstart', () => prefetchUrl(href), { passive: true, once: true });
    anchor.addEventListener('focus', () => prefetchUrl(href), { passive: true, once: true });
  });
}

/* ---------- DYNAMIC NAVBAR SCROLL PHYSICS ---------- */
function initDynamicNavbarAndScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  let ticking = false;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    if (scrollDelta > 8 && currentScrollY > 90 && !isHeaderHidden) {
      header.classList.add('navbar-hidden');
      isHeaderHidden = true;
    } else if ((scrollDelta < -6 || currentScrollY <= 40) && isHeaderHidden) {
      header.classList.remove('navbar-hidden');
      isHeaderHidden = false;
    }

    if (currentScrollY > 20) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }

    lastScrollY = Math.max(0, currentScrollY);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });
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

  if (typeof currentSession !== 'undefined' && currentSession) {
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
  if (typeof currentSession === 'undefined' || !currentSession) {
    window.location.href = 'login.html';
    return;
  }
  window.location.href = `roles.html?role=${encodeURIComponent(currentSession.role)}`;
}

function navigateToFileComplaint() {
  if (typeof currentSession !== 'undefined' && currentSession && currentSession.role === 'student') {
    if (window.location.pathname.includes('roles.html') || window.location.pathname.endsWith('/roles')) {
      if (typeof openComplaintModal === 'function') {
        openComplaintModal();
      }
    } else {
      window.location.href = 'roles.html?role=student&action=file';
    }
  } else if (typeof currentSession !== 'undefined' && currentSession && currentSession.role) {
    window.location.href = `roles.html?role=${encodeURIComponent(currentSession.role)}`;
  } else {
    window.location.href = 'login.html?role=student&action=file';
  }
}

function triggerEmergencyReport() {
  if (typeof currentSession !== 'undefined' && currentSession && currentSession.role === 'student') {
    if (window.location.pathname.includes('roles.html') || window.location.pathname.includes('portal.html')) {
      if (typeof openComplaintModal === 'function') {
        openComplaintModal();
        const p = document.getElementById('cPriority');
        const t = document.getElementById('cTitle');
        if (p) p.value = 'High';
        if (t) t.value = 'Emergency Hazard Report: ';
      }
    } else {
      window.location.href = 'roles.html?role=student&action=emergency';
    }
  } else {
    if (typeof goToAuth === 'function') {
      goToAuth('student');
    } else {
      window.location.href = 'login.html?role=student&action=emergency';
    }
    if (typeof toast === 'function') {
      toast('Please log in as a student to submit an emergency report.', 'err');
    }
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenuDrawer');
  if (menu) menu.classList.toggle('hidden');
}

/* ---------- INSTANT ZERO-FLASH PAGE TRANSITIONS ---------- */
function initPageTransitions() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDynamicNavbarAndScroll();
  initActiveNav();
  syncNavProfile();
  initInstantPrefetch();
  initPageTransitions();
});
