
<div align="center">

# Campus Connect

**A centralized problem reporting and resolution portal for campus facility management**

Built for a GTU Diploma Engineering Minor Project — replaces manual complaint registers with a transparent, role-based digital workflow.

[![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

</div>

---

## Overview

Students on campus routinely deal with day-to-day issues — a broken fan, a leaking tap, a dead Wi-Fi connection, a damaged bench. Historically these get reported through informal channels: a note in a register, a verbal request to staff, or nothing at all. Complaints get lost, no one is accountable for a fix, and there is no way to know whether — or when — something will actually be resolved.

**Campus Connect** replaces that with a single web application built around a simple idea, borrowed from how delivery platforms work: a student *places the request*, an admin *verifies and routes it*, department faculty *assigns and quality-checks the work*, and a technician *does the fix*. Every step is logged, so nothing disappears into a black hole.

## Table of Contents

- [How It Works](#how-it-works)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Roles & Default Credentials](#roles--default-credentials)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [License](#license)

## How It Works

```
Student                Admin              Faculty              Technician
   │                     │                   │                     │
   │  submits complaint  │                   │                     │
   ├────────────────────>│                   │                     │
   │                     │  verifies /       │                     │
   │                     │  reassigns dept   │                     │
   │                     ├──────────────────>│                     │
   │                     │                   │  assigns technician │
   │                     │                   │  + sets deadline    │
   │                     │                   ├────────────────────>│
   │                     │                   │                     │
   │                     │                   │   accept / decline  │
   │                     │                   │<─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
   │                     │                   │                     │
   │                     │                   │  uploads proof photo│
   │                     │                   │<────────────────────┤
   │                     │                   │                     │
   │                     │                   │  QA: approve /      │
   │                     │                   │  send back for      │
   │                     │                   │  rework             │
   │<─ notified when resolved ───────────────┤                     │
```

Every transition above — verification, assignment, acceptance, decline, completion, QA approval, or rework — is written to an immutable audit log (`complaint_logs`), so the full history of any complaint can always be reconstructed.

## Features

**Student**
- Submit a complaint with title, category, description, location, and an optional photo/video
- Priority (High / Medium / Low) is auto-detected server-side from keywords in the description
- Track live status and read the full history of a complaint
- Get notified at every stage of the process

**Admin**
- Verify or reassign the department for every incoming complaint before it's routed
- Reject complaints that don't belong in the system, with a mandatory reason
- Manage technician accounts and student accounts (warn / suspend)
- View dashboard analytics (by department, status, and priority) and export all data to CSV

**Department Faculty**
- Assign verified complaints to a technician in their department, with a mandatory deadline
- Perform final quality assurance on completed work — approve or send back for rework
- Independent of the technician who did the work, for accountability

**Technician**
- Accept or decline assigned tasks (decline requires a reason and returns the task to Faculty)
- Mark work complete with a mandatory proof photo and remark
- See only tasks assigned to them

**System-wide**
- Role-based authentication with server-side authorization checks on every endpoint
- Full audit trail — nothing is ever silently overwritten
- In-app notifications scoped to student / department / technician
- No AI/ML dependency — priority detection uses a transparent, editable keyword table

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | PHP 8 (PDO, prepared statements) |
| Database | MySQL / MariaDB |
| Server | Apache (XAMPP for local development) |
| Auth | PHP native sessions, `password_hash()` / `password_verify()` |

No frameworks, no build step, no external services required — the entire backend runs on a stock XAMPP install.

## Project Structure

```
campus-connect/
├── config/
│   └── db.php                  # PDO connection (edit DB credentials here)
├── includes/
│   └── helpers.php             # Shared response/session/logging helpers
├── schema/
│   └── schema.sql              # Full database schema + seed data
├── auth/
│   ├── login_student.php
│   ├── login_faculty.php
│   ├── login_technician.php
│   ├── login_admin.php
│   ├── register_student.php
│   ├── logout.php
│   └── session_check.php
├── complaints/
│   ├── submit.php              # Create complaint (handles file upload)
│   ├── list.php                # Role-scoped complaint list
│   └── detail.php              # Single complaint + full audit log
├── admin/
│   ├── verify.php              # Verify / reassign department
│   ├── reject.php
│   ├── technicians.php         # List / register technicians
│   ├── technician_toggle.php   # Activate / deactivate a technician
│   ├── students.php
│   ├── student_flag.php        # Warn / suspend a student
│   ├── reports.php             # Dashboard statistics
│   └── export_csv.php
├── faculty/
│   ├── forward.php             # Assign to technician + deadline
│   └── qa_decision.php         # Approve or send back for rework
├── technician/
│   ├── accept.php
│   ├── decline.php
│   └── complete.php            # Requires proof photo + remark
├── notifications/
│   ├── list.php
│   └── mark_read.php
└── uploads/
    ├── complaints/              # Student-submitted photos/videos
    └── proofs/                  # Technician proof-of-completion photos
```

## Database Schema

Eight tables model the full workflow:

| Table | Purpose |
|---|---|
| `users` | Student accounts |
| `faculties` | One account per department |
| `technicians` | Technician accounts and ratings |
| `admins` | Admin accounts |
| `complaints` | Core complaint record and current status |
| `complaint_logs` | Append-only audit trail per complaint |
| `notifications` | Per-user/department/technician notifications |
| `priority_keywords` | Keyword → priority mapping used for auto-detection |

Full definitions, indexes, and seed data are in [`schema/schema.sql`](schema/schema.sql). The `complaints` table is seeded empty — sample data is never pre-loaded; only real submissions populate it.

**Complaint status values:**
`Pending Admin Verification` → `Awaiting Faculty Forwarding` → `Assigned to Technician` → `Resolution Started` → `Pending Faculty Verification` → `Perfectly Completed`, with `Rejected by Verifier` as a terminal branch from the first step.

## Getting Started

### Prerequisites
- [XAMPP](https://www.apachefriends.org/) (or any Apache + PHP 8 + MySQL stack)

### Setup

1. **Clone into your XAMPP `htdocs` folder**
   ```bash
   cd /path/to/xampp/htdocs
   git clone https://github.com/<your-username>/campus-connect.git
   cd campus-connect
   ```

2. **Create the database**
   ```bash
   mysql -u root -p < schema/schema.sql
   ```

3. **Configure the connection**

   Edit `config/db.php` if your MySQL credentials differ from the XAMPP defaults:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'campus_connect');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```

4. **Make the uploads folder writable**
   ```bash
   chmod -R 775 uploads/
   ```

5. **Start Apache and MySQL** from the XAMPP Control Panel, then open:
   ```
   http://localhost/campus-connect/
   ```

## API Reference

All endpoints return JSON in the shape `{ "ok": bool, "message": string, "data": ... }`. Session-based auth — log in first, then the session cookie authorizes subsequent requests.

<details>
<summary><strong>Auth</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login_student.php` | `grNo`, `password` |
| POST | `/auth/login_faculty.php` | `dept`, `password` |
| POST | `/auth/login_technician.php` | `id`, `password` |
| POST | `/auth/login_admin.php` | `username`, `password` |
| POST | `/auth/register_student.php` | `grNo`, `name`, `dept`, `password` |
| POST | `/auth/logout.php` | — |
| GET | `/auth/session_check.php` | Restore session on page load |

</details>

<details>
<summary><strong>Complaints</strong></summary>

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/complaints/submit.php` | Student | `title`, `category`, `description`, `location` (+ optional `image`/`video` files) |
| GET | `/complaints/list.php` | Any | Returns complaints scoped to the caller's role |
| GET | `/complaints/detail.php?id=` | Any | Full detail + audit log, with access-scope enforcement |

</details>

<details>
<summary><strong>Admin</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/verify.php` | `id`, optional `category` — confirm or reassign, routes to Faculty |
| POST | `/admin/reject.php` | `id`, `reason` |
| GET / POST | `/admin/technicians.php` | List or register technicians |
| POST | `/admin/technician_toggle.php` | `id` — activate/deactivate |
| GET | `/admin/students.php` | List all students |
| POST | `/admin/student_flag.php` | `grNo`, `field` (`warned`/`suspended`) |
| GET | `/admin/reports.php` | Dashboard statistics |
| GET | `/admin/export_csv.php` | Downloads all complaints as CSV |

</details>

<details>
<summary><strong>Faculty</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/faculty/forward.php` | `id`, `techId`, `deadline` (required) |
| POST | `/faculty/qa_decision.php` | `id`, `approve` (bool), `feedback` (required either way) |

</details>

<details>
<summary><strong>Technician</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/technician/accept.php` | `id` |
| POST | `/technician/decline.php` | `id`, `reason` (required) |
| POST | `/technician/complete.php` | `id`, `remark` + `proofImg` file (both required) |

</details>

<details>
<summary><strong>Notifications</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications/list.php` | Scoped to the caller's role |
| POST | `/notifications/mark_read.php` | Marks all of the caller's notifications as read |

</details>

## Roles & Default Credentials

Seed data creates one account per role for local testing. **Change every password before any real deployment.**

| Role | Login | Password |
|---|---|---|
| Admin | `admin` | `password` |
| Student | `1001` – `1004` | `password` |
| Faculty | e.g. `Electrical Department` | `password` |
| Technician | `TECH-01` – `TECH-04` | `password` |

## Testing

A full end-to-end test script (`test_e2e.sh`) exercises the entire lifecycle against a live server — submission, keyword-based priority detection, admin verification, faculty forwarding, technician accept/complete, faculty QA, and role-based access control — using PHP's built-in server and `curl`:

```bash
php -S localhost:8899 &
bash test_e2e.sh
```

## Roadmap

- [ ] Email/SMS notifications alongside in-app ones
- [ ] Deadline breach flagging on the Admin dashboard
- [ ] QR-code location tagging for faster submission
- [ ] Duplicate-complaint detection before submission

## License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

Built by Gudka Shubh Nejul · Katarmal Nirav Pradipbhai · Koradia Dev Girishbhai · Mehta Darshan Mehulbhai
Government Polytechnic, Jamnagar — Diploma Engineering, GTU

</div>
