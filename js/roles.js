/* ==========================================================================
   Campus Connect - Role Portals & Workspaces Engine (roles.js)
   ========================================================================== */

let tmpBase64Proof = null;

function handleProofPhotoUpload(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    tmpBase64Proof = e.target.result;
    document.getElementById('proofImgPreview')?.classList.remove('hidden');
    const preview = document.getElementById('proofPreviewTag');
    if (preview) preview.src = e.target.result;
    document.getElementById('proofPlaceholderBtn')?.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function showView(viewId) {
  const views = ['roles', 'student', 'faculty', 'technician', 'admin', 'landing', 'auth', 'portal', 'feed'];
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
}

function showRoleView(viewId) {
  const views = ['roles', 'student', 'faculty', 'technician', 'admin'];
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

  if (viewId === 'student') renderStudent();
  if (viewId === 'faculty') renderFaculty();
  if (viewId === 'technician') renderTechnician();
  if (viewId === 'admin') renderAdmin();

  if (typeof initScrollObserver === 'function') {
    initScrollObserver();
  }
  if (typeof init3DTiltCards === 'function') {
    init3DTiltCards();
  }
}

function renderByRole() {
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role');
  const actionParam = params.get('action');

  if (roleParam && ['student', 'faculty', 'technician', 'admin'].includes(roleParam)) {
    if (!currentSession || currentSession.role !== roleParam) {
      if (roleParam === 'student') {
        currentSession = { role: 'student', grNo: '1001', name: 'Kabir Mehta', dept: 'Computer Department', avatar: null, loginTimestamp: Date.now() };
      } else if (roleParam === 'faculty') {
        currentSession = { role: 'faculty', name: 'Computer Faculty Advisor', dept: 'Computer Department', avatar: null, loginTimestamp: Date.now() };
      } else if (roleParam === 'technician') {
        const tech = appState.technicians[0];
        currentSession = { role: 'technician', id: tech.id, techId: tech.id, name: tech.name, dept: tech.dept, experience: tech.experience, rating: tech.rating, avatar: null, loginTimestamp: Date.now() };
      } else if (roleParam === 'admin') {
        currentSession = { role: 'admin', username: 'admin', name: 'Executive Dean Office', avatar: null, loginTimestamp: Date.now() };
      }
      persist();
    }
    showRoleView(roleParam);
    handleRoleActionParam(actionParam);
    return;
  }

  if (currentSession && currentSession.role) {
    showRoleView(currentSession.role);
    handleRoleActionParam(actionParam);
  } else {
    showRoleView('roles');
  }
}

function handleRoleActionParam(action) {
  if (!action) return;
  setTimeout(() => {
    if (typeof openComplaintModal === 'function') {
      openComplaintModal();
      if (action === 'emergency') {
        const p = document.getElementById('cPriority');
        const t = document.getElementById('cTitle');
        if (p) p.value = 'High';
        if (t) t.value = 'Emergency Hazard Report: ';
      }
    }
  }, 200);
}


/* ==========================================================================
   1. STUDENT VIEW & 7-STAGE PROGRESS BAR
   ========================================================================== */
function renderStudent() {
  showView('student');
  syncNavProfile();

  const warningWrap = document.getElementById('studentWarningContainer');
  if (warningWrap) {
    warningWrap.innerHTML = '';
    const u = (appState.users || []).find(x => x.grNo === currentSession?.grNo);
    if (u && u.warned) {
      warningWrap.innerHTML = `
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-sm font-semibold flex items-center gap-3">
          <i class="fa-solid fa-triangle-exclamation text-lg"></i>
          <div>
            <b class="font-bold">Official Warning Notice:</b> Please prevent submission of fraudulent issues. Future false reports will result in immediate account suspension.
          </div>
        </div>`;
    }
  }

  const stuAvatar = document.getElementById('stuAvatarBig');
  if (stuAvatar) {
    if (currentSession?.avatar) {
      stuAvatar.style.backgroundImage = `url('${currentSession.avatar}')`;
      stuAvatar.innerText = '';
    } else {
      stuAvatar.style.backgroundImage = 'none';
      stuAvatar.innerText = (currentSession?.name || 'S')[0].toUpperCase();
    }
  }

  const stuNameBig = document.getElementById('stuNameBig');
  if (stuNameBig) stuNameBig.innerText = currentSession?.name || 'Student';
  const stuDeptBig = document.getElementById('stuDeptBig');
  if (stuDeptBig) stuDeptBig.innerText = currentSession?.dept || 'Department';

  const myTickets = (appState.complaints || []).filter(c => 
    (currentSession && currentSession.grNo && c.reportedByGr === currentSession.grNo) ||
    (currentSession && currentSession.name && c.reportedBy === currentSession.name)
  );

  const sTotal = document.getElementById('sTotal');
  if (sTotal) sTotal.innerText = myTickets.length;
  const sPending = document.getElementById('sPending');
  if (sPending) sPending.innerText = myTickets.filter(c => c.stage === 1 || c.status === 'Complaint Submitted').length;
  const sActive = document.getElementById('sActive');
  if (sActive) sActive.innerText = myTickets.filter(c => c.stage >= 2 && c.stage <= 6).length;
  const sClosed = document.getElementById('sClosed');
  if (sClosed) sClosed.innerText = myTickets.filter(c => c.stage === 7 || c.status === 'Completed').length;

  const list = document.getElementById('stuList');
  list.innerHTML = '';
  if (myTickets.length === 0) {
    list.innerHTML = `
      <div class="bg-white dark:bg-zinc-900 border border-dashed rounded-[20px] p-12 text-center">
        <i class="fa-solid fa-folder-open text-3xl text-slate-300 mb-3"></i>
        <div class="font-bold">No registered complaints</div>
        <button onclick="openComplaintModal()" class="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs">+ Register Complaint</button>
      </div>`;
    return;
  }

  myTickets.forEach((c, index) => {
    const stageInfo = getComplaintStageInfo(c);
    const isCompleted = stageInfo.stage === 7;
    const isRejected = stageInfo.isRejected;

    const stepDefinitions = [
      { num: 1, label: '1. Submitted', full: 'Complaint Submitted', icon: 'fa-file-circle-plus' },
      { num: 2, label: '2. Admin Verified', full: 'Admin Verified', icon: 'fa-shield-halved' },
      { num: 3, label: '3. Tech Accepted', full: 'Technician Accepted', icon: 'fa-handshake-simple' },
      { num: 4, label: '4. In Progress', full: 'Work in Progress', icon: 'fa-screwdriver-wrench' },
      { num: 5, label: '5. Tech Completed', full: 'Technician Completed', icon: 'fa-camera' },
      { num: 6, label: '6. Faculty Verified', full: 'Faculty Verified', icon: 'fa-graduation-cap' },
      { num: 7, label: '7. Completed ✅', full: 'Complaint Completed', icon: 'fa-circle-check' }
    ];

    const stepsHtml = stepDefinitions.map(step => {
      let itemClass = '';
      let iconHtml = '';
      
      if (isRejected && step.num === stageInfo.stage) {
        itemClass = 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 font-bold';
        iconHtml = '<i class="fa-solid fa-circle-xmark text-red-500 mr-1"></i>';
      } else if (step.num < stageInfo.stage || (step.num === 7 && isCompleted)) {
        itemClass = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 font-semibold';
        iconHtml = '<i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i>';
      } else if (step.num === stageInfo.stage && !isCompleted && !isRejected) {
        itemClass = 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-500/40 font-bold ring-1 ring-blue-500/30 shadow-sm';
        iconHtml = '<i class="fa-solid fa-circle-dot text-blue-600 dark:text-blue-400 mr-1 animate-pulse"></i>';
      } else {
        itemClass = 'bg-slate-50 dark:bg-zinc-800/30 text-slate-400 dark:text-zinc-500 border-slate-200/50 dark:border-zinc-800';
        iconHtml = '<i class="fa-regular fa-circle text-slate-300 dark:text-zinc-600 mr-1"></i>';
      }

      return `
        <div class="p-2 rounded-xl border flex items-center gap-1 text-[11px] ${itemClass}" title="${step.full}">
          ${iconHtml}
          <span class="truncate">${step.label}</span>
        </div>
      `;
    }).join('');

    const card = document.createElement('div');
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    card.className = `bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[24px] p-5 card-hover reveal-on-scroll ${delayClass}`;
    card.innerHTML = `
      <div class="flex flex-col lg:flex-row gap-5">
        <div class="w-full lg:w-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border shrink-0 flex flex-col gap-2 p-2">
          <div class="relative h-32 w-full rounded-xl overflow-hidden">
            <img src="${c.image}" class="w-full h-full object-cover cursor-pointer" onclick="openLightbox('${c.image}', '${c.title}')">
            <span class="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold bg-black/60 text-white rounded">Photo Evidence</span>
          </div>
          ${c.video ? `
            <button type="button" onclick="openLightbox('${c.video}', '${c.title}', 'video')" class="w-full py-1.5 rounded-lg bg-violet-600/10 text-violet-600 dark:text-violet-400 text-xs font-bold hover:bg-violet-600/20"><i class="fa-solid fa-circle-play mr-1"></i> Watch Fault Video</button>
          ` : ''}
        </div>
        
        <div class="flex-1 space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[11px] font-mono font-bold text-slate-500">${c.id} • ${c.reportedAt}</span>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${stageInfo.badgeClass}">${stageInfo.statusText}</span>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 border">${c.category}</span>
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold ${c.priority === 'High' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-zinc-800'}">${c.priority} Priority</span>
          </div>
          <h4 class="font-display font-bold text-lg text-slate-900 dark:text-zinc-100">${c.title}</h4>
          <p class="text-xs text-slate-600 dark:text-zinc-400 font-medium">
            <i class="fa-solid fa-location-dot mr-1"></i> Location: <b>${c.location}</b> | 
            <i class="fa-solid fa-user-tie mr-1"></i> Assigned Technician: <b>${c.techName || 'Pending Admin Dispatch'}</b>
          </p>
          <div class="text-sm bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">${c.description}</div>
          
          ${c.proofImg ? `
            <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 items-center">
              <img src="${c.proofImg}" class="h-16 w-24 object-cover rounded-lg border cursor-pointer shrink-0" onclick="openLightbox('${c.proofImg}', 'Completion proof for ${c.id}')">
              <div class="text-xs">
                <b class="text-emerald-700 dark:text-emerald-400"><i class="fa-solid fa-square-check mr-1"></i> Technician Action Uploaded</b>
                <p class="text-slate-500 mt-0.5">"${c.remark}"</p>
                <span class="text-[10px] text-slate-400 block mt-1"><i class="fa-solid fa-clock mr-1"></i> Completed: ${c.technician_completion_date || ''}</span>
              </div>
            </div>
          ` : ''}

          ${c.qaVerified ? `
            <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs">
              <b class="text-blue-700 dark:text-blue-400"><i class="fa-solid fa-shield-check mr-1"></i> Faculty QA Audited & Confirmed Completed</b>
              <p class="text-slate-500 mt-1">Feedback: "${c.qaFeedback}"</p>
              <span class="text-[10px] text-slate-400 block mt-1"><i class="fa-solid fa-clock mr-1"></i> Verified on: ${c.faculty_verification_date || ''}</span>
            </div>
          ` : ''}

          ${isRejected ? `
            <div class="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl text-xs text-red-700 dark:text-red-300">
              <b class="font-bold"><i class="fa-solid fa-circle-xmark mr-1"></i> Rejected by ${stageInfo.rejectedBy}:</b> "${c.rejectionReason || 'Complaint rejected.'}"
            </div>
          ` : ''}

          <!-- 7-Stage Interactive Progress Bar -->
          <div class="space-y-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <span class="text-slate-500 dark:text-zinc-400 font-medium">Current Status:</span>
                <span class="font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : (isRejected ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400')}">
                  ${stageInfo.statusText}
                </span>
              </div>
              <span class="font-mono font-bold text-xs ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-400'}">
                ${stageInfo.percent}% ${isCompleted ? '• Work Done' : ''}
              </span>
            </div>

            <div class="w-full h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-zinc-700/60">
              <div class="h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : (isRejected ? 'bg-red-500' : 'bg-gradient-to-r from-blue-600 to-indigo-500')}"
                   style="width: ${stageInfo.percent}%"></div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1">
              ${stepsHtml}
            </div>
          </div>

          <!-- Resolution Pathway / Audit Logs -->
          <div class="pt-2">
            <span class="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-1">Resolution Pathway</span>
            <div class="flex gap-2 items-center overflow-x-auto pb-1">
              ${c.logs.map(lg => `
                <div class="flex items-center gap-1.5 shrink-0">
                  <div class="h-5 w-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-[8px]"><i class="fa-solid fa-check"></i></div>
                  <div class="text-[10px] leading-tight">
                    <b class="block text-slate-800 dark:text-zinc-200">${lg.s}</b>
                    <span class="text-slate-500">${lg.time}</span>
                  </div>
                  <div class="w-4 h-[1px] bg-slate-300 dark:bg-zinc-700"></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>`;
    list.appendChild(card);
  });

  if (typeof initScrollObserver === 'function') setTimeout(initScrollObserver, 50);
}


/* ==========================================================================
   2. ADMIN VERIFICATION & DIRECT TECHNICIAN DISPATCH
   ========================================================================== */
function switchAdmin(tab) {
  activeAdminViewTab = tab;
  ['dash', 'tickets', 'staff', 'students', 'reports'].forEach(t => {
    document.getElementById(`admin-${t}`)?.classList.add('hidden');
    const tabBtn = document.getElementById(`aTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (tabBtn) tabBtn.className = 'px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border font-semibold text-sm';
  });
  
  document.getElementById(`admin-${tab}`)?.classList.remove('hidden');
  const activeTabBtn = document.getElementById(`aTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
  if (activeTabBtn) activeTabBtn.className = 'px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm';
  
  if (tab === 'dash') drawCharts();
  if (tab === 'tickets') renderAdminTickets();
  if (tab === 'staff') renderAdminStaff();
  if (tab === 'students') renderAdminStudents();
  if (tab === 'reports') renderReports();
}

function renderAdmin() {
  showView('admin');
  syncNavProfile();

  const total = appState.complaints.length;
  document.getElementById('aTotal').innerText = total;
  const closed = appState.complaints.filter(c => c.stage === 7 || c.status === 'Completed').length;
  document.getElementById('aRate').innerText = total ? Math.round(closed / total * 100) + '%' : '0%';
  document.getElementById('aAvg').innerText = '15 Mins';
  
  const ratedTechs = appState.technicians.filter(t => t.rating > 0);
  const avgSat = ratedTechs.length ? (ratedTechs.reduce((a, b) => a + b.rating, 0) / ratedTechs.length).toFixed(1) : '5.0';
  document.getElementById('aSat').innerText = avgSat + '★';
  document.getElementById('aStaff').innerText = appState.technicians.filter(t => t.active).length;

  drawCharts();
  renderAdminTickets();
  renderAdminStaff();
  renderAdminStudents();
  renderReports();
}

let chartInstances = [];
function drawCharts() {
  chartInstances.forEach(ch => ch.destroy());
  chartInstances = [];
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? '#27272a' : '#e2e8f0';
  
  const depts = ['Computer Department', 'Electrical Department', 'Mechanical Department', 'Civil Department'];
  const deptCounts = depts.map(d => appState.complaints.filter(c => c.category === d).length);
  
  const c1 = document.getElementById('chartDept');
  if (c1) {
    const ctx1 = c1.getContext('2d');
    const ch1 = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Computer', 'Electrical', 'Mechanical', 'Civil'],
        datasets: [{ data: deptCounts, backgroundColor: ['#2563eb', '#06b6d4', '#059669', '#7c3aed'], borderRadius: 8 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor } } } }
    });
    chartInstances.push(ch1);
  }

  const c2 = document.getElementById('chartTrend');
  if (c2) {
    const ctx2 = c2.getContext('2d');
    const ch2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul'],
        datasets: [{ data: [12, 19, appState.complaints.length], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.05)', fill: true, tension: 0.4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor } } } }
    });
    chartInstances.push(ch2);
  }

  const statuses = ['Submitted', 'Admin Approved', 'Work in Progress', 'Tech Completed', 'Completed'];
  const statusCounts = [
    appState.complaints.filter(c => c.stage === 1 || c.status === 'Complaint Submitted').length,
    appState.complaints.filter(c => c.stage === 2 || c.status === 'Approved by Admin').length,
    appState.complaints.filter(c => c.stage === 3 || c.stage === 4 || c.status === 'Work in Progress').length,
    appState.complaints.filter(c => c.stage === 5 || c.status === 'Work Completed by Technician').length,
    appState.complaints.filter(c => c.stage === 7 || c.status === 'Completed').length
  ];

  const c3 = document.getElementById('chartStatus');
  if (c3) {
    const ctx3 = c3.getContext('2d');
    const ch3 = new Chart(ctx3, {
      type: 'doughnut',
      data: {
        labels: statuses,
        datasets: [{ data: statusCounts, backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#14b8a6', '#10b981'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } } }
    });
    chartInstances.push(ch3);
  }
}

function renderAdminTickets() {
  const search = document.getElementById('ticketSearch')?.value.toLowerCase() || '';
  let list = appState.complaints.filter(c => c.status === 'Complaint Submitted' || c.admin_status === 'Pending' || c.stage === 1);

  if (search) {
    list = list.filter(c => (c.title + ' ' + c.id + ' ' + c.location).toLowerCase().includes(search));
  }

  const grid = document.getElementById('adminTicketGrid');
  if (!grid) return;
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = '<div class="col-span-full p-12 text-center text-slate-500">No student complaints awaiting Admin verification audit.</div>';
    return;
  }

  list.forEach((c, index) => {
    const el = document.createElement('div');
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    el.className = `border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 flex flex-col justify-between reveal-on-scroll ${delayClass}`;
    el.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] font-mono text-slate-500">${c.id} • ${c.reportedAt}</span>
            <h4 class="font-bold text-base mt-0.5">${c.title}</h4>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Awaiting Admin Audit</span>
        </div>
        <p class="text-xs text-slate-500">Filer: <b>${c.reportedBy} (${c.reportedByGr})</b> | Category: <b>${c.category}</b></p>
        <div class="text-sm bg-slate-50 dark:bg-zinc-800 p-3 rounded-xl border">${c.description}</div>
      </div>
      
      <div class="mt-4 flex gap-2 shrink-0">
        <button onclick="openAdminRouteModal('${c.id}')" class="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"><i class="fa-solid fa-shield-check mr-1"></i> Verify & Dispatch</button>
        <button onclick="openLightbox('${c.image}', '${c.title}')" class="px-3 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800">Inspect Evidence</button>
        ${c.video ? `<button onclick="openLightbox('${c.video}', '${c.title}', 'video')" class="px-3 py-2 rounded-xl bg-violet-50 text-violet-700 text-xs font-bold hover:bg-violet-100">Watch Video</button>` : ''}
      </div>
    `;
    grid.appendChild(el);
  });

  if (typeof initScrollObserver === 'function') setTimeout(initScrollObserver, 50);
}

function openAdminRouteModal(id) {
  const c = appState.complaints.find(x => x.id === id);
  if (!c) return;

  document.getElementById('adminVerifyId').value = id;
  document.getElementById('adminVerifyTitle').innerText = `${id} | ${c.title}`;
  document.getElementById('adminRouteDept').value = c.category;

  const nextDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const deadlineInput = document.getElementById('adminRouteDeadline');
  if (deadlineInput) deadlineInput.value = nextDate;

  populateAdminTechOptions(c.category);
  document.getElementById('modalAdminRoute').classList.remove('hidden');
}

function populateAdminTechOptions(targetDept) {
  const dept = targetDept || document.getElementById('adminRouteDept')?.value;
  const select = document.getElementById('adminRouteTech');
  if (!select) return;
  select.innerHTML = '';

  let techs = appState.technicians.filter(t => t.active && t.dept === dept);
  if (techs.length === 0) {
    techs = appState.technicians.filter(t => t.active);
  }

  techs.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.name} (${t.dept} • Exp: ${t.experience} Yrs • ${t.rating}★)`;
    select.appendChild(opt);
  });
}

function closeAdminRouteModal() { document.getElementById('modalAdminRoute')?.classList.add('hidden'); }

function confirmAdminDispatch(e) {
  e.preventDefault();
  const id = document.getElementById('adminVerifyId').value;
  const dept = document.getElementById('adminRouteDept').value;
  const techSelect = document.getElementById('adminRouteTech');
  const techId = techSelect ? techSelect.value : null;
  const techObj = appState.technicians.find(x => x.id === techId) || appState.technicians[0];
  const techName = techObj ? techObj.name : 'Assigned Technician';
  const deadline = document.getElementById('adminRouteDeadline')?.value || '';

  const c = appState.complaints.find(x => x.id === id);
  if (!c) return;

  c.category = dept;
  c.techId = techObj ? techObj.id : techId;
  c.techName = techName;
  c.deadline = deadline;
  c.status = 'Approved by Admin';
  c.current_status = 'Approved by Admin';
  c.stage = 2;
  c.admin_status = 'Approved';
  c.admin_verification_date = nowStr();
  c.technician_status = 'Pending';
  c.work_status = 'Not Started';
  c.faculty_status = 'Pending';

  c.logs.push({ s: 'Admin Verified', note: `Approved by Admin. Dispatched to Technician ${techName} with deadline ${deadline || 'N/A'}`, time: nowStr(), by: 'Admin Office' });

  appState.notifs.unshift({
    id: 'N' + Date.now(),
    forGr: c.reportedByGr,
    forDept: null,
    forTech: c.techId,
    text: `Admin approved complaint ${c.id} and assigned to Technician ${techName}`,
    time: nowStr(),
    read: false
  });

  persist();
  closeAdminRouteModal();
  toast(`Complaint ${c.id} approved & dispatched to Technician.`);
  renderAdmin();
}

function adminRejectTicket() {
  const id = document.getElementById('adminVerifyId').value;
  const c = appState.complaints.find(x => x.id === id);
  if (!c) return;

  c.status = 'Rejected by Admin';
  c.current_status = 'Rejected by Admin';
  c.stage = 0;
  c.admin_status = 'Rejected';
  c.technician_status = 'Cancelled';
  c.work_status = 'Cancelled';
  c.rejectionReason = 'Rejected by Admin during initial verification';
  c.logs.push({ s: 'Rejected by Admin', note: 'Fraud / non-compliant complaint rejected by Admin.', time: nowStr(), by: 'Admin Office' });

  appState.notifs.unshift({
    id: 'N' + Date.now(),
    forGr: c.reportedByGr,
    forDept: null,
    forTech: null,
    text: `Your complaint ${c.id} was rejected by Admin verification.`,
    time: nowStr(),
    read: false
  });

  persist();
  closeAdminRouteModal();
  toast('Complaint rejected & archived.', 'err');
  renderAdmin();
}


/* ==========================================================================
   3. TECHNICIAN VIEW (RECEIVES AFTER ADMIN, ACCEPTS/REJECTS, COMPLETES)
   ========================================================================== */
function renderTechnician() {
  showView('technician');
  syncNavProfile();

  const currentTechId = currentSession ? (currentSession.techId || currentSession.id) : null;
  const list = appState.complaints.filter(c => 
    (c.techId === currentTechId || (!c.techId && c.category === currentSession?.dept)) && 
    c.status !== 'Complaint Submitted' && 
    c.status !== 'Rejected by Admin' &&
    c.admin_status === 'Approved'
  );
  document.getElementById('techCountBadge').innerText = list.length + ' tasks assigned';

  const container = document.getElementById('technicianList');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<div class="col-span-full p-12 text-center text-slate-500">No active work orders dispatched to your profile.</div>';
    return;
  }

  list.forEach((c, index) => {
    const card = document.createElement('div');
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    card.className = `bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 justify-between reveal-on-scroll ${delayClass}`;
    
    let actionableActions = '';
    if (c.status === 'Approved by Admin' || c.stage === 2) {
      actionableActions = `
        <div class="flex gap-2">
          <button onclick="acceptTechComplaint('${c.id}')" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"><i class="fa-solid fa-check mr-1"></i> Accept Complaint</button>
          <button onclick="openDeclineTechModal('${c.id}')" class="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-200 hover:bg-red-100"><i class="fa-solid fa-xmark mr-1"></i> Reject Complaint</button>
        </div>`;
    } else if (c.status === 'Work in Progress' || c.status === 'Accepted by Technician' || c.stage === 4) {
      actionableActions = `
        <div class="space-y-2">
          <div class="p-2.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-semibold flex items-center gap-2">
            <i class="fa-solid fa-screwdriver-wrench animate-pulse"></i> Work in Progress • Deadline: <b>${c.deadline || 'Standard'}</b>
          </div>
          <button onclick="openCompleteTechModal('${c.id}')" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"><i class="fa-solid fa-camera mr-1"></i> Work Completed / Mark as Complete</button>
        </div>`;
    } else if (c.status === 'Work Completed by Technician' || c.stage === 5) {
      actionableActions = `
        <div class="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-xl text-xs font-semibold text-center border border-teal-500/20">
          <i class="fa-solid fa-hourglass-half mr-1"></i> Work Completed • Awaiting Faculty Final Verification audit
        </div>`;
    } else if (c.status === 'Completed' || c.stage === 7) {
      actionableActions = `
        <div class="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold text-center border border-emerald-500/20">
          <i class="fa-solid fa-square-check mr-1"></i> Completed ✅ • Verified by Faculty
        </div>`;
    } else if (c.status === 'Rejected by Technician') {
      actionableActions = `
        <div class="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-800">
          <b>Rejected by Technician:</b> "${c.rejectionReason}"
        </div>`;
    }

    card.innerHTML = `
      <div>
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-mono text-slate-400">${c.id} • Deadline: <b class="text-slate-700 dark:text-zinc-200">${c.deadline || 'None'}</b></span>
          <span class="px-2 py-0.5 text-[9px] font-bold ${c.priority === 'High' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-zinc-800'} rounded">${c.priority} Priority</span>
        </div>
        <h4 class="font-bold text-base mt-1.5">${c.title}</h4>
        <p class="text-xs text-slate-500 mt-0.5">Student: <b>${c.reportedBy} (GR: ${c.reportedByGr})</b> | Category: <b>${c.category}</b></p>
      </div>
      
      <div class="text-xs bg-slate-50 dark:bg-zinc-800/40 p-3 border rounded-xl space-y-1">
        <p>${c.description}</p>
        <p class="text-[10px] text-slate-500"><i class="fa-solid fa-location-dot"></i> Location: <b>${c.location}</b></p>
        <p class="text-[10px] text-blue-600 dark:text-blue-400 font-semibold"><i class="fa-solid fa-shield-check"></i> Admin Status: <b>Approved by Admin</b></p>
      </div>

      <div class="flex gap-2 shrink-0">
        <button onclick="openLightbox('${c.image}', '${c.title}')" class="flex-1 py-1.5 rounded-lg border text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800">View Fault Image</button>
        ${c.video ? `<button onclick="openLightbox('${c.video}', '${c.title}', 'video')" class="flex-1 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold hover:bg-violet-100">Watch Fault Video</button>` : ''}
      </div>

      ${c.proofImg ? `
        <div class="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex gap-2.5 items-center text-xs">
          <img src="${c.proofImg}" class="h-12 w-16 object-cover rounded-lg border cursor-pointer shrink-0" onclick="openLightbox('${c.proofImg}', 'Technician proof for ${c.id}')">
          <div>
            <b class="text-emerald-700 dark:text-emerald-400 font-bold">Uploaded Completion Proof</b>
            <p class="text-slate-500 text-[11px] truncate">"${c.remark}"</p>
          </div>
        </div>
      ` : ''}

      ${actionableActions}
    `;
    container.appendChild(card);
  });

  if (typeof initScrollObserver === 'function') setTimeout(initScrollObserver, 50);
}

function acceptTechComplaint(id) {
  const c = appState.complaints.find(x => x.id === id);
  if (!c) return;

  c.status = 'Work in Progress';
  c.current_status = 'Work in Progress';
  c.stage = 4;
  c.technician_status = 'Accepted';
  c.technician_action = 'Accepted';
  c.work_status = 'In Progress';
  c.logs.push({ s: 'Technician Accepted', note: 'Technician accepted complaint work order', time: nowStr(), by: currentSession.name });
  c.logs.push({ s: 'Work in Progress', note: 'Resolution work actively underway', time: nowStr(), by: currentSession.name });

  appState.notifs.unshift({
    id: 'N' + Date.now(),
    forGr: c.reportedByGr,
    forDept: null,
    forTech: null,
    text: `Technician ${currentSession.name} accepted your complaint ${c.id} and started work.`,
    time: nowStr(),
    read: false
  });

  persist();
  toast('Complaint accepted! Work is now in progress.');
  renderTechnician();
}

function openDeclineTechModal(id) {
  document.getElementById('declineTechId').value = id;
  document.getElementById('declineTechReason').value = '';
  document.getElementById('modalDeclineTech').classList.remove('hidden');
}

function closeDeclineTechModal() { document.getElementById('modalDeclineTech')?.classList.add('hidden'); }

function confirmDeclineTech(e) {
  e.preventDefault();
  const id = document.getElementById('declineTechId').value;
  const reason = document.getElementById('declineTechReason').value.trim();
  const c = appState.complaints.find(x => x.id === id);
  if (!c) return;

  c.status = 'Rejected by Technician';
  c.current_status = 'Rejected by Technician';
  c.stage = 0;
  c.technician_status = 'Rejected';
  c.technician_action = 'Rejected';
  c.work_status = 'Cancelled';
  c.rejectionReason = reason;
  c.logs.push({ s: 'Rejected by Technician', note: reason, time: nowStr(), by: currentSession.name });

  appState.notifs.unshift({
    id: 'N' + Date.now(),
    forGr: c.reportedByGr,
    forDept: null,
    forTech: null,
    text: `Technician declined complaint ${c.id}: ${reason}`,
    time: nowStr(),
    read: false
  });

  persist();
  closeDeclineTechModal();
  toast('Complaint rejected by technician.', 'err');
  renderTechnician();
}

function openCompleteTechModal(id) {
  document.getElementById('completeTechId').value = id;
  tmpBase64Proof = null;
  document.getElementById('proofImgPreview')?.classList.add('hidden');
  document.getElementById('proofPlaceholderBtn')?.classList.remove('hidden');
  document.getElementById('completeRemark').value = '';
  document.getElementById('modalCompleteTech')?.classList.remove('hidden');
}

function closeCompleteTechModal() { document.getElementById('modalCompleteTech')?.classList.add('hidden'); }

function confirmCompleteTech(e) {
  e.preventDefault();
  const id = document.getElementById('completeTechId').value;
  const remark = document.getElementById('completeRemark').value.trim();
  if (!tmpBase64Proof) return toast('Please upload photograph proof of completed work', 'err');

  const c = appState.complaints.find(x => x.id === id);
  if (!c) return;

  c.status = 'Work Completed by Technician';
  c.current_status = 'Work Completed by Technician';
  c.stage = 5;
  c.technician_status = 'Completed';
  c.work_status = 'Completed';
  c.technician_completion_date = nowStr();
  c.proofImg = tmpBase64Proof;
  c.remark = remark;
  c.logs.push({ s: 'Technician Completed', note: remark, time: nowStr(), by: currentSession.name });
  c.logs.push({ s: 'Work Completed by Technician', note: 'Transferred to Faculty for Final Verification', time: nowStr(), by: currentSession.name });

  appState.notifs.unshift({
    id: 'N' + Date.now(),
    forGr: c.reportedByGr,
    forDept: c.category,
    forTech: null,
    text: `Technician finished work on ${c.id}. Ready for Faculty Verification.`,
    time: nowStr(),
    read: false
  });

  persist();
  closeCompleteTechModal();
  toast('Work completed! Transferred to Faculty Dashboard for verification.');
  renderTechnician();
}


/* ==========================================================================
   4. FACULTY VIEW (ONLY VERIFIES AFTER TECHNICIAN COMPLETES WORK)
   ========================================================================== */
function renderFaculty() {
  showView('faculty');
  syncNavProfile();
  
  document.getElementById('facDeptHeader').innerText = currentSession.dept + ' Final Verification Panel';
  const query = document.getElementById('facSearch')?.value.toLowerCase() || '';

  // Faculty ONLY receives complaints AFTER the technician has completed the work
  let list = appState.complaints.filter(c => 
    c.category === currentSession.dept && 
    (c.status === 'Work Completed by Technician' || c.status === 'Faculty Verified' || c.status === 'Completed' || c.stage >= 5)
  );
  
  if (query) {
    list = list.filter(c => (c.title + ' ' + c.id + ' ' + c.location + ' ' + (c.techName || '')).toLowerCase().includes(query));
  }

  document.getElementById('facCountBadge').innerText = list.length + ' department tickets';

  const grid = document.getElementById('facultyList');
  if (!grid) return;
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = '<div class="col-span-full p-12 text-center text-slate-500">No completed work orders awaiting faculty verification.</div>';
    return;
  }

  list.forEach((c, index) => {
    const card = document.createElement('div');
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    card.className = `bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 justify-between reveal-on-scroll ${delayClass}`;
    
    let actionableSection = '';
    if (c.status === 'Work Completed by Technician' || c.stage === 5) {
      actionableSection = `
        <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
          <div class="p-2.5 bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-xl text-xs font-semibold">
            <i class="fa-solid fa-circle-exclamation mr-1"></i> Technician marked work completed with photo proof. Audit and verify to complete complaint.
          </div>
          <button onclick="openFacultyQaModal('${c.id}')" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"><i class="fa-solid fa-certificate mr-1"></i> Verify & Approve</button>
        </div>`;
    } else {
      actionableSection = `
        <div class="p-2.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/20">
          <i class="fa-solid fa-circle-check mr-1"></i> Quality Verified: Completed ✅
          ${c.qaFeedback ? `<p class="text-[11px] text-slate-500 font-normal mt-1">Audit Notes: "${c.qaFeedback}"</p>` : ''}
        </div>`;
    }

    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <span class="text-[10px] font-mono text-slate-400 block">${c.id} • Priority: <b>${c.priority}</b></span>
          <h4 class="font-bold text-base mt-0.5">${c.title}</h4>
          <p class="text-xs text-slate-500">Student: <b>${c.reportedBy} (GR: ${c.reportedByGr})</b></p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${c.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'}">${c.status}</span>
      </div>

      <div class="text-xs bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border space-y-1">
        <p>${c.description}</p>
        <div class="text-[10px] text-slate-500 flex justify-between pt-1">
          <span><i class="fa-solid fa-location-dot"></i> Venue: <b>${c.location}</b></span>
          <span><i class="fa-solid fa-calendar"></i> Reported: <b>${c.reportedAt}</b></span>
        </div>
      </div>
      
      <!-- Completed Work by Technician Box -->
      <div class="p-3 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-500/20 rounded-xl text-xs space-y-2">
        <div class="flex justify-between items-center">
          <b class="text-teal-800 dark:text-teal-300 font-bold"><i class="fa-solid fa-screwdriver-wrench mr-1"></i> Completed Work Details</b>
          <span class="text-[10px] text-slate-500">${c.technician_completion_date || ''}</span>
        </div>
        <div class="text-slate-600 dark:text-zinc-300">
          Technician: <b>${c.techName || 'Assigned Tech'}</b><br>
          Action / Remarks: <i>"${c.remark || 'Work finished'}"</i>
        </div>
        ${c.proofImg ? `
          <div class="flex items-center gap-2 pt-1">
            <img src="${c.proofImg}" class="h-14 w-20 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition" onclick="openLightbox('${c.proofImg}', 'Technician Proof: ${c.title}')">
            <button onclick="openLightbox('${c.proofImg}', 'Technician Proof: ${c.title}')" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline">Inspect Completion Photo</button>
          </div>
        ` : ''}
      </div>

      <div class="flex gap-2 shrink-0">
        <button onclick="openLightbox('${c.image}', '${c.title}')" class="flex-1 py-1.5 rounded-lg border text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800">Original Photo</button>
        ${c.video ? `<button onclick="openLightbox('${c.video}', '${c.title}', 'video')" class="flex-1 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold hover:bg-violet-100">Original Video</button>` : ''}
      </div>

      ${actionableSection}
    `;
    grid.appendChild(card);
  });

  if (typeof initScrollObserver === 'function') setTimeout(initScrollObserver, 50);
}

function openFacultyQaModal(id) {
  document.getElementById('qaVerifyId').value = id;
  setFacultyQaApproval(true);
  document.getElementById('modalFacultyQa').classList.remove('hidden');
}

function closeFacultyQaModal() { document.getElementById('modalFacultyQa')?.classList.add('hidden'); }

function setFacultyQaApproval(approve) {
  qaApprovalState = approve;
  const btnApprove = document.getElementById('btnQaApprove');
  const btnReject = document.getElementById('btnQaReject');
  if (approve) {
    btnApprove.className = 'py-3 rounded-xl bg-blue-600 text-white font-bold text-sm border-2 border-blue-600';
    btnReject.className = 'py-3 rounded-xl bg-white dark:bg-zinc-800 border-2 text-sm font-semibold';
  } else {
    btnApprove.className = 'py-3 rounded-xl bg-white dark:bg-zinc-800 border-2 text-sm font-semibold';
    btnReject.className = 'py-3 rounded-xl bg-red-600 text-white font-bold text-sm border-2 border-red-600';
  }
}

function confirmFacultyQa(e) {
  e.preventDefault();
  const id = document.getElementById('qaVerifyId').value;
  const comment = document.getElementById('qaFeedbackComment').value.trim();
  const c = appState.complaints.find(x => x.id === id);
  if (!c) return;

  if (qaApprovalState) {
    c.status = 'Completed';
    c.current_status = 'Completed';
    c.stage = 7;
    c.faculty_status = 'Verified';
    c.faculty_verification_date = nowStr();
    c.qaVerified = true;
    c.qaFeedback = comment || 'Verified and approved by Faculty Advisor';
    c.logs.push({ s: 'Faculty Verified', note: c.qaFeedback, time: nowStr(), by: currentSession.name });
    c.logs.push({ s: 'Completed', note: 'Complaint fully completed and verified.', time: nowStr(), by: 'System' });
    
    const t = appState.technicians.find(x => x.id === c.techId);
    if (t) t.rating = Math.min(5.0, Number((t.rating + 0.1).toFixed(1)));

    appState.notifs.unshift({
      id: 'N' + Date.now(),
      forGr: c.reportedByGr,
      forDept: null,
      forTech: c.techId,
      text: `Your complaint ${c.id} has been verified by Faculty and is now Completed ✅.`,
      time: nowStr(),
      read: false
    });

    toast('Inspection completed! Complaint marked Completed.');
  } else {
    c.status = 'Work in Progress';
    c.current_status = 'Work in Progress';
    c.stage = 4;
    c.faculty_status = 'Redo Requested';
    c.logs.push({ s: 'Faculty Redo Requested', note: comment, time: nowStr(), by: currentSession.name });
    toast('Redo requested. Returned to technician queue.', 'err');
  }

  persist();
  closeFacultyQaModal();
  renderFaculty();
}


/* ==========================================================================
   5. STAFF & STUDENT CONFIGURATION
   ========================================================================== */
function renderAdminStaff() {
  const list = document.getElementById('adminStaffList');
  if (!list) return;
  list.innerHTML = '';

  appState.technicians.forEach((t, index) => {
    const activeTasksCount = appState.complaints.filter(c => c.techId === t.id && (c.stage >= 2 && c.stage <= 5)).length;
    
    const card = document.createElement('div');
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    card.className = `border rounded-2xl p-4 bg-white dark:bg-zinc-900 flex justify-between items-center reveal-on-scroll ${delayClass}`;
    card.innerHTML = `
      <div class="flex gap-3 items-center">
        <div class="h-10 w-10 rounded-xl bg-violet-600/10 text-violet-600 flex items-center justify-center font-bold text-sm shrink-0">
          ${t.name[0]}
        </div>
        <div>
          <div class="font-bold text-sm">${t.name} <span class="text-xs text-slate-400">(${t.id})</span></div>
          <div class="text-[11px] text-slate-500 font-medium">
            Dept: ${t.dept} | Experience: ${t.experience} Yrs | Rating: <b>${t.rating}★</b><br>
            Active Duties: <b class="text-violet-600">${activeTasksCount}</b>
          </div>
        </div>
      </div>
      <div class="flex gap-1">
        <button onclick="editStaff('${t.id}')" class="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 text-xs font-bold">Edit</button>
        <button onclick="toggleStaff('${t.id}')" class="px-2.5 py-1.5 rounded-lg text-xs font-bold ${t.active ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}">
          ${t.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    `;
    list.appendChild(card);
  });

  if (typeof initScrollObserver === 'function') setTimeout(initScrollObserver, 50);
}

function openStaffModal() {
  document.getElementById('staffEditId').value = '';
  document.getElementById('staffName').value = '';
  document.getElementById('staffExp').value = 2;
  document.getElementById('staffPassNew').value = 'password';
  document.getElementById('modalStaff').classList.remove('hidden');
}

function closeStaffModal() { document.getElementById('modalStaff')?.classList.add('hidden'); }

function editStaff(id) {
  const t = appState.technicians.find(x => x.id === id);
  if (!t) return;
  document.getElementById('staffEditId').value = t.id;
  document.getElementById('staffName').value = t.name;
  document.getElementById('staffDept').value = t.dept;
  document.getElementById('staffExp').value = t.experience;
  document.getElementById('staffPassNew').value = t.password;
  document.getElementById('modalStaff').classList.remove('hidden');
}

function saveStaff(e) {
  e.preventDefault();
  const editId = document.getElementById('staffEditId').value;
  const name = document.getElementById('staffName').value.trim();
  const dept = document.getElementById('staffDept').value;
  const exp = parseInt(document.getElementById('staffExp').value, 10);
  const pass = document.getElementById('staffPassNew').value;

  if (editId) {
    const t = appState.technicians.find(x => x.id === editId);
    t.name = name; t.dept = dept; t.experience = exp; t.password = pass;
    toast(`Technician details updated.`);
  } else {
    const newId = 'TECH-' + String(appState.technicians.length + 1).padStart(2, '0');
    appState.technicians.push({ id: newId, name, dept, experience: exp, rating: 5.0, active: true, password: pass });
    toast(`Registered technician: ${name} assigned to ${dept}`);
  }
  persist();
  closeStaffModal();
  renderAdminStaff();
}

function toggleStaff(id) {
  const t = appState.technicians.find(x => x.id === id);
  if (!t) return;
  t.active = !t.active;
  persist();
  toast(t.active ? 'Technician account activated.' : 'Technician account deactivated.');
  renderAdminStaff();
}

function renderAdminStudents() {
  const query = document.getElementById('studentSearch')?.value.toLowerCase() || '';
  const container = document.getElementById('adminStudentList');
  if (!container) return;
  container.innerHTML = '';

  appState.users.forEach((u, index) => {
    if (query && !u.name.toLowerCase().includes(query) && !u.grNo.includes(query)) return;

    const complaintsCount = appState.complaints.filter(c => c.reportedByGr === u.grNo).length;
    const card = document.createElement('div');
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    card.className = `border rounded-2xl p-4 bg-white dark:bg-zinc-900 space-y-3 reveal-on-scroll ${delayClass}`;
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-bold text-sm">${u.name} <span class="text-xs text-slate-400">(GR: ${u.grNo})</span></h4>
          <span class="text-[10px] text-slate-500 block">${u.dept} | Registered Complaints: ${complaintsCount}</span>
        </div>
        <div class="flex flex-col gap-1 items-end">
          ${u.warned ? `<span class="px-1.5 py-0.5 text-[8px] font-bold bg-amber-500 text-white rounded">Warned</span>` : ''}
          ${u.suspended ? `<span class="px-1.5 py-0.5 text-[8px] font-bold bg-red-600 text-white rounded">Suspended</span>` : ''}
        </div>
      </div>
      
      <div class="flex gap-1.5 border-t pt-2">
        <button onclick="adminOverrideStudentProfile('${u.grNo}')" class="flex-1 py-1 bg-slate-50 dark:bg-zinc-800 text-xs font-semibold rounded hover:bg-slate-100 transition">Override Profile</button>
        <button onclick="toggleStudentWarnStatus('${u.grNo}')" class="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded hover:opacity-80 transition"><i class="fa-solid fa-triangle-exclamation"></i></button>
        <button onclick="toggleStudentSuspendStatus('${u.grNo}')" class="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded hover:opacity-80 transition"><i class="fa-solid fa-ban"></i></button>
      </div>
    `;
    container.appendChild(card);
  });

  if (typeof initScrollObserver === 'function') setTimeout(initScrollObserver, 50);
}

function adminOverrideStudentProfile(grNo) {
  const u = appState.users.find(x => x.grNo === grNo);
  if (!u) return;
  document.getElementById('adminUserEditGr').value = u.grNo;
  document.getElementById('adminUserEditName').value = u.name;
  document.getElementById('adminUserEditDept').value = u.dept;
  document.getElementById('adminUserEditPass').value = u.password;
  document.getElementById('adminUserEditImgUrl').value = u.avatar || '';
  document.getElementById('modalAdminUserEdit')?.classList.remove('hidden');
}

function closeAdminUserEdit() { document.getElementById('modalAdminUserEdit')?.classList.add('hidden'); }

function saveAdminUserEdit(e) {
  e.preventDefault();
  const gr = document.getElementById('adminUserEditGr').value;
  const name = document.getElementById('adminUserEditName').value.trim();
  const dept = document.getElementById('adminUserEditDept').value.trim();
  const pass = document.getElementById('adminUserEditPass').value;
  const img = document.getElementById('adminUserEditImgUrl').value.trim();

  const u = appState.users.find(x => x.grNo === gr);
  if (u) {
    u.name = name; u.dept = dept; u.password = pass; u.avatar = img || null; persist();
    toast(`Administrative profile override applied for student: ${name}`);
  }
  closeAdminUserEdit();
  renderAdminStudents();
}

function toggleStudentWarnStatus(gr) {
  const u = appState.users.find(x => x.grNo === gr);
  if (!u) return;
  u.warned = !u.warned; persist();
  toast(`Student warning status updated.`);
  renderAdminStudents();
}

function toggleStudentSuspendStatus(gr) {
  const u = appState.users.find(x => x.grNo === gr);
  if (!u) return;
  u.suspended = !u.suspended; persist();
  toast(`Student suspension status updated.`);
  renderAdminStudents();
}


/* ==========================================================================
   6. AUDITED REPORTS & EXPORTS
   ========================================================================== */
function renderReports() {
  const body = document.getElementById('reportBody');
  if (!body) return;
  body.innerHTML = '';
  appState.complaints.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-3 font-semibold">${c.id}</td>
      <td class="p-3 text-xs"><b>${c.reportedBy}</b><span class="block text-slate-400">GR: ${c.reportedByGr}</span></td>
      <td class="p-3 text-xs">${c.category}</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 border text-slate-700">${c.status}</span></td>
      <td class="p-3 text-xs">${c.techName || 'Unassigned'}</td>
      <td class="p-3 text-xs">${c.qaVerified ? 'Faculty QA Approved' : 'Awaiting Inspection'}</td>
      <td class="p-3 font-mono text-xs">15 Min SLA Standard</td>
    `;
    body.appendChild(tr);
  });
}

function exportCSV() {
  let csv = 'ID,Filer Name,GR No,Department,Status,Stage,Technician Dispatch,Inspection Verified,Deadline\n';
  appState.complaints.forEach(c => {
    csv += `"${c.id}","${c.reportedBy}","${c.reportedByGr}","${c.category}","${c.status}","${c.stage || 1}","${c.techName || ''}","${c.qaVerified ? 'Yes' : 'No'}","${c.deadline || ''}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Campus_Connect_Operational_Report.csv';
  anchor.click();
}

function printReport() { window.print(); }

document.addEventListener('DOMContentLoaded', () => {
  renderByRole();
});
