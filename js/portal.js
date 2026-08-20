/* ==========================================================================
   Campus Connect - 4-Step Resolution Portal Engine (portal.js)
   ========================================================================== */

let tmpBase64Image = null;
let tmpBase64Video = null;

/* ---------- MEDIA & FILE INPUT HANDLERS ---------- */
function runKeywordDetect() {
  const title = document.getElementById('cTitle').value.toLowerCase();
  const desc = document.getElementById('cDesc').value.toLowerCase();
  const fullText = title + ' ' + desc;
  const alertBadge = document.getElementById('priorityDetectAlert');
  const categorySelector = document.getElementById('cCategory');
  const prioritySelector = document.getElementById('cPriority');

  let isHighPriority = criticalPriorityKeywords.some(keyword => fullText.includes(keyword));
  if (isHighPriority) {
    alertBadge.classList.remove('hidden');
    prioritySelector.value = 'High';
  } else {
    alertBadge.classList.add('hidden');
    let isMedium = mediumPriorityKeywords.some(keyword => fullText.includes(keyword));
    prioritySelector.value = isMedium ? 'Medium' : 'Low';
  }

  if (fullText.includes('wire') || fullText.includes('electric') || fullText.includes('tubelight') || fullText.includes('bulb') || fullText.includes('power')) {
    categorySelector.value = 'Electrical Department';
  } else if (fullText.includes('projector') || fullText.includes('wifi') || fullText.includes('computer') || fullText.includes('smartboard')) {
    categorySelector.value = 'Computer Department';
  } else if (fullText.includes('bench') || fullText.includes('desk') || fullText.includes('chair') || fullText.includes('furniture')) {
    categorySelector.value = 'Mechanical Department';
  } else if (fullText.includes('paint') || fullText.includes('wall') || fullText.includes('ceiling') || fullText.includes('leakage')) {
    categorySelector.value = 'Civil Department';
  }
}

function handleImgUpload(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    tmpBase64Image = e.target.result;
    document.getElementById('imgUploadPreview').classList.remove('hidden');
    document.getElementById('imgPreviewTag').src = e.target.result;
    document.getElementById('imgPlaceholderBtn').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function handleVideoUpload(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    tmpBase64Video = e.target.result;
    document.getElementById('videoUploadPreview').classList.remove('hidden');
    document.getElementById('videoPreviewTag').src = e.target.result;
    document.getElementById('videoPlaceholderBtn').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function handleProofPhotoUpload(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    tmpBase64Proof = e.target.result;
    document.getElementById('proofImgPreview').classList.remove('hidden');
    document.getElementById('proofPreviewTag').src = e.target.result;
    document.getElementById('proofPlaceholderBtn').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function openLightbox(src, caption, type = 'image') {
  const container = document.getElementById('lightboxMediaContainer');
  container.innerHTML = '';
  if (type === 'video') {
    container.innerHTML = `<video src="${src}" controls autoplay class="max-w-full max-h-[70vh]"></video>`;
  } else {
    container.innerHTML = `<img src="${src}" class="max-w-full max-h-[70vh] object-contain">`;
  }
  document.getElementById('bigCap').innerText = caption;
  document.getElementById('modalImg').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('modalImg').classList.add('hidden');
  document.getElementById('lightboxMediaContainer').innerHTML = '';
}


/* ---------- COMPLAINT FILING ---------- */
function openComplaintModal() {
  tmpBase64Image = null;
  tmpBase64Video = null;
  const imgPreview = document.getElementById('imgUploadPreview');
  if (imgPreview) imgPreview.classList.add('hidden');
  const imgPlaceholder = document.getElementById('imgPlaceholderBtn');
  if (imgPlaceholder) imgPlaceholder.classList.remove('hidden');
  const imgTag = document.getElementById('imgPreviewTag');
  if (imgTag) imgTag.src = '';

  const videoPreview = document.getElementById('videoUploadPreview');
  if (videoPreview) videoPreview.classList.add('hidden');
  const videoPlaceholder = document.getElementById('videoPlaceholderBtn');
  if (videoPlaceholder) videoPlaceholder.classList.remove('hidden');
  const videoTag = document.getElementById('videoPreviewTag');
  if (videoTag) videoTag.src = '';
  
  const modal = document.getElementById('modalComplaint');
  if (modal) modal.classList.remove('hidden');
  const priorityAlert = document.getElementById('priorityDetectAlert');
  if (priorityAlert) priorityAlert.classList.add('hidden');
}

function closeComplaintModal() {
  const modal = document.getElementById('modalComplaint');
  if (modal) modal.classList.add('hidden');
}

function submitComplaint(e) {
  e.preventDefault();
  const title = document.getElementById('cTitle')?.value.trim() || '';
  const category = document.getElementById('cCategory')?.value || 'Computer Department';
  const priority = document.getElementById('cPriority')?.value || 'Low';
  const location = document.getElementById('cLocation')?.value.trim() || '';
  const desc = document.getElementById('cDesc')?.value.trim() || '';

  if (!title || !location || !desc) {
    toast('Please fill in all required complaint fields.', 'err');
    return;
  }

  const ticketId = 'COMP-' + Math.floor(100 + Math.random() * 9000);
  const reporterName = (typeof currentSession !== 'undefined' && currentSession && currentSession.name) ? currentSession.name : 'Kabir Mehta';
  const reporterGr = (typeof currentSession !== 'undefined' && currentSession && currentSession.grNo) ? currentSession.grNo : '1001';

  const issueObj = {
    id: ticketId,
    title,
    category,
    description: desc,
    location,
    priority,
    reportedBy: reporterName,
    reportedByGr: reporterGr,
    reportedAt: nowStr(),
    status: 'Complaint Submitted',
    current_status: 'Complaint Submitted',
    stage: 1,
    admin_status: 'Pending',
    technician_status: 'Pending',
    technician_action: null,
    work_status: 'Not Started',
    faculty_status: 'Pending',
    technician_completion_date: null,
    faculty_verification_date: null,
    techId: null,
    techName: null,
    rejectionReason: '',
    deadline: '',
    image: tmpBase64Image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600',
    video: tmpBase64Video || '',
    proofImg: '',
    remark: '',
    qaVerified: false,
    qaFeedback: '',
    logs: [
      { s: 'Complaint Submitted', note: `Self Category: ${category} | Priority: ${priority}`, time: nowStr(), by: reporterName }
    ]
  };

  if (!appState.complaints) appState.complaints = [];
  if (!appState.notifs) appState.notifs = [];

  appState.complaints.unshift(issueObj);
  appState.notifs.unshift({
    id: 'N' + Date.now(),
    forGr: null,
    forDept: null,
    forTech: null,
    text: `Incoming verification required: ${ticketId} [${priority}] from ${reporterName}`,
    time: nowStr(),
    read: false
  });

  persist();
  closeComplaintModal();

  // Reset form inputs
  const titleInput = document.getElementById('cTitle');
  if (titleInput) titleInput.value = '';
  const locInput = document.getElementById('cLocation');
  if (locInput) locInput.value = '';
  const descInput = document.getElementById('cDesc');
  if (descInput) descInput.value = '';

  tmpBase64Image = null;
  tmpBase64Video = null;
  const imgPreview = document.getElementById('imgUploadPreview');
  if (imgPreview) imgPreview.classList.add('hidden');
  const imgBtn = document.getElementById('imgPlaceholderBtn');
  if (imgBtn) imgBtn.classList.remove('hidden');
  const vidPreview = document.getElementById('videoUploadPreview');
  if (vidPreview) vidPreview.classList.add('hidden');
  const vidBtn = document.getElementById('videoPlaceholderBtn');
  if (vidBtn) vidBtn.classList.remove('hidden');
  const priorityAlert = document.getElementById('priorityDetectAlert');
  if (priorityAlert) priorityAlert.classList.add('hidden');

  toast(`Complaint ${ticketId} registered & routed to Admin queue.`);

  if (typeof renderStudent === 'function' && typeof currentSession !== 'undefined' && currentSession && currentSession.role === 'student') {
    renderStudent();
  } else if (typeof renderByRole === 'function') {
    renderByRole();
  }
  if (typeof renderLandingStats === 'function') {
    renderLandingStats();
  }
  if (typeof renderPublicFeed === 'function') {
    renderPublicFeed();
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
    toast('Please log in as a student to submit an emergency report.', 'err');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cTitle = document.getElementById('cTitle');
  const cDesc = document.getElementById('cDesc');
  if (cTitle) cTitle.addEventListener('input', runKeywordDetect);
  if (cDesc) cDesc.addEventListener('input', runKeywordDetect);
});
