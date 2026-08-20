const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('  CAMPUS CONNECT - FULL COMPREHENSIVE TEST SUITE    ');
console.log('====================================================\n');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: k => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: k => { delete storage[k]; },
  clear: () => { for (const k in storage) delete storage[k]; }
};

// Mock DOM
global.window = {
  location: { href: 'roles.html', search: '' },
  print: () => {}
};

const domElements = {};
function getOrCreateEl(id) {
  if (!domElements[id]) {
    domElements[id] = {
      id,
      value: '',
      innerText: '',
      innerHTML: '',
      className: '',
      style: {},
      children: [],
      classList: {
        add: function(cls) { if (!this.contains(cls)) this.classes.push(cls); },
        remove: function(cls) { this.classes = this.classes.filter(c => c !== cls); },
        contains: function(cls) { return this.classes.includes(cls); },
        classes: []
      },
      appendChild: function(child) { this.children.push(child); },
      getContext: () => ({ fillRect: () => {}, clearRect: () => {} })
    };
  }
  return domElements[id];
}

global.document = {
  documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
  getElementById: id => getOrCreateEl(id),
  querySelectorAll: () => [],
  createElement: tag => ({
    tagName: tag,
    className: '',
    innerHTML: '',
    style: {},
    appendChild: () => {},
    remove: () => {}
  }),
  addEventListener: () => {}
};

global.Chart = function() {
  return { destroy: () => {} };
};

// Load codebase in global VM context
vm.runInThisContext(fs.readFileSync('c:/Users/Darshan/Campus---Connect/js/main.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('c:/Users/Darshan/Campus---Connect/js/navigation.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('c:/Users/Darshan/Campus---Connect/js/portal.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('c:/Users/Darshan/Campus---Connect/js/roles.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('c:/Users/Darshan/Campus---Connect/js/feed.js', 'utf8'));

console.log('[PASS] All application modules loaded and initialized.');

// --- TEST 1: Initial Database & Seed Data ---
console.log('\n--- TEST 1: Database Seed Schema & Helpers ---');
if (appState && Array.isArray(appState.complaints) && appState.complaints.length > 0) {
  console.log(`[PASS] appState initialized with ${appState.complaints.length} complaints.`);
} else {
  console.error('[FAIL] appState initialization failed');
  process.exit(1);
}

// --- TEST 2: Student Files a Complaint ---
console.log('\n--- TEST 2: Student Files Complaint ---');
currentSession = { role: 'student', grNo: '1001', name: 'Kabir Mehta', dept: 'Computer Department' };
persist();

getOrCreateEl('cTitle').value = 'AC Failure in Lecture Hall 101';
getOrCreateEl('cCategory').value = 'Mechanical Department';
getOrCreateEl('cPriority').value = 'High';
getOrCreateEl('cLocation').value = 'Block B LH-101';
getOrCreateEl('cDesc').value = 'AC unit is leaking water and making loud grinding sound.';

const initialCount = appState.complaints.length;
submitComplaint({ preventDefault: () => {} });

if (appState.complaints.length === initialCount + 1) {
  console.log('[PASS] Complaint successfully submitted.');
} else {
  console.error('[FAIL] Complaint submission failed.');
  process.exit(1);
}

const newComplaint = appState.complaints[0];
console.log(`Created Ticket: ${newComplaint.id}, Status: "${newComplaint.status}", Stage: ${newComplaint.stage}`);

let stageInfo = getComplaintStageInfo(newComplaint);
if (newComplaint.status === 'Complaint Submitted' && stageInfo.stage === 1 && stageInfo.percent === 14) {
  console.log('[PASS] Initial stage correctly set to 1 (14% - Complaint Submitted).');
} else {
  console.error('[FAIL] Incorrect initial stage:', stageInfo);
  process.exit(1);
}

// --- TEST 3: Admin Receives, Audits, and Dispatches Directly to Technician ---
console.log('\n--- TEST 3: Admin Audits and Dispatches Directly to Technician ---');
currentSession = { role: 'admin', username: 'admin', name: 'Executive Dean Office' };
persist();

openAdminRouteModal(newComplaint.id);
getOrCreateEl('adminRouteDept').value = 'Mechanical Department';
populateAdminTechOptions('Mechanical Department');

// Select technician Jagdish Panchal (TECH-02)
getOrCreateEl('adminRouteTech').value = 'TECH-02';
getOrCreateEl('adminRouteDeadline').value = '2026-08-30';

confirmAdminDispatch({ preventDefault: () => {} });

console.log(`After Admin Dispatch: Status: "${newComplaint.status}", Stage: ${newComplaint.stage}, Tech: ${newComplaint.techName}`);
stageInfo = getComplaintStageInfo(newComplaint);

if (newComplaint.status === 'Approved by Admin' && newComplaint.admin_status === 'Approved' && stageInfo.stage === 2 && stageInfo.percent === 28) {
  console.log('[PASS] Stage correctly transitioned to 2 (28% - Approved by Admin).');
} else {
  console.error('[FAIL] Admin dispatch transition failed:', stageInfo);
  process.exit(1);
}

// --- TEST 4: Technician Receives, Views, and Accepts Complaint ---
console.log('\n--- TEST 4: Technician Receives and Accepts Complaint ---');
currentSession = { role: 'technician', id: 'TECH-02', techId: 'TECH-02', name: 'Jagdish Panchal', dept: 'Mechanical Department' };
persist();

renderTechnician();
acceptTechComplaint(newComplaint.id);

console.log(`After Technician Acceptance: Status: "${newComplaint.status}", Stage: ${newComplaint.stage}, Work Status: "${newComplaint.work_status}"`);
stageInfo = getComplaintStageInfo(newComplaint);

if (newComplaint.status === 'Work in Progress' && newComplaint.technician_status === 'Accepted' && stageInfo.stage === 4 && stageInfo.percent === 57) {
  console.log('[PASS] Stage correctly transitioned to 4 (57% - Work in Progress).');
} else {
  console.error('[FAIL] Technician acceptance transition failed:', stageInfo);
  process.exit(1);
}

// --- TEST 5: Technician Completes Work and Uploads Resolution Proof ---
console.log('\n--- TEST 5: Technician Completes Work and Uploads Photo Proof ---');
openCompleteTechModal(newComplaint.id);
tmpBase64Proof = 'data:image/jpeg;base64,mockCompletionPhotoData==';
getOrCreateEl('completeRemark').value = 'Replaced damaged compressor bearing and cleared drain pipe.';

confirmCompleteTech({ preventDefault: () => {} });

console.log(`After Technician Completion: Status: "${newComplaint.status}", Stage: ${newComplaint.stage}, Proof: ${Boolean(newComplaint.proofImg)}`);
stageInfo = getComplaintStageInfo(newComplaint);

if (newComplaint.status === 'Work Completed by Technician' && newComplaint.technician_status === 'Completed' && stageInfo.stage === 5 && stageInfo.percent === 71) {
  console.log('[PASS] Stage correctly transitioned to 5 (71% - Work Completed by Technician).');
} else {
  console.error('[FAIL] Technician completion transition failed:', stageInfo);
  process.exit(1);
}

// --- TEST 6: Faculty Audits and Verifies Completed Work ---
console.log('\n--- TEST 6: Faculty Final Verification and Approval ---');
currentSession = { role: 'faculty', name: 'Mechanical Faculty Advisor', dept: 'Mechanical Department' };
persist();

renderFaculty();
openFacultyQaModal(newComplaint.id);
setFacultyQaApproval(true);
getOrCreateEl('qaFeedbackComment').value = 'Audited LH-101 AC unit. Air conditioning is running cold and silent.';

confirmFacultyQa({ preventDefault: () => {} });

console.log(`After Faculty QA: Status: "${newComplaint.status}", Stage: ${newComplaint.stage}, QA Verified: ${newComplaint.qaVerified}`);
stageInfo = getComplaintStageInfo(newComplaint);

if (newComplaint.status === 'Completed' && newComplaint.faculty_status === 'Verified' && newComplaint.qaVerified === true && stageInfo.stage === 7 && stageInfo.percent === 100) {
  console.log('[PASS] Stage correctly transitioned to 7 (100% - Completed ✅).');
} else {
  console.error('[FAIL] Faculty verification transition failed:', stageInfo);
  process.exit(1);
}

// --- TEST 7: Student Dashboard Verification ---
console.log('\n--- TEST 7: Student Dashboard 7-Stage Stepper Rendering ---');
currentSession = { role: 'student', grNo: '1001', name: 'Kabir Mehta', dept: 'Computer Department' };
persist();
renderStudent();

const stuListEl = getOrCreateEl('stuList');
if (stuListEl.children.length > 0) {
  console.log(`[PASS] Student cards rendered (${stuListEl.children.length} cards rendered).`);
} else {
  console.error('[FAIL] Student cards failed to render.');
  process.exit(1);
}

// --- TEST 8: Admin Rejection Flow ---
console.log('\n--- TEST 8: Admin Rejection Flow ---');
const rejectTestTicket = {
  id: 'COMP-REJ-001',
  title: 'Test prank report',
  category: 'Civil Department',
  description: 'Fake issue',
  location: 'Grounds',
  priority: 'Low',
  reportedBy: 'Kabir Mehta',
  reportedByGr: '1001',
  reportedAt: nowStr(),
  status: 'Complaint Submitted',
  stage: 1,
  admin_status: 'Pending',
  technician_status: 'Pending',
  work_status: 'Not Started',
  faculty_status: 'Pending',
  logs: []
};
appState.complaints.unshift(rejectTestTicket);
persist();

getOrCreateEl('adminVerifyId').value = rejectTestTicket.id;
adminRejectTicket();

const r1 = getComplaintStageInfo(rejectTestTicket);
if (rejectTestTicket.status === 'Rejected by Admin' && r1.isRejected) {
  console.log('[PASS] Admin Rejection correctly stopped progression.');
} else {
  console.error('[FAIL] Admin Rejection failed:', r1);
  process.exit(1);
}

// --- TEST 9: Technician Rejection Flow ---
console.log('\n--- TEST 9: Technician Rejection Flow ---');
const techRejectTicket = {
  id: 'COMP-REJ-002',
  title: 'Specialized lab calibration',
  category: 'Electrical Department',
  description: 'Needs vendor technician',
  location: 'Lab 1',
  priority: 'High',
  reportedBy: 'Ananya Iyer',
  reportedByGr: '1002',
  reportedAt: nowStr(),
  status: 'Approved by Admin',
  stage: 2,
  admin_status: 'Approved',
  technician_status: 'Pending',
  techId: 'TECH-01',
  techName: 'Dilip Prasad',
  work_status: 'Not Started',
  faculty_status: 'Pending',
  logs: []
};
appState.complaints.unshift(techRejectTicket);
persist();

getOrCreateEl('declineTechId').value = techRejectTicket.id;
getOrCreateEl('declineTechReason').value = 'Requires proprietary vendor replacement parts';
confirmDeclineTech({ preventDefault: () => {} });

const r2 = getComplaintStageInfo(techRejectTicket);
if (techRejectTicket.status === 'Rejected by Technician' && r2.isRejected) {
  console.log('[PASS] Technician Rejection correctly handled.');
} else {
  console.error('[FAIL] Technician Rejection failed:', r2);
  process.exit(1);
}

console.log('\n====================================================');
console.log('  ALL 9 WORKFLOW & SYSTEM TESTS PASSED SUCCESSFULLY! ');
console.log('====================================================\n');
