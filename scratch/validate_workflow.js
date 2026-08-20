const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== RUNNING WORKFLOW VERIFICATION TEST ===\n');

// 1. Check JS syntax of all files
const filesToTest = [
  'c:/Users/Darshan/Campus---Connect/js/main.js',
  'c:/Users/Darshan/Campus---Connect/js/roles.js',
  'c:/Users/Darshan/Campus---Connect/js/portal.js',
  'c:/Users/Darshan/Campus---Connect/js/login.js',
  'c:/Users/Darshan/Campus---Connect/js/feed.js'
];

filesToTest.forEach(f => {
  try {
    const code = fs.readFileSync(f, 'utf8');
    new Function(code);
    console.log(`[PASS] Syntax OK: ${path.basename(f)}`);
  } catch (err) {
    console.error(`[FAIL] Syntax Error in ${path.basename(f)}:`, err.message);
    process.exit(1);
  }
});

// 2. Setup mock browser environment in global
const localStorageData = {};
global.localStorage = {
  getItem: (k) => localStorageData[k] || null,
  setItem: (k, v) => { localStorageData[k] = v; },
  removeItem: (k) => { delete localStorageData[k]; }
};

global.window = {
  location: { href: '', search: '' },
  print: () => {}
};
global.document = {
  documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
  getElementById: (id) => ({
    value: '',
    innerText: '',
    innerHTML: '',
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    style: {},
    appendChild: () => {},
    getContext: () => ({})
  }),
  querySelectorAll: () => [],
  createElement: () => ({
    className: '',
    innerHTML: '',
    appendChild: () => {},
    style: {}
  }),
  addEventListener: () => {}
};
global.Chart = function() { return { destroy: () => {} }; };

// 3. Load files in global context
vm.runInThisContext(fs.readFileSync('c:/Users/Darshan/Campus---Connect/js/main.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('c:/Users/Darshan/Campus---Connect/js/portal.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('c:/Users/Darshan/Campus---Connect/js/roles.js', 'utf8'));

console.log('\n[PASS] All modules evaluated in global context without errors.');

// 4. Test Student -> Admin -> Technician -> Faculty -> Completed Workflow
console.log('\n--- Testing End-to-End Workflow ---');

// Step 1: Student Files Complaint
const newTicketId = 'COMP-TEST-001';
const studentComplaint = {
  id: newTicketId,
  title: 'Corridor emergency lighting failing',
  category: 'Electrical Department',
  description: 'Emergency lights are not turning on in Corridor 3.',
  location: 'Block C 2nd Floor',
  priority: 'High',
  reportedBy: 'Kabir Mehta',
  reportedByGr: '1001',
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
  image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600',
  video: '',
  proofImg: '',
  remark: '',
  qaVerified: false,
  qaFeedback: '',
  logs: [
    { s: 'Complaint Submitted', note: 'Self Category: Electrical Department | Priority: High', time: nowStr(), by: 'Kabir Mehta' }
  ]
};

appState.complaints.unshift(studentComplaint);
persist();

let sInfo = getComplaintStageInfo(studentComplaint);
if (sInfo.stage === 1 && sInfo.percent === 14 && sInfo.statusText === 'Complaint Submitted') {
  console.log(`[PASS] Step 1 - Student Filed: Stage=${sInfo.stage} (${sInfo.percent}%), Status="${sInfo.statusText}"`);
} else {
  console.error(`[FAIL] Step 1 Failed:`, sInfo);
  process.exit(1);
}

// Step 2: Admin Verifies and Dispatches to Technician
studentComplaint.category = 'Electrical Department';
studentComplaint.techId = 'TECH-01';
studentComplaint.techName = 'Dilip Prasad';
studentComplaint.deadline = '25/08/2026';
studentComplaint.status = 'Approved by Admin';
studentComplaint.current_status = 'Approved by Admin';
studentComplaint.stage = 2;
studentComplaint.admin_status = 'Approved';
studentComplaint.admin_verification_date = nowStr();
studentComplaint.logs.push({ s: 'Admin Verified', note: 'Approved and dispatched to Dilip Prasad', time: nowStr(), by: 'Admin Office' });
persist();

sInfo = getComplaintStageInfo(studentComplaint);
if (sInfo.stage === 2 && sInfo.percent === 28 && sInfo.statusText === 'Approved by Admin') {
  console.log(`[PASS] Step 2 - Admin Verified: Stage=${sInfo.stage} (${sInfo.percent}%), Status="${sInfo.statusText}"`);
} else {
  console.error(`[FAIL] Step 2 Failed:`, sInfo);
  process.exit(1);
}

// Step 3: Technician Accepts Complaint
studentComplaint.status = 'Work in Progress';
studentComplaint.current_status = 'Work in Progress';
studentComplaint.stage = 4;
studentComplaint.technician_status = 'Accepted';
studentComplaint.technician_action = 'Accepted';
studentComplaint.work_status = 'In Progress';
studentComplaint.logs.push({ s: 'Technician Accepted', note: 'Accepted by Dilip Prasad', time: nowStr(), by: 'Dilip Prasad' });
studentComplaint.logs.push({ s: 'Work in Progress', note: 'Work underway', time: nowStr(), by: 'Dilip Prasad' });
persist();

sInfo = getComplaintStageInfo(studentComplaint);
if (sInfo.stage === 4 && sInfo.percent === 57 && sInfo.statusText === 'Work in Progress') {
  console.log(`[PASS] Step 3 - Technician Accepted / Work in Progress: Stage=${sInfo.stage} (${sInfo.percent}%), Status="${sInfo.statusText}"`);
} else {
  console.error(`[FAIL] Step 3 Failed:`, sInfo);
  process.exit(1);
}

// Step 4: Technician Completes Work and Uploads Proof
studentComplaint.status = 'Work Completed by Technician';
studentComplaint.current_status = 'Work Completed by Technician';
studentComplaint.stage = 5;
studentComplaint.technician_status = 'Completed';
studentComplaint.work_status = 'Completed';
studentComplaint.technician_completion_date = nowStr();
studentComplaint.proofImg = 'data:image/jpeg;base64,mockProofData';
studentComplaint.remark = 'Replaced backup capacitor and 24V LED array';
studentComplaint.logs.push({ s: 'Technician Completed', note: studentComplaint.remark, time: nowStr(), by: 'Dilip Prasad' });
studentComplaint.logs.push({ s: 'Work Completed by Technician', note: 'Transferred to Faculty for Final Verification', time: nowStr(), by: 'Dilip Prasad' });
persist();

sInfo = getComplaintStageInfo(studentComplaint);
if (sInfo.stage === 5 && sInfo.percent === 71 && sInfo.statusText === 'Work Completed by Technician') {
  console.log(`[PASS] Step 4 - Technician Completed: Stage=${sInfo.stage} (${sInfo.percent}%), Status="${sInfo.statusText}"`);
} else {
  console.error(`[FAIL] Step 4 Failed:`, sInfo);
  process.exit(1);
}

// Step 5: Faculty Final Verification and Approval
studentComplaint.status = 'Completed';
studentComplaint.current_status = 'Completed';
studentComplaint.stage = 7;
studentComplaint.faculty_status = 'Verified';
studentComplaint.faculty_verification_date = nowStr();
studentComplaint.qaVerified = true;
studentComplaint.qaFeedback = 'Tested emergency corridor lighting, fully operational.';
studentComplaint.logs.push({ s: 'Faculty Verified', note: studentComplaint.qaFeedback, time: nowStr(), by: 'Electrical Faculty Advisor' });
studentComplaint.logs.push({ s: 'Completed', note: 'Work Done / Completed', time: nowStr(), by: 'System' });
persist();

sInfo = getComplaintStageInfo(studentComplaint);
if (sInfo.stage === 7 && sInfo.percent === 100 && sInfo.statusText === 'Completed ✅') {
  console.log(`[PASS] Step 5 - Faculty Verified & Completed: Stage=${sInfo.stage} (${sInfo.percent}%), Status="${sInfo.statusText}"`);
} else {
  console.error(`[FAIL] Step 5 Failed:`, sInfo);
  process.exit(1);
}

// Step 6: Test Rejection Flows
const rejectedByAdmin = {
  id: 'COMP-TEST-REJ-1',
  status: 'Rejected by Admin',
  stage: 0,
  admin_status: 'Rejected'
};
const r1Info = getComplaintStageInfo(rejectedByAdmin);
if (r1Info.isRejected && r1Info.statusText === 'Rejected by Admin') {
  console.log(`[PASS] Admin Rejection Flow: Status="${r1Info.statusText}", isRejected=${r1Info.isRejected}`);
} else {
  console.error(`[FAIL] Admin Rejection Flow Failed:`, r1Info);
  process.exit(1);
}

const rejectedByTech = {
  id: 'COMP-TEST-REJ-2',
  status: 'Rejected by Technician',
  stage: 0,
  technician_status: 'Rejected'
};
const r2Info = getComplaintStageInfo(rejectedByTech);
if (r2Info.isRejected && r2Info.statusText === 'Rejected by Technician') {
  console.log(`[PASS] Technician Rejection Flow: Status="${r2Info.statusText}", isRejected=${r2Info.isRejected}`);
} else {
  console.error(`[FAIL] Technician Rejection Flow Failed:`, r2Info);
  process.exit(1);
}

console.log('\n========================================');
console.log('ALL WORKFLOW VERIFICATION TESTS PASSED!');
console.log('========================================\n');
