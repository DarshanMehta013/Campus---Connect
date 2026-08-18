# Campus Connect — Automated Multi-Role Resolution Portal (v3.0)

A high-performance, modular multi-page institutional governance and facility resolution web application built with HTML5, CSS3, Vanilla JavaScript, and Tailwind CSS.


## Project Structure

```text
Campus-Connect/
│
├── index.html                 ← Home / Landing Page
├── portal.html                ← 4-Step Automated Resolution Portal
├── roles.html                 ← Role Workspaces & Dashboards (Student, Faculty, Tech, Admin)
├── feed.html                  ← Live Campus Transparency & Status Board
├── login.html                 ← Portal Authentication Hub & Student Registration
│
├── css/
│   ├── style.css              ← Common design tokens, header, modals, toasts, animations
│   ├── home.css               ← Hero section layout, FLOW_MONITOR live ticker, metric counters
│   ├── portal.css             ← 4-step workflow cards, process connectors, priority alert
│   ├── roles.css              ← Role cards, dashboards, charts containers, admin tabs & tables
│   ├── feed.css               ← Live issue search bar, department filter pills, feed timeline
│   └── login.css              ← Split auth hero layout, role tab switcher, social auth buttons
│
├── js/
│   ├── main.js                ← LocalStorage store, session watchdog, notifications, toasts, theme, lightbox, profile
│   ├── navigation.js          ← Dynamic navbar hide/show on scroll, active page indicator, mobile menu, page transitions
│   ├── animations.js          ← IntersectionObserver scroll reveal, staggered cards, FLOW_MONITOR live ticker
│   ├── portal.js              ← 4-Step portal interactions, complaint filing modal, hazard AI keyword detect, file uploads
│   ├── roles.js               ← Student, Faculty, Technician, and Admin dashboards & workflows, QA, Chart.js, CSV exports
│   ├── feed.js                ← Public live feed rendering, search filter, department filters, upvoting
│   └── login.js               ← Tabbed role authentication, student registration, Google/GitHub SSO, role redirects
│
├── assets/
│   ├── images/
│   │   └── bg.png             ← Campus backdrop pattern
│   ├── icons/                 ← Icon resources
│   └── logo/
│       └── logo.png           ← Campus Connect brand emblem
│
└── README.md
```

---

## Core Pages & Workflows

1. **Home (`index.html`)**
   - High-impact Hero with staggered text reveals and animated campus backdrop.
   - Interactive `FLOW_MONITOR` card showcasing real-time resolution telemetry.
   - Live metrics summary, core platform benefits, and one-click quick actions.

2. **4-Step Portal (`portal.html`)**
   - Step 1: Student Hazard Dispatch with automated keyword hazard detection (`criticalPriorityKeywords`).
   - Step 2: Admin Queue Verification & Department Routing.
   - Step 3: Faculty Assignment to Specialized Technicians with strict SLA countdowns.
   - Step 4: Department QA & Resolution Photo Proof Inspection.
   - Evidence file upload dropzones supporting high-resolution images and video clips.

3. **Role Portals (`roles.html`)**
   - Direct workspace access for 4 core campus personas:
     - **Student Workspace**: File complaints, track live progress timeline, view resolution proofs.
     - **Faculty Workspace**: Monitor department-specific queues, delegate work orders to technicians, certify QA proofs.
     - **Technician Workspace**: Accept/decline tasks, view location details, upload photo proof upon completion.
     - **Admin Workspace**: Operations analytics (Chart.js), inbound ticket dispatching, technician registry, student directory with suspension/warning controls, and CSV/print audit reports.

4. **Public Feed (`feed.html`)**
   - Real-time campus issue status board for full operational transparency.
   - Live department filtering (Computer, Electrical, Mechanical, Civil) and instant text search.
   - Lightbox modal for full-size inspection of fault evidence and resolution photos.

5. **Portal Login (`login.html`)**
   - Tabbed authentication switcher for Student, Faculty, Technician, and Administrator.
   - Pre-configured demo accounts for fast evaluation.
   - Student self-registration modal.
   - Simulated Google and GitHub Institutional SSO handshakes.

---

## Pre-Configured Demo Credentials

| Role | Identifier / Department | Password |
| :--- | :--- | :--- |
| **Student** | Roll/GR: `1001` (Kabir Mehta) | `password` |
| **Student** | Roll/GR: `1002` (Ananya Iyer) | `password` |
| **Faculty** | Dept: `Electrical Department` | `password` |
| **Faculty** | Dept: `Computer Department` | `password` |
| **Technician** | Tech ID: `TECH-01` (Dilip Prasad) | `password` |
| **Technician** | Tech ID: `TECH-02` (Jagdish Panchal) | `password` |
| **Administrator** | Username: `admin` | `password` |

---

## Running Locally

To view and interact with the application locally, you can open any `.html` file directly in any modern web browser or run a local development server:

### Using Python:
```bash
python -m http.server 3000
```
Then visit: [http://localhost:3000](http://localhost:3000)

### Using Node / npx:
```bash
npx serve .
```

---

## Technical Highlights

- **Zero Build Step Required**: Runs natively in all modern browsers with pure ES6 JavaScript and Vanilla CSS.
- **Persistent State**: Full data persistence powered by browser `localStorage` (`campus_connect_v3_zomato`).
- **Dynamic Physics Navbar**: Smoothly hides on downward scrolling and glides back into view when scrolling up or returning to top.
- **Scroll Reveal Physics**: Zero-jank `IntersectionObserver` animations with staggered card delays.
- **Theme Engine**: Persistent Dark and Light theme toggle with `localStorage` memory and system preferences auto-detection.
