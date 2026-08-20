# 🏫 Campus Connect

### Automated Multi-Role Campus Issue Resolution Portal

> A smart campus governance platform designed to streamline complaint reporting, automated issue prioritization, departmental routing, technician assignment, quality inspection, and public status tracking through a unified multi-role workflow.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](#)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge\&logo=fontawesome\&logoColor=white)](#)

---

## 📌 Overview

**Campus Connect** is a web-based campus issue management and resolution platform created to solve a common problem in educational institutions: **delayed reporting, improper issue routing, lack of transparency, and slow resolution of campus complaints.**

The platform provides a structured workflow where a student can report an issue, the system can identify its priority, the complaint can move through verification and departmental routing, technicians can receive work orders, proof of resolution can be submitted, and the responsible authority can perform quality inspection before closure.

The project follows a **multi-role governance model**, giving different users access to the tools and information relevant to their responsibilities.

---

## 🎯 Problem Statement

Traditional campus complaint systems often depend on:

* Manual complaint registration
* Unclear responsibility for reported issues
* Delayed communication between departments
* Difficulty identifying high-priority hazards
* Lack of resolution tracking
* No proper proof of completed work
* Limited transparency for students

Campus Connect addresses these problems by introducing a centralized digital workflow.

---

## 💡 Proposed Solution

Campus Connect creates an end-to-end resolution pipeline:

```text
Student
   │
   ▼
Complaint Registration
   │
   ▼
Automatic Priority Detection
   │
   ▼
Verification & Audit
   │
   ▼
Department Routing
   │
   ▼
Technician Assignment
   │
   ▼
Issue Resolution
   │
   ▼
Photographic Proof
   │
   ▼
Quality Inspection
   │
   ▼
Complaint Closure
   │
   ▼
Public Status Tracking
```

This provides better accountability, faster issue handling, and greater transparency.

---

# 🚀 Key Features

## 📝 1. Smart Complaint Reporting

Students can report campus issues through a structured complaint interface.

Users can provide:

* Complaint title
* Issue description
* Department/category
* Priority information
* Images
* Videos
* Supporting evidence

The system is designed to make issue reporting simple while collecting the information required for further processing.

---

## ⚡ 2. Automatic Priority Detection

The platform analyzes complaint information and identifies potentially critical issues using predefined keywords and priority rules.

Examples of potentially high-priority hazards include:

* Electrical hazards
* Sparks
* Exposed wires
* Water leakage
* Dangerous infrastructure conditions

High-priority complaints can be highlighted and handled differently from normal requests.

---

## 🔄 3. Four-Step Resolution Workflow

The core of Campus Connect is its structured **4-Step Operational Resolution Portal**.

### Step 1 — Student Filing

The student submits a complaint with the necessary information and supporting evidence.

### Step 2 — Verification & Routing

The complaint is reviewed and routed to the appropriate department or authority.

### Step 3 — Technician Resolution

A technician receives the work order and performs the required repair or maintenance.

### Step 4 — Quality Assurance

The completed work is inspected and photographic proof can be submitted before the complaint is finally closed.

---

## 👥 4. Multi-Role Portal System

Campus Connect provides different workflows for different roles.

### 🎓 Student

Students can:

* Submit complaints
* Track complaint progress
* View complaint status
* Monitor active and completed issues
* Access their profile

### 🧑‍🏫 Faculty / Department

Faculty members can:

* Verify complaints
* Review incoming issues
* Route complaints
* Manage departmental workflows
* Perform quality inspection

### 🛠️ Technician

Technicians can:

* View assigned work orders
* Accept or decline assignments
* Work on assigned issues
* Submit completion status
* Upload proof photographs

### 👨‍💼 Administrator

Administrators can:

* Monitor the overall system
* Manage users and technicians
* Modify administrative information
* Review institutional reports
* Manage governance-level operations

---

# 📊 5. Role-Based Dashboard

The Role Portals page provides different interfaces depending on the logged-in user's role.

The system dynamically renders role-specific views instead of showing every user the same dashboard.

This makes the interface more focused and easier to use.

---

# 📢 6. Public Campus Feed

The **Public Feed** provides a live-style status board for campus issues.

Users can view:

* Reported issues
* Current status
* Issue categories
* Resolution progress
* Publicly available complaint information

This improves transparency and allows the campus community to stay informed.

---

# 🧑‍🔧 7. Technician Management

The platform includes technician registration and management functionality.

Administrators can manage technician information while the system can associate technicians with relevant work orders.

---

# 📸 8. Evidence & Proof Upload

The project supports media-based issue documentation.

Users can upload:

* Complaint images
* Complaint videos
* Resolution proof photographs

This provides stronger evidence throughout the complaint lifecycle.

---

# 🔐 9. Multi-Role Authentication

Campus Connect provides role-specific login functionality for:

* Students
* Faculty
* Technicians
* Administrators

User/session information is handled on the frontend using browser storage for this project implementation.

---

# 🌙 10. Light & Dark Mode

The interface includes a modern theme system with:

* Light mode
* Dark mode
* Persistent theme preference
* Smooth theme transitions
* Dark-mode optimized UI components

The project also initializes the saved theme before the page renders to reduce theme flashing.

---

# ✨ 11. Modern UI/UX

The interface uses a modern campus-governance dashboard aesthetic featuring:

* Glassmorphism
* Aurora-style backgrounds
* Gradient accents
* Responsive layouts
* Animated UI elements
* Interactive cards
* Hover effects
* Smooth transitions
* Modern typography
* Responsive navigation

The primary visual palette is based around:

```text
Purple
   +
Cyan
   +
Blue
   +
Dark Navy
```

---

# 🗂️ Project Structure

```text
Campus---Connect/
│
├── assets/
│   ├── images/
│   │   ├── bg.png
│   │   ├── campus-bg.jpg
│   │   └── campus-bg.png
│   │
│   └── logo/
│       └── logo.png
│
├── css/
│   ├── feed.css
│   ├── home.css
│   ├── login.css
│   ├── portal.css
│   ├── roles.css
│   └── style.css
│
├── js/
│   ├── animations.js
│   ├── feed.js
│   ├── login.js
│   ├── main.js
│   ├── navigation.js
│   ├── portal.js
│   └── roles.js
│
├── index.html
├── portal.html
├── roles.html
├── feed.html
├── login.html
│
├── bg.png
├── logo.png
├── .gitignore
└── README.md
```

---

# 📄 Main Pages

| Page          | Purpose                              |
| ------------- | ------------------------------------ |
| `index.html`  | Campus Connect landing page          |
| `portal.html` | 4-step complaint resolution workflow |
| `roles.html`  | Multi-role dashboards and operations |
| `feed.html`   | Public campus issue status board     |
| `login.html`  | Multi-role authentication            |

---

# ⚙️ Technology Stack

## Frontend

### HTML5

Used to structure the different pages and application components.

### CSS3

Used for:

* Custom styling
* Animations
* Responsive layouts
* Theme customization
* UI effects

### JavaScript

Used for:

* Application logic
* Complaint processing
* Dynamic dashboard rendering
* Authentication
* Role-based views
* Navigation
* Local data management
* Media uploads
* Status tracking

### Tailwind CSS

Used alongside custom CSS to accelerate responsive UI development and provide utility-based styling.

### Font Awesome

Used for interface icons and visual indicators.

### Google Fonts

The project uses:

* Inter
* Plus Jakarta Sans

---

# 🧠 Application Architecture

Campus Connect follows a modular frontend architecture.

```text
                    Campus Connect
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Student        Faculty       Administrator
          │              │              │
          └──────────────┼──────────────┘
                         │
                    Complaint
                         │
                         ▼
                Priority Detection
                         │
                         ▼
                  Issue Verification
                         │
                         ▼
                  Department Routing
                         │
                         ▼
                 Technician Assignment
                         │
                         ▼
                    Issue Repair
                         │
                         ▼
                    Proof Upload
                         │
                         ▼
                       QA
                         │
                         ▼
                     Closure
```

---

# 🔄 Complaint Lifecycle

A complaint can move through multiple stages:

```text
Filed
  ↓
Verified
  ↓
Routed
  ↓
Assigned
  ↓
In Progress
  ↓
Technician Completed
  ↓
Quality Inspection
  ↓
Resolved / Closed
```

This provides a clear representation of where an issue currently stands.

---

# 💾 Data Handling

This project is implemented as a frontend-focused prototype.

Browser-based storage such as:

```javascript
localStorage
```

is used for maintaining application state, user/session information, preferences, and prototype data.

This allows the project to demonstrate the complete workflow without requiring a dedicated backend server.

---

# 🛠️ Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/your-username/campus-connect.git
```

## 2. Open the project

```bash
cd campus-connect
```

## 3. Run the project

Because this is a frontend project, you can launch it using a local development server.

### VS Code

Install the **Live Server** extension and open:

```text
index.html
```

Then select:

```text
Open with Live Server
```

The website will open locally in your browser.

---

# 🌐 Navigation

After launching the project:

```text
Home
│
├── 4-Step Portal
│
├── Role Portals
│
├── Public Feed
│
└── Portal Login
```

---

# 📱 Responsive Design

The interface is designed to work across different screen sizes:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Mobile
* 📲 Tablet

Responsive utility classes and CSS media queries are used throughout the application.

---

# 🎨 UI/UX Highlights

Some of the main UI/UX concepts implemented in the project include:

* Glassmorphism
* Aurora backgrounds
* Gradient buttons
* Interactive navigation
* Animated components
* Responsive cards
* Status badges
* Progress indicators
* Modal interfaces
* Image previews
* Dark mode
* Dynamic role dashboards
* Smooth page interactions

---

# 🔮 Future Improvements

The current project is a frontend prototype. Future versions can extend it with a complete backend infrastructure.

### Planned Improvements

* [ ] Node.js / Express backend
* [ ] MySQL or MongoDB database
* [ ] Secure authentication
* [ ] Password hashing
* [ ] JWT-based sessions
* [ ] Real-time notifications
* [ ] Email notifications
* [ ] SMS alerts
* [ ] Real-time complaint tracking
* [ ] Admin analytics dashboard
* [ ] Advanced reporting
* [ ] Cloud storage for images/videos
* [ ] AI-powered complaint classification
* [ ] AI-based priority prediction
* [ ] Mobile application
* [ ] Push notifications
* [ ] Department performance analytics

---

# 📈 Future System Vision

The long-term goal of Campus Connect is to evolve from a frontend prototype into a complete **Smart Campus Governance Platform**.

```text
                    Smart Campus
                        │
        ┌───────────────┼───────────────┐
        │               │               │
     Students        Faculty        Administration
        │               │               │
        └───────────────┼───────────────┘
                        │
                 Campus Connect
                        │
        ┌───────────────┼───────────────┐
        │               │               │
      Issues          Analytics       Alerts
        │               │               │
        └───────────────┼───────────────┘
                        │
                  Smart Governance
```

---

# 🎓 Academic Project

**Campus Connect** is developed as a **Minor Project** focused on applying web development, JavaScript, UI/UX design, and software engineering concepts to a real-world campus management problem.

### Project Focus

```text
Web Development
      +
JavaScript
      +
UI/UX
      +
Automation
      +
Multi-Role Workflow
      +
Smart Campus Governance
```

---


# ⭐ Project Highlights

> **Report it. Route it. Resolve it. Verify it.**

Campus Connect aims to make campus issue management:

**Faster • Smarter • Transparent • Accountable**

---

## 📜 License

This project is developed for **educational and academic purposes**.

You are welcome to explore the source code and use the project as a learning reference.

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

---

### Campus Connect

**Automated Multi-Role Campus Issue Resolution Portal**

`Built for a smarter, safer and more connected campus.`
