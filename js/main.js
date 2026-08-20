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
      status: 'Approved by Admin',
      current_status: 'Approved by Admin',
      stage: 2,
      admin_status: 'Approved',
      technician_status: 'Pending',
      technician_action: null,
      work_status: 'Not Started',
      faculty_status: 'Pending',
      techId: 'TECH-01',
      techName: 'Dilip Prasad',
      deadline: '22/08/2026',
      rejectionReason: '',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Submitted', note: 'Submitted with raw photo evidence', time: '16/07/2026 09:30 AM', by: 'Kabir Mehta' },
        { s: 'Admin Verified', note: 'Approved by Admin and dispatched to Technician Dilip Prasad', time: '16/07/2026 10:15 AM', by: 'Admin Office' }
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
      status: 'Completed',
      current_status: 'Completed',
      stage: 7,
      admin_status: 'Approved',
      technician_status: 'Completed',
      technician_action: 'Accepted',
      work_status: 'Completed',
      faculty_status: 'Verified',
      technician_completion_date: '16/07/2026 10:00 AM',
      faculty_verification_date: '16/07/2026 11:30 AM',
      techId: 'TECH-01',
      techName: 'Dilip Prasad',
      deadline: '17/07/2026',
      rejectionReason: '',
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=600',
      video: '',
      proofImg: 'https://images.unsplash.com/photo-1517254485319-68a189ddc2f1?q=80&w=600',
      remark: 'Replaced bulb and starter elements.',
      qaVerified: true,
      qaFeedback: 'Inspected classrooms, verified perfectly operational.',
      logs: [
        { s: 'Complaint Submitted', note: 'Reported by Student', time: '15/07/2026 02:15 PM', by: 'Ananya Iyer' },
        { s: 'Admin Verified', note: 'Approved by Admin and dispatched to Dilip Prasad', time: '15/07/2026 02:30 PM', by: 'Admin Office' },
        { s: 'Technician Accepted', note: 'Accepted by Technician Dilip Prasad', time: '15/07/2026 03:30 PM', by: 'Dilip Prasad' },
        { s: 'Work in Progress', note: 'Repair and electrical replacement in progress', time: '15/07/2026 04:00 PM', by: 'Dilip Prasad' },
        { s: 'Technician Completed', note: 'Work finished, proof uploaded', time: '16/07/2026 10:00 AM', by: 'Dilip Prasad' },
        { s: 'Faculty Verified', note: 'Audited and verified by Electrical Faculty', time: '16/07/2026 11:30 AM', by: 'Electrical Faculty' },
        { s: 'Completed', note: 'Complaint fully completed and closed.', time: '16/07/2026 11:30 AM', by: 'System' }
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
      status: 'Work in Progress',
      current_status: 'Work in Progress',
      stage: 4,
      admin_status: 'Approved',
      technician_status: 'Accepted',
      technician_action: 'Accepted',
      work_status: 'In Progress',
      faculty_status: 'Pending',
      techId: 'TECH-03',
      techName: 'Ankit Sharma',
      deadline: '17/07/2026',
      rejectionReason: '',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Submitted', note: 'Auto High priority', time: '16/07/2026 11:00 AM', by: 'Kabir Mehta' },
        { s: 'Admin Verified', note: 'Approved by Admin and dispatched to Ankit Sharma', time: '16/07/2026 11:10 AM', by: 'Admin Office' },
        { s: 'Technician Accepted', note: 'Accepted work order by Ankit Sharma', time: '16/07/2026 11:20 AM', by: 'Ankit Sharma' },
        { s: 'Work in Progress', note: 'Switch diagnostics and patch cable replacement underway', time: '16/07/2026 11:30 AM', by: 'Ankit Sharma' }
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
      status: 'Work Completed by Technician',
      current_status: 'Work Completed by Technician',
      stage: 5,
      admin_status: 'Approved',
      technician_status: 'Completed',
      technician_action: 'Accepted',
      work_status: 'Completed',
      faculty_status: 'Pending',
      technician_completion_date: '16/07/2026 03:00 PM',
      techId: 'TECH-03',
      techName: 'Ankit Sharma',
      deadline: '18/07/2026',
      rejectionReason: '',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600',
      video: '',
      proofImg: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600',
      remark: 'Replaced faulty HDMI cable & re-calibrated projector output.',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Submitted', note: 'Reported by Student', time: '16/07/2026 01:20 PM', by: 'Kabir Mehta' },
        { s: 'Admin Verified', note: 'Approved and dispatched to Ankit Sharma', time: '16/07/2026 01:45 PM', by: 'Admin Office' },
        { s: 'Technician Accepted', note: 'Accepted work order by Ankit Sharma', time: '16/07/2026 02:00 PM', by: 'Ankit Sharma' },
        { s: 'Work in Progress', note: 'Display port recabling in progress', time: '16/07/2026 02:15 PM', by: 'Ankit Sharma' },
        { s: 'Technician Completed', note: 'Completed and submitted for Faculty Verification', time: '16/07/2026 03:00 PM', by: 'Ankit Sharma' }
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
      status: 'Approved by Admin',
      current_status: 'Approved by Admin',
      stage: 2,
      admin_status: 'Approved',
      technician_status: 'Pending',
      technician_action: null,
      work_status: 'Not Started',
      faculty_status: 'Pending',
      techId: 'TECH-02',
      techName: 'Jagdish Panchal',
      deadline: '18/07/2026',
      rejectionReason: '',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Submitted', note: 'Safety risk identified', time: '16/07/2026 10:00 AM', by: 'Rohan Verma' },
        { s: 'Admin Verified', note: 'Approved by Admin and dispatched to Jagdish Panchal', time: '16/07/2026 10:30 AM', by: 'Admin Office' }
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
      status: 'Complaint Submitted',
      current_status: 'Complaint Submitted',
      stage: 1,
      admin_status: 'Pending',
      technician_status: 'Pending',
      technician_action: null,
      work_status: 'Not Started',
      faculty_status: 'Pending',
      techId: null,
      techName: null,
      deadline: '',
      rejectionReason: '',
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600',
      video: '',
      proofImg: '',
      remark: '',
      qaVerified: false,
      qaFeedback: '',
      logs: [
        { s: 'Complaint Submitted', note: 'Submitted for Admin Verification', time: '16/07/2026 02:00 PM', by: 'Priya Sharma' }
      ]
    }
  ],
  notifs: [
    { id: 'N1', forGr: '1001', forDept: null, forTech: null, text: 'Admin verified and dispatched COMP-201 to Dilip Prasad', time: '16/07/2026 10:15 AM', read: false }
  ]
};

// Stage & Progress Helper
function getComplaintStageInfo(c) {
  const status = c.status || c.current_status || 'Complaint Submitted';
  
  if (status === 'Rejected by Admin' || c.admin_status === 'Rejected') {
    return {
      stage: 0,
      percent: 100,
      isRejected: true,
      rejectedBy: 'Admin',
      statusText: 'Rejected by Admin',
      badgeClass: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40'
    };
  }
  
  if (status === 'Rejected by Technician' || c.technician_status === 'Rejected') {
    return {
      stage: 0,
      percent: 100,
      isRejected: true,
      rejectedBy: 'Technician',
      statusText: 'Rejected by Technician',
      badgeClass: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40'
    };
  }

  let stage = 1;
  let statusText = 'Complaint Submitted';
  let badgeClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40';

  if (status === 'Complaint Submitted' || status === 'Pending Admin Verification') {
    stage = 1;
    statusText = 'Complaint Submitted';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40';
  } else if (status === 'Approved by Admin' || status === 'Awaiting Faculty Forwarding' || status === 'Assigned to Technician') {
    stage = 2;
    statusText = 'Approved by Admin';
    badgeClass = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40';
  } else if (status === 'Accepted by Technician') {
    stage = 3;
    statusText = 'Accepted by Technician';
    badgeClass = 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40';
  } else if (status === 'Work in Progress' || status === 'Resolution Started') {
    stage = 4;
    statusText = 'Work in Progress';
    badgeClass = 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40';
  } else if (status === 'Work Completed by Technician' || status === 'Pending Faculty Verification') {
    stage = 5;
    statusText = 'Work Completed by Technician';
    badgeClass = 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40';
  } else if (status === 'Faculty Verified') {
    stage = 6;
    statusText = 'Faculty Verified';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
  } else if (status === 'Completed' || status === 'Completed ✅' || status === 'Perfectly Completed') {
    stage = 7;
    statusText = 'Completed ✅';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
  }

  const percentMap = {
    1: 14,
    2: 28,
    3: 43,
    4: 57,
    5: 71,
    6: 86,
    7: 100
  };

  return {
    stage,
    percent: percentMap[stage] || 14,
    isRejected: false,
    statusText,
    badgeClass
  };
}

function normalizeComplaints(complaints) {
  if (!Array.isArray(complaints)) return [];
  return complaints.map(c => {
    let status = c.status || c.current_status || 'Complaint Submitted';
    if (status === 'Pending Admin Verification') status = 'Complaint Submitted';
    if (status === 'Awaiting Faculty Forwarding') status = 'Approved by Admin';
    if (status === 'Assigned to Technician') status = 'Approved by Admin';
    if (status === 'Resolution Started') status = 'Work in Progress';
    if (status === 'Pending Faculty Verification') status = 'Work Completed by Technician';
    if (status === 'Perfectly Completed') status = 'Completed';

    let stage = c.stage;
    if (!stage) {
      if (status === 'Complaint Submitted') stage = 1;
      else if (status === 'Approved by Admin') stage = 2;
      else if (status === 'Accepted by Technician') stage = 3;
      else if (status === 'Work in Progress') stage = 4;
      else if (status === 'Work Completed by Technician') stage = 5;
      else if (status === 'Faculty Verified') stage = 6;
      else if (status === 'Completed' || status === 'Completed ✅') stage = 7;
      else if (status.includes('Rejected')) stage = 0;
      else stage = 1;
    }

    return {
      id: c.id,
      title: c.title || 'Untitled Complaint',
      category: c.category || c.dept || 'Computer Department',
      description: c.description || c.desc || '',
      location: c.location || 'Campus',
      priority: c.priority || 'Low',
      reportedBy: c.reportedBy || 'Student',
      reportedByGr: c.reportedByGr || '1001',
      reportedAt: c.reportedAt || nowStr(),
      status: status,
      current_status: status,
      stage: stage,
      admin_status: c.admin_status || (stage >= 2 ? 'Approved' : (status === 'Rejected by Admin' ? 'Rejected' : 'Pending')),
      technician_status: c.technician_status || (stage >= 5 ? 'Completed' : (stage >= 3 ? 'Accepted' : (status === 'Rejected by Technician' ? 'Rejected' : 'Pending'))),
      technician_action: c.technician_action || (stage >= 3 ? 'Accepted' : (status === 'Rejected by Technician' ? 'Rejected' : null)),
      work_status: c.work_status || (stage >= 5 ? 'Completed' : (stage >= 4 ? 'In Progress' : (status === 'Rejected by Technician' ? 'Cancelled' : 'Not Started'))),
      faculty_status: c.faculty_status || (stage >= 6 ? 'Verified' : 'Pending'),
      technician_completion_date: c.technician_completion_date || (stage >= 5 ? c.reportedAt : null),
      faculty_verification_date: c.faculty_verification_date || (stage >= 6 ? c.reportedAt : null),
      techId: c.techId || null,
      techName: c.techName || null,
      deadline: c.deadline || '',
      rejectionReason: c.rejectionReason || '',
      image: c.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600',
      video: c.video || '',
      proofImg: c.proofImg || '',
      remark: c.remark || '',
      qaVerified: c.qaVerified || (stage >= 6),
      qaFeedback: c.qaFeedback || '',
      logs: Array.isArray(c.logs) && c.logs.length ? c.logs : [
        { s: 'Complaint Submitted', note: 'Submitted with details', time: c.reportedAt || nowStr(), by: c.reportedBy || 'Student' }
      ]
    };
  });
}

let appState = JSON.parse(localStorage.getItem(REPO_KEY)) || initialSeedDatabase;
if (appState && appState.complaints) {
  appState.complaints = normalizeComplaints(appState.complaints);
}
function persist() { localStorage.setItem(REPO_KEY, JSON.stringify(appState)); }

let currentSession = null;
try {
  const savedSession = localStorage.getItem('campus_session');
  if (savedSession) {
    currentSession = JSON.parse(savedSession);
    if (currentSession && currentSession.expiresAt && currentSession.expiresAt <= Date.now()) {
      currentSession = null;
      localStorage.removeItem('campus_session');
    }
  }
} catch (e) {
  currentSession = null;
}

let activeAdminViewTab = 'dash';
let tmpBase64ProfileAvatar = null;
let qaApprovalState = true;
let sessionWatcherTimer = null;

function logout(isAutoExpired = false) {
  currentSession = null;
  localStorage.removeItem('campus_session');
  if (sessionWatcherTimer) clearInterval(sessionWatcherTimer);

  const timerBadge = document.getElementById('sessionTimerBadge');
  if (timerBadge) timerBadge.classList.add('hidden');
  const userChip = document.getElementById('userChip');
  if (userChip) {
    userChip.classList.add('hidden');
    userChip.classList.remove('flex');
  }
  const notifWrap = document.getElementById('notifWrap');
  if (notifWrap) notifWrap.classList.add('hidden');
  const navAuthSlot = document.getElementById('navRightAuthSlot');
  if (navAuthSlot) navAuthSlot.classList.remove('hidden');

  if (typeof goHome === 'function') {
    goHome();
  } else {
    window.location.href = 'index.html';
  }
  if (isAutoExpired === true) {
    toast('Your session has expired (15-Min SLA). Please sign in again.', 'err');
  } else {
    toast('Logged out successfully');
  }
}


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
  if (typeof syncNavProfile === 'function') syncNavProfile();
  if (typeof renderByRole === 'function') renderByRole();
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
function applyTheme(theme) {
  const html = document.documentElement;
  const isDark = theme === 'dark';
  if (isDark) {
    html.classList.add('dark');
    html.classList.remove('light');
    html.style.backgroundColor = '#070A13';
    html.style.colorScheme = 'dark';
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    html.style.backgroundColor = '#f8fafc';
    html.style.colorScheme = 'light';
  }
  localStorage.setItem('campus_connect_theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const isCurrentlyDark = html.classList.contains('dark');
  applyTheme(isCurrentlyDark ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('campus_connect_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  applyTheme(isDark ? 'dark' : 'light');

  if (currentSession) {
    runSessionTimer();
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('#notifWrap')) {
      document.getElementById('notifDrop')?.classList.add('hidden');
    }
  });
});
