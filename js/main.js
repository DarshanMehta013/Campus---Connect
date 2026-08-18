/* ==========================================================================
   Campus Connect - Core Utilities & Data Repositories (main.js)
   ========================================================================== */

/* ---------- DATA REPOSITORIES & SESSION STORAGE ---------- */
const REPO_KEY = 'campus_connect_v3_zomato';
const SESSION_SLA_MS = 15 * 60 * 1000;

const criticalPriorityKeywords = ['open wire', 'naked wire', 'short circuit', 'current shock', 'sparks', 'hazard', 'fire sparks', 'wire spark'];
const mediumPriorityKeywords = ['fan', 'tubelight', 'flicker', 'light off', 'projector flickering', 'bench broken'];

let initialSeedDatabase = {
  users: [
    { grNo: '1001', name: 'Kabir Mehta', password: 'password', dept: 'Computer Department', avatar: null, warned: false, suspended: false },
    { grNo: '1002', name: 'Ananya Iyer', password: 'password', dept: 'Electrical Department', avatar: null, warned: false, suspended: false },
    { grNo: '1003', name: 'Rohan Verma', password: 'password', dept: 'Mechanical Department', avatar: null, warned: false, suspended: false },
    { grNo: '1004', name: 'Priya Sharma', password: 'password', dept: 'Civil Department', avatar: null, warned: false, suspended: false }
  ],
  faculties: [
    { dept: 'Computer Department', password: 'password' },
    { dept: 'Electrical Department', password: 'password' },
    { dept: 'Mechanical Department', password: 'password' },
    { dept: 'Civil Department', password: 'password' }
  ],
  technicians: [
    { id: 'TECH-01', name: 'Dilip Prasad', dept: 'Electrical Department', experience: 5, rating: 4.8, active: true, password: 'password' },
    { id: 'TECH-02', name: 'Jagdish Panchal', dept: 'Mechanical Department', experience: 8, rating: 4.7, active: true, password: 'password' },
    { id: 'TECH-03', name: 'Ankit Sharma', dept: 'Computer Department', experience: 3, rating: 4.9, active: true, password: 'password' },
    { id: 'TECH-04', name: 'Madan Lal', dept: 'Civil Department', experience: 12, rating: 4.5, active: true, password: 'password' }
  ],
  complaints: [
    {
      id: 'COMP-201',
      title: 'Danger: Open wire sparking in Corridor',
      category: 'Electrical Department',
      description: 'Naked copper wires are hanging loose from class 201 circuit board. Sparks visible when turning fan on.',
      location: 'Engineering Block A',
      priority: 'High',
      reportedBy: 'Kabir Mehta',
      reportedByGr: '1001',
      reportedAt: '16/07/2026 09:30 AM',
      status: 'Awaiting Faculty Forwarding',
      techId: null,
      techName: null,
      rejectionReason: '',
      deadline: '',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Filed', note: 'Submitted with raw photo evidence', time: '16/07/2026 09:30 AM', by: 'Kabir' },
        { s: 'Admin Verified', note: 'Sent to Electrical Department Faculty', time: '16/07/2026 10:15 AM', by: 'System' }
      ]
    },
    {
      id: 'COMP-202',
      title: 'Tubelight not working & Classroom Fan off',
      category: 'Electrical Department',
      description: 'Back row tubelight completely dark, fan makes buzzing noise.',
      location: 'Science Library Room 2',
      priority: 'Medium',
      reportedBy: 'Ananya Iyer',
      reportedByGr: '1002',
      reportedAt: '15/07/2026 02:15 PM',
      status: 'Perfectly Completed',
      techId: 'TECH-01',
      techName: 'Dilip Prasad',
      rejectionReason: '',
      deadline: '17/07/2026',
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=600',
      video: '',
      proofImg: 'https://images.unsplash.com/photo-1517254485319-68a189ddc2f1?q=80&w=600',
      remark: 'Replaced bulb and starter elements.',
      qaVerified: true,
      qaFeedback: 'Inspected classrooms, verified perfectly operational.',
      logs: [
        { s: 'Complaint Filed', note: 'Reported', time: '15/07/2026 02:15 PM', by: 'Ananya' },
        { s: 'Admin Verified', note: 'Dispatched to Electrical Department', time: '15/07/2026 02:30 PM', by: 'Admin' },
        { s: 'Faculty Forwarded', note: 'Routed to Technician Dilip with deadline 17/07/2026', time: '15/07/2026 03:00 PM', by: 'Electrical Faculty' },
        { s: 'Resolution Started', note: 'Accepted by Technician', time: '15/07/2026 03:30 PM', by: 'Dilip' },
        { s: 'Resolution Proof Uploaded', note: 'Proof uploaded', time: '16/07/2026 10:00 AM', by: 'Dilip' },
        { s: 'Faculty QA Approved', note: 'Perfectly Completed verified', time: '16/07/2026 11:30 AM', by: 'Faculty Office' }
      ]
    },
    {
      id: 'COMP-203',
      title: 'Lab 4 Server Rack Switch Network Failure',
      category: 'Computer Department',
      description: 'Main rack switch in CS Lab 4 stopped responding. Network dropped for 40 student PCs during practical exam.',
      location: 'CS Block Lab 4',
      priority: 'High',
      reportedBy: 'Kabir Mehta',
      reportedByGr: '1001',
      reportedAt: '16/07/2026 11:00 AM',
      status: 'Resolution Started',
      techId: 'TECH-03',
      techName: 'Ankit Sharma',
      rejectionReason: '',
      deadline: '17/07/2026',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Filed', note: 'Auto High priority', time: '16/07/2026 11:00 AM', by: 'Kabir' },
        { s: 'Admin Verified', note: 'Forwarded to CS Faculty', time: '16/07/2026 11:10 AM', by: 'Admin' },
        { s: 'Resolution Started', note: 'Assigned to Ankit', time: '16/07/2026 11:30 AM', by: 'Ankit' }
      ]
    },
    {
      id: 'COMP-204',
      title: 'Smartboard & Projector Signal Flickering',
      category: 'Computer Department',
      description: 'HDMI output on smartboard flickering and cutting video signal every 2 minutes during lectures.',
      location: 'CS Seminar Hall B',
      priority: 'Medium',
      reportedBy: 'Kabir Mehta',
      reportedByGr: '1001',
      reportedAt: '16/07/2026 01:20 PM',
      status: 'Awaiting Faculty Forwarding',
      techId: null,
      techName: null,
      rejectionReason: '',
      deadline: '',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Filed', note: 'Reported by Student', time: '16/07/2026 01:20 PM', by: 'Kabir' },
        { s: 'Admin Verified', note: 'Routed to CS Dept', time: '16/07/2026 01:45 PM', by: 'System' }
      ]
    },
    {
      id: 'COMP-205',
      title: 'Workshop Lathe Machine Emergency Stop Stuck',
      category: 'Mechanical Department',
      description: 'Emergency cut-off switch on Lathe Unit 3 is jammed depressed. Machine unable to power on safely.',
      location: 'Central Mechanical Workshop',
      priority: 'High',
      reportedBy: 'Rohan Verma',
      reportedByGr: '1003',
      reportedAt: '16/07/2026 10:00 AM',
      status: 'Assigned to Technician',
      techId: 'TECH-02',
      techName: 'Jagdish Panchal',
      rejectionReason: '',
      deadline: '18/07/2026',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Filed', note: 'Safety risk identified', time: '16/07/2026 10:00 AM', by: 'Rohan' },
        { s: 'Admin Verified', note: 'Dispatched to Mech Dept', time: '16/07/2026 10:30 AM', by: 'Admin' }
      ]
    },
    {
      id: 'COMP-206',
      title: 'Drafting Tables Clamps & Vice Alignment Fix',
      category: 'Mechanical Department',
      description: 'Three drafting tables in CAD Drawing Hall have loose clamps and unaligned tilt levers.',
      location: 'Mech Drawing Hall 1',
      priority: 'Low',
      reportedBy: 'Rohan Verma',
      reportedByGr: '1003',
      reportedAt: '14/07/2026 03:00 PM',
      status: 'Perfectly Completed',
      techId: 'TECH-02',
      techName: 'Jagdish Panchal',
      rejectionReason: '',
      deadline: '16/07/2026',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600',
      video: '',
      proofImg: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600',
      remark: 'Tightened Vice clamps and replaced tilt lever bolts.',
      qaVerified: true,
      qaFeedback: 'Inspected drawing tables, verified all secure.',
      logs: [
        { s: 'Complaint Filed', note: 'Reported', time: '14/07/2026 03:00 PM', by: 'Rohan' },
        { s: 'Faculty QA Approved', note: 'Verified by Mech Faculty', time: '16/07/2026 04:00 PM', by: 'Mech Faculty' }
      ]
    },
    {
      id: 'COMP-207',
      title: 'Overhead Water Pipe Seepage & Damp Ceiling',
      category: 'Civil Department',
      description: 'Water leaking from overhead supply pipe causing plaster flaking near concrete testing area.',
      location: 'Civil Block Basement Lab',
      priority: 'High',
      reportedBy: 'Priya Sharma',
      reportedByGr: '1004',
      reportedAt: '16/07/2026 08:45 AM',
      status: 'Resolution Started',
      techId: 'TECH-04',
      techName: 'Madan Lal',
      rejectionReason: '',
      deadline: '17/07/2026',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Filed', note: 'Water seepage flagged', time: '16/07/2026 08:45 AM', by: 'Priya' },
        { s: 'Resolution Started', note: 'Pipe sealing under process', time: '16/07/2026 11:00 AM', by: 'Madan' }
      ]
    },
    {
      id: 'COMP-208',
      title: 'Damaged Paver Blocks near Dept Quadrangle',
      category: 'Civil Department',
      description: 'Sunken and loose paver blocks causing tripping hazard at the main department entrance pathway.',
      location: 'Civil Department Entrance',
      priority: 'Medium',
      reportedBy: 'Priya Sharma',
      reportedByGr: '1004',
      reportedAt: '16/07/2026 02:00 PM',
      status: 'Pending Admin Verification',
      techId: null,
      techName: null,
      rejectionReason: '',
      deadline: '',
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Filed', note: 'Submitted for verification', time: '16/07/2026 02:00 PM', by: 'Priya' }
      ]
    }
  ],
  notifs: [
    { id: 'N1', forGr: '1001', forDept: null, forTech: null, text: 'Admin routed COMP-201 to Electrical Faculty', time: '16/07/2026 10:15 AM', read: false }
  ]
};

let appState = JSON.parse(localStorage.getItem(REPO_KEY)) || initialSeedDatabase;
function persist() { localStorage.setItem(REPO_KEY, JSON.stringify(appState)); }

let currentSession = null;
let activeAdminViewTab = 'dash';
let tmpBase64ProfileAvatar = null;
let qaApprovalState = true;
let sessionWatcherTimer = null;


/* ---------- SESSION WATCHDOG ---------- */
function runSessionTimer() {
  if (sessionWatcherTimer) clearInterval(sessionWatcherTimer);
  const badge = document.getElementById('sessionTimerBadge');
  const counter = document.getElementById('sessionCountdown');
  if (!badge || !counter) return;

  badge.classList.remove('hidden');
  badge.classList.add('flex');

  sessionWatcherTimer = setInterval(() => {
    if (!currentSession || !currentSession.expiresAt) {
      clearInterval(sessionWatcherTimer);
      return;
    }

    const remainingMs = currentSession.expiresAt - Date.now();
    if (remainingMs <= 0) {
      clearInterval(sessionWatcherTimer);
      logout(true);
      return;
    }

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    counter.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (remainingMs < 3 * 60 * 1000) {
      badge.classList.remove('bg-amber-500/10', 'text-amber-600', 'dark:bg-amber-500/20', 'dark:text-amber-400');
      badge.classList.add('bg-red-600', 'text-white', 'animate-pulse');
    } else {
      badge.classList.remove('bg-red-600', 'text-white', 'animate-pulse');
      badge.classList.add('bg-amber-500/10', 'text-amber-600', 'dark:bg-amber-500/20', 'dark:text-amber-400');
    }
  }, 1000);
}


/* ---------- GENERAL UTILS & TOASTS ---------- */
function toast(msg, category = 'ok') {
  const box = document.getElementById('toastBox');
  const el = document.createElement('div');
  el.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border backdrop-blur-md ${category === 'err' ? 'bg-red-50 dark:bg-red-950/60 border-red-200 text-red-700 dark:text-red-300' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800'}`;
  el.innerHTML = `<i class="fa-solid ${category === 'err' ? 'fa-circle-xmark text-red-500' : 'fa-circle-check text-emerald-600'} mr-2"></i>${msg}`;
  box.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(-10px)'; setTimeout(() => el.remove(), 300); }, 3500);
}

function nowStr() {
  return new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function scrollToId(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }


/* ---------- PROFILE STORAGE SYNC ---------- */
function openProfileModal() {
  if (!currentSession) return;
  const title = document.getElementById('profileModalTitle');
  const deptGroup = document.getElementById('profDeptGroup');
  
  if (currentSession.role === 'student') {
    title.innerText = "Edit Student Profile Config";
    deptGroup.classList.remove('hidden');
    const u = appState.users.find(x => x.grNo === currentSession.grNo);
    document.getElementById('profName').value = u ? u.name : currentSession.name;
    document.getElementById('profDept').value = u ? u.dept : currentSession.dept;
    document.getElementById('profPass').value = u ? u.password : 'password';
    document.getElementById('profImgUrl').value = u ? (u.avatar || '') : '';
    tmpBase64ProfileAvatar = u ? u.avatar : null;
  } else if (currentSession.role === 'technician') {
    title.innerText = "Modify Tech Profile Config";
    deptGroup.classList.remove('hidden');
    const t = appState.technicians.find(x => x.id === currentSession.techId);
    document.getElementById('profName').value = t ? t.name : currentSession.name;
    document.getElementById('profDept').value = t ? t.dept : currentSession.dept;
    document.getElementById('profPass').value = t ? t.password : 'password';
    document.getElementById('profImgUrl').value = '';
    tmpBase64ProfileAvatar = null;
  } else {
    title.innerText = "Profile Credentials Settings";
    deptGroup.classList.add('hidden');
    document.getElementById('profName').value = currentSession.name;
    document.getElementById('profPass').value = 'password';
    document.getElementById('profImgUrl').value = '';
    tmpBase64ProfileAvatar = null;
  }
  document.getElementById('modalProfile').classList.remove('hidden');
}

function closeProfileModal() { document.getElementById('modalProfile').classList.add('hidden'); }

function handleProfileImgUpload(input) {
  const file = input.files[0]; if (!file) return;
  const r = new FileReader(); r.onload = e => {
    tmpBase64ProfileAvatar = e.target.result;
    document.getElementById('profImgUrl').value = ''; 
  }; r.readAsDataURL(file);
}

function saveProfile(e) {
  e.preventDefault();
  const name = document.getElementById('profName').value.trim();
  const dept = document.getElementById('profDept').value.trim();
  const pass = document.getElementById('profPass').value;
  const url = document.getElementById('profImgUrl').value.trim();
  let finalAvatar = url || tmpBase64ProfileAvatar || null;

  if (currentSession.role === 'student') {
    const u = appState.users.find(x => x.grNo === currentSession.grNo);
    if (u) { u.name = name; u.dept = dept; u.password = pass; u.avatar = finalAvatar; persist(); }
    currentSession.name = name; currentSession.dept = dept; currentSession.avatar = finalAvatar;
  } else if (currentSession.role === 'technician') {
    const t = appState.technicians.find(x => x.id === currentSession.techId);
    if (t) { t.name = name; t.dept = dept; t.password = pass; persist(); }
    currentSession.name = name; currentSession.dept = dept;
  }
  
  localStorage.setItem('campus_session', JSON.stringify(currentSession));
  closeProfileModal();
  toast('Profile updated successfully!');
  renderByRole();
}


/* ---------- LIVE NOTIFICATIONS WORKSPACE ---------- */
function toggleNotif() { document.getElementById('notifDrop').classList.toggle('hidden'); }

function renderNotifs() {
  if (!currentSession) return;
  let notifications = [];
  
  if (currentSession.role === 'student') {
    notifications = appState.notifs.filter(n => n.forGr === currentSession.grNo || n.forGr === null);
  } else if (currentSession.role === 'faculty') {
    notifications = appState.notifs.filter(n => n.forDept === currentSession.dept || n.forDept === null);
  } else if (currentSession.role === 'technician') {
    notifications = appState.notifs.filter(n => n.forTech === currentSession.techId || n.forTech === null);
  } else {
    notifications = appState.notifs;
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  document.getElementById('notifDot').classList.toggle('hidden', unreadCount === 0);

  const container = document.getElementById('notifList');
  container.innerHTML = '';
  
  if (notifications.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-xs text-slate-400">No new notifications</div>';
    return;
  }

  notifications.slice(0, 15).forEach(n => {
    const el = document.createElement('div');
    el.className = `p-4 border-b text-xs ${!n.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`;
    el.innerHTML = `<p class="font-medium">${n.text}</p><span class="text-[10px] text-slate-500 block mt-1">${n.time}</span>`;
    container.appendChild(el);
  });
}

function markAllRead() {
  if (!currentSession) return;
  appState.notifs.forEach(n => {
    if (currentSession.role === 'student' && (n.forGr === currentSession.grNo || n.forGr === null)) n.read = true;
    if (currentSession.role === 'faculty' && (n.forDept === currentSession.dept || n.forDept === null)) n.read = true;
    if (currentSession.role === 'technician' && (n.forTech === currentSession.techId || n.forTech === null)) n.read = true;
    if (currentSession.role === 'admin') n.read = true;
  });
  persist();
  renderNotifs();
  toast('Notifications marked read.');
}


// Global Lightbox
function openLightbox(src, caption, type = 'image') {
  const container = document.getElementById('lightboxMediaContainer');
  if (!container) return;
  container.innerHTML = '';
  if (type === 'video') {
    container.innerHTML = `<video src="${src}" controls autoplay class="max-w-full max-h-[70vh] rounded-2xl shadow-2xl"></video>`;
  } else {
    container.innerHTML = `<img src="${src}" class="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl">`;
  }
  const cap = document.getElementById('bigCap');
  if (cap) cap.innerText = caption || '';
  document.getElementById('modalImg')?.classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('modalImg')?.classList.add('hidden');
  const container = document.getElementById('lightboxMediaContainer');
  if (container) container.innerHTML = '';
}

// Global Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  localStorage.setItem('campus_connect_theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('campus_connect_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = 'fa-solid fa-sun';
  }

  if (currentSession) {
    runSessionTimer();
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('#notifWrap')) {
      document.getElementById('notifDrop')?.classList.add('hidden');
    }
  });
});
