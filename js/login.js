/* ==========================================================================
   Campus Connect - Authentication & Login Engine (login.js)
   ========================================================================== */

/* ---------- ROLE SWITCHING & AUTH ---------- */

function switchRole(r) {
  ['Student', 'Faculty', 'Technician', 'Admin'].forEach(k => {
    const btn = document.getElementById('tab' + k);
    const form = document.getElementById('form' + k);
    if (k.toLowerCase() === r) {
      btn.className = 'flex-1 min-w-[80px] py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs shadow-md';
      form.classList.remove('hidden');
    } else {
      btn.className = 'flex-1 min-w-[80px] py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 border text-slate-700 dark:text-zinc-300 font-semibold text-xs';
      form.classList.add('hidden');
    }
  });
}

function loginStudent(e) {
  e.preventDefault();
  const gr = document.getElementById('stuGr').value.trim();
  const pass = document.getElementById('stuPass').value;
  const u = appState.users.find(x => x.grNo === gr && x.password === pass);
  if (!u) return toast('Invalid G.R. Number or Password', 'err');
  if (u.suspended) return toast('Your account is suspended. Contact Principal Office.', 'err');

  currentSession = { role: 'student', grNo: u.grNo, name: u.name, dept: u.dept, avatar: u.avatar || null, expiresAt: Date.now() + SESSION_SLA_MS };
  localStorage.setItem('campus_session', JSON.stringify(currentSession));
  toast(`Welcome ${u.name}`);
  runSessionTimer();
  const params = new URLSearchParams(window.location.search);
  const action = params.get('action');
  const actionQuery = action ? `&action=${encodeURIComponent(action)}` : '';
  setTimeout(() => {
    window.location.href = `roles.html?role=student${actionQuery}`;
  }, 400);
}

function loginFaculty(e) {
  e.preventDefault();
  const dept = document.getElementById('facDeptInput').value;
  const pass = document.getElementById('facPass').value;
  const f = appState.faculties.find(x => x.dept === dept && x.password === pass);
  if (!f) return toast('Invalid Faculty Credentials', 'err');

  currentSession = { role: 'faculty', name: dept + ' Faculty', dept: dept, expiresAt: Date.now() + SESSION_SLA_MS };
  localStorage.setItem('campus_session', JSON.stringify(currentSession));
  toast(`Faculty authorized: ${dept}`);
  runSessionTimer();
  setTimeout(() => {
    window.location.href = 'roles.html?role=faculty';
  }, 400);
}

function loginTechnician(e) {
  e.preventDefault();
  const id = document.getElementById('techId').value.trim().toUpperCase();
  const pass = document.getElementById('techPass').value;
  const t = appState.technicians.find(x => x.id === id && x.password === pass);
  if (!t) return toast('Invalid Technician credentials', 'err');
  if (!t.active) return toast('This technician account has been deactivated.', 'err');

  currentSession = { role: 'technician', id: t.id, techId: t.id, name: t.name, dept: t.dept, expiresAt: Date.now() + SESSION_SLA_MS };
  localStorage.setItem('campus_session', JSON.stringify(currentSession));
  toast(`Technician session open: ${t.name}`);
  runSessionTimer();
  setTimeout(() => {
    window.location.href = 'roles.html?role=technician';
  }, 400);
}

function loginAdmin(e) {
  e.preventDefault();
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value;
  if (user !== 'admin' || pass !== 'admin123') return toast('Admin Credentials Invalid', 'err');

  currentSession = { role: 'admin', username: 'admin', name: 'Principal Office Workspace', expiresAt: Date.now() + SESSION_SLA_MS };
  localStorage.setItem('campus_session', JSON.stringify(currentSession));
  toast('Admin terminal unlocked');
  runSessionTimer();
  setTimeout(() => {
    window.location.href = 'roles.html?role=admin';
  }, 400);
}

function logout(isAutoExpired = false) {
  currentSession = null;
  localStorage.removeItem('campus_session');
  if (sessionWatcherTimer) clearInterval(sessionWatcherTimer);

  document.getElementById('sessionTimerBadge').classList.add('hidden');
  document.getElementById('userChip').classList.add('hidden');
  document.getElementById('notifWrap').classList.add('hidden');
  document.getElementById('navRightAuthSlot').classList.remove('hidden');
  
  goHome();
  if (isAutoExpired === true) {
    toast('Your session has expired (15-Min SLA). Please sign in again.', 'err');
  } else {
    toast('Logged out successfully');
  }
}

function openRegister() { document.getElementById('modalRegister').classList.remove('hidden'); }
function closeRegister() { document.getElementById('modalRegister').classList.add('hidden'); }

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const gr = document.getElementById('regGr').value.trim();
  const dept = document.getElementById('regDept').value.trim();
  const pass = document.getElementById('regPass').value;

  if (appState.users.some(u => u.grNo === gr)) return toast('G.R. Number registered already', 'err');
  appState.users.push({ grNo: gr, name, dept, password: pass, avatar: null, warned: false, suspended: false });
  persist();
  closeRegister();
  toast('Student account generated! Log in below.');
  document.getElementById('stuGr').value = gr;
}

function showView(viewId) {
  const views = ['landing', 'auth', 'roles', 'student', 'faculty', 'technician', 'admin', 'portal', 'feed'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (typeof initScrollObserver === 'function') {
    setTimeout(initScrollObserver, 100);
  }
}

// Navigation profile synchronization is handled centrally by navigation.js


document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role');
  if (roleParam && ['student', 'faculty', 'technician', 'admin'].includes(roleParam)) {
    switchRole(roleParam);
  } else {
    switchRole('student');
  }
});
