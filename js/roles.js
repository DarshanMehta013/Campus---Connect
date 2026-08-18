/* ==========================================================================
   Campus Connect - Role Portals & Workspaces Engine (roles.js)
   ========================================================================== */

let activeAdminTab = 'dash';
let activeQaDecision = true;
let tmpBase64Proof = null;
let deptChartInstance = null;
let priorityChartInstance = null;

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
}

function renderByRole() {
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role');

  if (roleParam && ['student', 'faculty', 'technician', 'admin'].includes(roleParam)) {
    if (!currentSession || currentSession.role !== roleParam) {
      if (roleParam === 'student') {
        currentSession = { role: 'student', grNo: '1001', name: 'Kabir Mehta', dept: 'Computer Department', avatar: null, loginTimestamp: Date.now() };
      } else if (roleParam === 'faculty') {
        currentSession = { role: 'faculty', name: 'Electrical Faculty Advisor', dept: 'Electrical Department', avatar: null, loginTimestamp: Date.now() };
      } else if (roleParam === 'technician') {
        const tech = appState.technicians[0];
        currentSession = { role: 'technician', id: tech.id, name: tech.name, dept: tech.dept, experience: tech.experience, rating: tech.rating, avatar: null, loginTimestamp: Date.now() };
      } else if (roleParam === 'admin') {
        currentSession = { role: 'admin', username: 'admin', name: 'Executive Dean Office', avatar: null, loginTimestamp: Date.now() };
      }
      persist();
    }
    showRoleView(roleParam);
    return;
  }

  if (currentSession && currentSession.role) {
    showRoleView(currentSession.role);
  } else {
    showRoleView('roles');
  }
}

/* ---------- STUDENT VIEW ---------- */
function renderStudent() {
  showView('student');
  syncNavProfile();

  const warningWrap = document.getElementById('studentWarningContainer');
  warningWrap.innerHTML = '';
  const u = appState.users.find(x => x.grNo === currentSession.grNo);
  if (u && u.warned) {
    warningWrap.innerHTML = `
      <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-sm font-semibold flex items-center gap-3">
        <i class="fa-solid fa-triangle-exclamation text-lg"></i>
        <div>
          <b class="font-bold">Official Warning Notice:</b> Please prevent submission of fraudulent issues. Future false reports will result in immediate account suspension.
        </div>
      </div>`;
  }

  const stuAvatar = document.getElementById('stuAvatarBig');
  if (currentSession.avatar) {
    stuAvatar.style.backgroundImage = `url('${currentSession.avatar}')`;
    stuAvatar.innerText = '';
  } else {
    stuAvatar.style.backgroundImage = 'none';
    stuAvatar.innerText = currentSession.name[0].toUpperCase();
  }

  document.getElementById('stuNameBig').innerText = currentSession.name;
  document.getElementById('stuDeptBig').innerText = currentSession.dept;

  const myTickets = appState.complaints.filter(c => c.reportedByGr === currentSession.grNo);
  document.getElementById('sTotal').innerText = myTickets.length;
  document.getElementById('sPending').innerText = myTickets.filter(c => c.status === 'Pending Admin Verification').length;
  document.getElementById('sActive').innerText = myTickets.filter(c => ['Awaiting Faculty Forwarding', 'Assigned to Technician', 'Resolution Started', 'Pending Faculty Verification'].includes(c.status)).length;
  document.getElementById('sClosed').innerText = myTickets.filter(c => c.status === 'Perfectly Completed').length;

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
    const badgeMap = {
      'Pending Admin Verification': 'bg-amber-100 text-amber-800 border-amber-200',
      'Awaiting Faculty Forwarding': 'bg-blue-100 text-blue-800 border-blue-200',
      'Assigned to Technician': 'bg-violet-100 text-violet-800 border-violet-200',
      'Resolution Started': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Pending Faculty Verification': 'bg-teal-100 text-teal-800 border-teal-200',
      'Perfectly Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Rejected by Verifier': 'bg-red-100 text-red-800 border-red-200'
    };
    const badgeColor = badgeMap[c.status] || 'bg-slate-100';

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
        
        <div class="flex-1 space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[11px] font-mono font-bold text-slate-500">${c.id} • ${c.reportedAt}</span>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeColor}">${c.status}</span>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 border">${c.category}</span>
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold ${c.priority === 'High' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-zinc-800'}">${c.priority} Priority</span>
          </div>
          <h4 class="font-display font-bold text-lg text-slate-900 dark:text-zinc-100">${c.title}</h4>
          <p class="text-xs text-slate-600 dark:text-zinc-400 font-medium"><i class="fa-solid fa-location-dot mr-1"></i> ${c.location} | <i class="fa-solid fa-user-tie mr-1"></i> Tech Dispatcher: ${c.techName || 'Searching...'}</p>
          <div class="text-sm bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-3 border border-slate-100 dark:border-zinc-800">${c.description}</div>
          
          ${c.proofImg ? `
            <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 items-center">
              <img src="${c.proofImg}" class="h-16 w-24 object-cover rounded-lg border cursor-pointer shrink-0" onclick="openLightbox('${c.proofImg}', 'Completion proof for ${c.id}')">
              <div class="text-xs">
                <b class="text-emerald-700 dark:text-emerald-400"><i class="fa-solid fa-square-check"></i> Technician Action Uploaded</b>
                <p class="text-slate-500 mt-0.5">"${c.remark}"</p>
              </div>
            </div>
          ` : ''}

          ${c.qaVerified ? `
            <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs">
              <b class="text-blue-700 dark:text-blue-400"><i class="fa-solid fa-shield-check"></i> Faculty QA Audited & Confirmed Perfectly Completed</b>
              <p class="text-slate-500 mt-1">Feedback: "${c.qaFeedback}"</p>
            </div>
          ` : ''}

          <!-- Timeline -->
          <div class="pt-3">
            <span class="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-1.5">Resolution Pathway</span>
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

  setTimeout(initScrollObserver, 50);
}

/* ---------- FACULTY VIEW ---------- */
function renderFaculty() {
  showView('faculty');
  syncNavProfile();
  
  document.getElementById('facDeptHeader').innerText = currentSession.dept + ' Admin Workspace';
  const query = document.getElementById('facSearch').value.toLowerCase();

  let list = appState.complaints.filter(c => c.category === currentSession.dept && c.status !== 'Pending Admin Verification');
  
  if (query) {
    list = list.filter(c => (c.title + ' ' + c.id + ' ' + c.location).toLowerCase().includes(query));
  }

  document.getElementById('facCountBadge').innerText = list.length + ' department tickets';

  const grid = document.getElementById('facultyList');
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = '<div class="col-span-full p-12 text-center text-slate-500">No complaints logged in department verification queue.</div>';
    return;
  }

  list.forEach((c, index) => {
    const card = document.createElement('div');
    const delayClass = `delay-${((index % 4) + 1) * 100}`;
    card.className = `bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 justify-between reveal-on-scroll ${delayClass}`;
    
    let actionableSection = '';
    if (c.status === 'Awaiting Faculty Forwarding') {
      actionableSection = `<button onclick="openFacultyForwardModal('${c.id}')" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"><i class="fa-solid fa-share mr-1"></i> Forward & Assign Technician</button>`;
    } else if (c.status === 'Assigned to Technician') {
      actionableSection = `<div class="p-3 bg-violet-500/10 text-violet-700 dark:text-violet-400 rounded-xl text-xs font-semibold">Dispatched to Technician: ${c.techName}. Deadline: ${c.deadline}</div>`;
    } else if (c.status === 'Resolution Started') {
      actionableSection = `<div class="p-3 bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 rounded-xl text-xs font-semibold"><i class="fa-solid fa-hourglass-start animate-spin"></i> Resolution Started by ${c.techName}. Deadline: ${c.deadline}</div>`;
    } else if (c.status === 'Pending Faculty Verification') {
      actionableSection = `
        <div class="space-y-2">
          <div class="p-2.5 bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-xl text-xs font-semibold">Work finished. Photo proof submitted. Audit required.</div>
          <button onclick="openFacultyQaModal('${c.id}')" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"><i class="fa-solid fa-magnifying-glass"></i> Inspect & Verify Completion</button>
        </div>`;
    } else {
      actionableSection = `<div class="p-2.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs font-bold"><i class="fa-solid fa-circle-check"></i> Quality Verified: Perfectly Completed</div>`;
    }

    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <span class="text-[10px] font-mono text-slate-400 block">${c.id} • Assigned Priority: ${c.priority}</span>
          <h4 class="font-bold text-base mt-0.5">${c.title}</h4>
        </div>
        ${c.rejectionReason ? `<span class="px-2 py-0.5 text-[9px] font-bold bg-red-600 text-white rounded">Previously Declined</span>` : ''}
      </div>
      <div class="text-xs bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-lg border space-y-1.5">
        <p>${c.description}</p>
        <div class="text-[10px] text-slate-500 flex justify-between">
          <span>Venue: <b>${c.location}</b></span>
          <span>By: <b>${c.reportedBy}</b></span>
        </div>
      </div>
      
      <div class="flex gap-2 shrink-0">
        <button onclick="openLightbox('${c.image}', '${c.title}')" class="flex-1 py-1.5 rounded-lg border text-xs font-bold">Inspect Photo</button>
        ${c.video ? `<button onclick="openLightbox('${c.video}', '${c.title}', 'video')" class="flex-1 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold">Watch Video</button>` : ''}
      </div>

      ${c.rejectionReason ? `
        <div class="p-2.5 bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg text-xs">
          <b>Decline Reason:</b> "${c.rejectionReason}"
        </div>
      ` : ''}

      ${actionableSection}
    `;
    grid.appendChild(card);
  });

  setTimeout(initScrollObserver, 50);
}

function openFacultyForwardModal(id) {
  const c = appState.complaints.find(x => x.id === id);
  document.getElementById('forwardVerifyId').value = id;
  document.getElementById('forwardVerifyLabel').innerText = `${id} | ${c.title}`;
  
  const techSelect = document.getElementById('forwardSelectedTech');
  techSelect.innerHTML = '';
  
  const eligibleTechs = appState.technicians.filter(t => t.dept === currentSession.dept && t.active);
  eligibleTechs.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.name} (Exp: ${t.experience} Yrs | Rating: ${t.rating}★)`;
    techSelect.appendChild(opt);
  });

  if (eligibleTechs.length === 0) {
    toast('No registered active technicians found in your department.', 'err');
    return;
  }
  document.getElementById('modalFacultyForward').classList.remove('hidden');
}

function closeFacultyForwardModal() { document.getElementById('modalFacultyForward').classList.add('hidden'); }

function confirmFacultyForward(e) {
  e.preventDefault();
  const id = document.getElementById('forwardVerifyId').value;
  const techId = document.getElementById('forwardSelectedTech').value;
  const deadline = document.getElementById('forwardDeadline').value;
  
  const c = appState.complaints.find(x => x.id === id);
  const t = appState.technicians.find(x => x.id === techId);

  c.techId = t.id;
  c.techName = t.name;
  c.deadline = deadline;
  c.status = 'Assigned to Technician';
  c.rejectionReason = '';
  c.logs.push({ s: 'Assigned to Tech', note: `Dispatched to ${t.name} with deadline ${deadline}`, time: nowStr(), by: currentSession.name });

  appState.notifs.unshift({
    id: 'N' + Date.now(),
    forGr: null,
    forDept: null,
    forTech: t.id,
    text: `New forwarded task order ${c.id}: Deadline ${deadline}`,
    time: nowStr(),
    read: false
  });

  persist();
  closeFacultyForwardModal();
  toast(`Work order dispatched to Technician ${t.name}.`);
  renderFaculty();
}

function openFacultyQaModal(id) {
  document.getElementById('qaVerifyId').value = id;
  setFacultyQaApproval(true);
  document.getElementById('modalFacultyQa').classList.remove('hidden');
}

function closeFacultyQaModal() { document.getElementById('modalFacultyQa').classList.add('hidden'); }

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

  if (qaApprovalState) {
    c.status = 'Perfectly Completed';
    c.qaVerified = true;
    c.qaFeedback = comment;
    c.logs.push({ s: 'Perfect Completion Verified', note: comment, time: nowStr(), by: currentSession.name });
    
    const t = appState.technicians.find(x => x.id === c.techId);
    if (t) t.rating = Math.min(5.0, Number((t.rating + 0.1).toFixed(1)));

    toast('Inspection completed. Complaint archived as perfectly completed.');
  } else {
    c.status = 'Resolution Started';
    c.logs.push({ s: 'QA Inspection Refused', note: `Redo requested: ${comment}`, time: nowStr(), by: currentSession.name });
    toast('Resolution rejected. Returned to technician queue.', 'err');
  }

  persist();
  closeFacultyQaModal();
  renderFaculty();
}

/* ---------- TECHNICIAN VIEW ---------- */
function renderTechnician() {
  showView('technician');
  syncNavProfile();

  const list = appState.complaints.filter(c => c.techId === currentSession.techId);
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
    if (c.status === 'Assigned to Technician') {
      actionableActions = `
        <div class="flex gap-2">
          <button onclick="acceptTechTask('${c.id}')" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">Accept Task</button>
          <button onclick="openDeclineTechModal('${c.id}')" class="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-200">Decline Order</button>
        </div>`;
    } else if (c.status === 'Resolution Started') {
      actionableActions = `<button onclick="openCompleteTechModal('${c.id}')" class="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"><i class="fa-solid fa-camera"></i> Complete & Upload Tubelight Proof</button>`;
    } else if (c.status === 'Pending Faculty Verification') {
      actionableActions = `<div class="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-xl text-xs font-semibold text-center">Awaiting Faculty Verification audit...</div>`;
    } else {
      actionableActions = `<div class="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold text-center"><i class="fa-solid fa-square-check"></i> Perfectly Completed & Verified</div>`;
    }

    card.innerHTML = `
      <div>
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-mono text-slate-400">${c.id} • Deadline: <b class="text-slate-700 dark:text-zinc-200">${c.deadline || 'None'}</b></span>
          <span class="px-2 py-0.5 text-[9px] font-bold ${c.priority === 'High' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-zinc-800'} rounded">${c.priority}</span>
        </div>
        <h4 class="font-bold text-base mt-1.5">${c.title}</h4>
      </div>
      
      <div class="text-xs bg-slate-50 dark:bg-zinc-800/40 p-3 border rounded-xl space-y-1">
        <p>${c.description}</p>
        <p class="text-[10px] text-slate-500"><i class="fa-solid fa-location-dot"></i> Venue: ${c.location}</p>
      </div>

      <div class="flex gap-2 shrink-0">
        <button onclick="openLightbox('${c.image}', '${c.title}')" class="flex-1 py-1.5 rounded-lg border text-xs font-semibold">View Fault Image</button>
        ${c.video ? `<button onclick="openLightbox('${c.video}', '${c.title}', 'video')" class="flex-1 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold">Watch Fault Video</button>` : ''}
      </div>

      ${actionableActions}
    `;
    container.appendChild(card);
  });

  setTimeout(initScrollObserver, 50);
}

function acceptTechTask(id) {
  const c = appState.complaints.find(x => x.id === id);
  c.status = 'Resolution Started';
  c.logs.push({ s: 'Resolution Started', note: 'Technician accepted dispatcher assignment', time: nowStr(), by: currentSession.name });
  persist();
  toast('Task order accepted! Resolution pathway started.');
  renderTechnician();
}

function openDeclineTechModal(id) {
  document.getElementById('declineTechId').value = id;
  document.getElementById('declineTechReason').value = '';
  document.getElementById('modalDeclineTech').classList.remove('hidden');
}

function closeDeclineTechModal() { document.getElementById('modalDeclineTech').classList.add('hidden'); }

function confirmDeclineTech(e) {
  e.preventDefault();
  const id = document.getElementById('declineTechId').value;
  const reason = document.getElementById('declineTechReason').value.trim();
  const c = appState.complaints.find(x => x.id === id);

  c.status = 'Awaiting Faculty Forwarding';
  c.techId = null;
  c.techName = null;
  c.rejectionReason = reason;
  c.logs.push({ s: 'Declined by Technician', note: reason, time: nowStr(), by: currentSession.name });

  persist();
  closeDeclineTechModal();
  toast('Task order declined. Returned to department pool.', 'err');
  renderTechnician();
}

function openCompleteTechModal(id) {
  document.getElementById('completeTechId').value = id;
  tmpBase64Proof = null;
  document.getElementById('proofImgPreview').classList.add('hidden');
  document.getElementById('proofPlaceholderBtn').classList.remove('hidden');
  document.getElementById('completeRemark').value = '';
  document.getElementById('modalCompleteTech').classList.remove('hidden');
}

function closeCompleteTechModal() { document.getElementById('modalCompleteTech').classList.add('hidden'); }

function confirmCompleteTech(e) {
  e.preventDefault();
  const id = document.getElementById('completeTechId').value;
  const remark = document.getElementById('completeRemark').value.trim();
  if (!tmpBase64Proof) return toast('Please upload photograph proof of fixed tubelight/appliances', 'err');

  const c = appState.complaints.find(x => x.id === id);
  c.status = 'Pending Faculty Verification';
  c.proofImg = tmpBase64Proof;
  c.remark = remark;
  c.logs.push({ s: 'Resolution Proof Uploaded', note: remark, time: nowStr(), by: currentSession.name });

  persist();
  closeCompleteTechModal();
  toast('Task finalized and submitted for QA inspection.');
  renderTechnician();
}

/* ---------- ADMIN CONSOLE WORKSPACE ---------- */
function switchAdmin(tab) {
  activeAdminViewTab = tab;
  ['dash', 'tickets', 'staff', 'students', 'reports'].forEach(t => {
    document.getElementById(`admin-${t}`).classList.add('hidden');
    document.getElementById(`aTab${t.charAt(0).toUpperCase() + t.slice(1)}`).className = 'px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border font-semibold text-sm';
  });
  
  document.getElementById(`admin-${tab}`).classList.remove('hidden');
  document.getElementById(`aTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).className = 'px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm';
  
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
  const closed = appState.complaints.filter(c => c.status === 'Perfectly Completed').length;
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
  
  const ctx1 = document.getElementById('chartDept').getContext('2d');
  const ch1 = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Computer', 'Electrical', 'Mechanical', 'Civil'],
      datasets: [{ data: deptCounts, backgroundColor: ['#2563eb', '#06b6d4', '#059669', '#7c3aed'], borderRadius: 8 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor } } } }
  });
  chartInstances.push(ch1);

  const ctx2 = document.getElementById('chartTrend').getContext('2d');
  const ch2 = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['May', 'Jun', 'Jul'],
      datasets: [{ data: [12, 19, appState.complaints.length], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.05)', fill: true, tension: 0.4 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor } } } }
  });
  chartInstances.push(ch2);

  const statuses = ['Pending Verification', 'Faculty Action', 'In Progress', 'QA Verification', 'Completed'];
  const statusCounts = [
    appState.complaints.filter(c => c.status === 'Pending Admin Verification').length,
    appState.complaints.filter(c => c.status === 'Awaiting Faculty Forwarding').length,
    appState.complaints.filter(c => ['Assigned to Technician', 'Resolution Started'].includes(c.status)).length,
    appState.complaints.filter(c => c.status === 'Pending Faculty Verification').length,
    appState.complaints.filter(c => c.status === 'Perfectly Completed').length
  ];

  const ctx3 = document.getElementById('chartStatus').getContext('2d');
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

function renderAdminTickets() {
  const search = document.getElementById('ticketSearch').value.toLowerCase();
  let list = appState.complaints.filter(c => c.status === 'Pending Admin Verification');

  if (search) {
    list = list.filter(c => (c.title + ' ' + c.id + ' ' + c.location).toLowerCase().includes(search));
  }

  const grid = document.getElementById('adminTicketGrid');
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
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Awaiting Audit</span>
        </div>
        <p class="text-xs text-slate-500">Filer: <b>${c.reportedBy} (${c.reportedByGr})</b> | Suggested Category: <b>${c.category}</b></p>
        <div class="text-sm bg-slate-50 dark:bg-zinc-800 p-3 rounded-xl border">${c.description}</div>
      </div>
      
      <div class="mt-4 flex gap-2 shrink-0">
        <button onclick="openAdminRouteModal('${c.id}')" class="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md">Audit & Dispatch</button>
        <button onclick="openLightbox('${c.image}', '${c.title}')" class="px-3 py-2 rounded-xl border text-xs font-semibold">Inspect Evidence</button>
        ${c.video ? `<button onclick="openLightbox('${c.video}', '${c.title}', 'video')" class="px-3 py-2 rounded-xl bg-violet-50 text-violet-700 text-xs font-bold">Watch Video</button>` : ''}
      </div>
    `;
    grid.appendChild(el);
  });

  setTimeout(initScrollObserver, 50);
}

function openAdminRouteModal(id) {
  const c = appState.complaints.find(x => x.id === id);
  document.getElementById('adminVerifyId').value = id;
  document.getElementById('adminVerifyTitle').innerText = `${id} | ${c.title}`;
  document.getElementById('adminRouteDept').value = c.category;
  document.getElementById('modalAdminRoute').classList.remove('hidden');
}

function closeAdminRouteModal() { document.getElementById('modalAdminRoute').classList.add('hidden'); }

function confirmAdminDispatch(e) {
  e.preventDefault();
  const id = document.getElementById('adminVerifyId').value;
  const dept = document.getElementById('adminRouteDept').value;
  const c = appState.complaints.find(x => x.id === id);

  c.category = dept;
  c.status = 'Awaiting Faculty Forwarding';
  c.logs.push({ s: 'Verified', note: `Audited and routed to ${dept} Faculty Office`, time: nowStr(), by: 'Admin Office' });

  appState.notifs.unshift({
    id: 'N' + Date.now(),
    forGr: c.reportedByGr,
    forDept: dept,
    forTech: null,
    text: `Verified complaint ${c.id} forwarded to ${dept}`,
    time: nowStr(),
    read: false
  });

  persist();
  closeAdminRouteModal();
  toast(`Verified complaint ${c.id} dispatched successfully.`);
  renderAdmin();
}

function adminRejectTicket() {
  const id = document.getElementById('adminVerifyId').value;
  const c = appState.complaints.find(x => x.id === id);
  c.status = 'Rejected by Verifier';
  c.logs.push({ s: 'Rejected by Verifier', note: 'Fraud/Spam report closed by admin.', time: nowStr(), by: 'Admin' });

  persist();
  closeAdminRouteModal();
  toast('Complaint rejected & archived successfully.', 'err');
  renderAdmin();
}

function renderAdminStaff() {
  const list = document.getElementById('adminStaffList');
  list.innerHTML = '';

  appState.technicians.forEach((t, index) => {
    const activeTasksCount = appState.complaints.filter(c => c.techId === t.id && ['Assigned to Technician', 'Resolution Started'].includes(c.status)).length;
    
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

  setTimeout(initScrollObserver, 50);
}

function openStaffModal() {
  document.getElementById('staffEditId').value = '';
  document.getElementById('staffName').value = '';
  document.getElementById('staffExp').value = 2;
  document.getElementById('staffPassNew').value = 'password';
  document.getElementById('modalStaff').classList.remove('hidden');
}

function closeStaffModal() { document.getElementById('modalStaff').classList.add('hidden'); }

function editStaff(id) {
  const t = appState.technicians.find(x => x.id === id);
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
  t.active = !t.active;
  persist();
  toast(t.active ? 'Technician account activated.' : 'Technician account deactivated.');
  renderAdminStaff();
}

function renderAdminStudents() {
  const query = document.getElementById('studentSearch').value.toLowerCase();
  const container = document.getElementById('adminStudentList');
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

  setTimeout(initScrollObserver, 50);
}

function adminOverrideStudentProfile(grNo) {
  const u = appState.users.find(x => x.grNo === grNo);
  document.getElementById('adminUserEditGr').value = u.grNo;
  document.getElementById('adminUserEditName').value = u.name;
  document.getElementById('adminUserEditDept').value = u.dept;
  document.getElementById('adminUserEditPass').value = u.password;
  document.getElementById('adminUserEditImgUrl').value = u.avatar || '';
  document.getElementById('modalAdminUserEdit').classList.remove('hidden');
}

function closeAdminUserEdit() { document.getElementById('modalAdminUserEdit').classList.add('hidden'); }

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
  u.warned = !u.warned; persist();
  toast(`Student warning status updated.`);
  renderAdminStudents();
}

function toggleStudentSuspendStatus(gr) {
  const u = appState.users.find(x => x.grNo === gr);
  u.suspended = !u.suspended; persist();
  toast(`Student suspension status updated.`);
  renderAdminStudents();
}

/* ---------- AUDITED REPORTS & EXPORTS ---------- */
function renderReports() {
  const body = document.getElementById('reportBody');
  body.innerHTML = '';
  appState.complaints.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-3 font-semibold">${c.id}</td>
      <td class="p-3 text-xs"><b>${c.reportedBy}</b><span class="block text-slate-400">GR: ${c.reportedByGr}</span></td>
      <td class="p-3 text-xs">${c.category}</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 border text-slate-700">${c.status}</span></td>
      <td class="p-3 text-xs">${c.techName || 'Unassigned'}</td>
      <td class="p-3 text-xs">${c.qaVerified ? 'Perfect Complete Approved' : 'Awaiting Inspection'}</td>
      <td class="p-3 font-mono text-xs">15 Min SLA Standard</td>
    `;
    body.appendChild(tr);
  });
}

function exportCSV() {
  let csv = 'ID,Filer Name,GR No,Department,Status,Technician Dispatch,Inspection Verified,Deadline\n';
  appState.complaints.forEach(c => {
    csv += `"${c.id}","${c.reportedBy}","${c.reportedByGr}","${c.category}","${c.status}","${c.techName || ''}","${c.qaVerified ? 'Yes' : 'No'}","${c.deadline || ''}"\n`;
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
