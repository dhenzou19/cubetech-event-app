# CubeTech Event Registration System

A web application for event registration with QR code ticketing and staff check-in functionality. Built for the CubeTech Innovations Software Development Internship Assessment.

## 🏆 Level Reached
**Level 3 (Advanced) - Fully Completed**

## 🛠️ Tech Stack
*   **Frontend:** Next.js 16 (App Router, React Server Components, Tailwind CSS v4)
*   **Backend:** Next.js Server Actions (Node.js)
*   **Database:** PostgreSQL (Hosted on Neon)
*   **ORM:** Prisma 8 (Release Candidate)
*   **Authentication:** `jose` (JWT stored in HTTP-Only cookies)
*   **QR Code:** `qrcode` & `html5-qrcode` (for camera scanning)

## 🚀 Setup and Run Instructions

1. **Clone the repository:**
    git clone https://github.com/dhenzrou19/cubetech-event-app.git
    cd cubetech-event-app

2. **Install dependencies:**
    npm install

3. **Environment Variables:**
    Copy the `.env.example` file to `.env` and fill in your PostgreSQL connection string and a secure JWT secret.
    cp .env.example .env

4. **Database Setup (Prisma 8):**
    Generate the contract and push the schema to your database.
    npx prisma contract emit
    npx prisma db update

5. **Seed the Database:**
    Populate the database with the demo events and staff accounts.
    npx tsx prisma/seed.ts

6. **Run the development server:**
    npm run dev
    Open http://localhost:3000 in your browser.

## 🔐 Demo Staff Logins
Use these credentials to access the staff dashboard (`/staff/login`):
*   **Organizer (Full Access):** 
    *   Username: `admin`
    *   Password: `dd09090709977`
*   **Door Staff (Check-in only):** 
    *   Username: `demo`
    *   Password: `password123`

## 📊 Data Model
*   **StaffUser:** Stores organizer/staff credentials (hashed passwords) and roles.
*   **Event:** Stores event details (title, venue, capacity, start/end times, status).
*   **Registration:** Links an attendee to an event, stores their unique 32-character ticket code, and tracks check-in status.
*   **AuditLog:** Records all staff actions (check-in, undo, promotion) for security compliance.

## ✅ Completed Features (Level 1 & 2)
- [x] **Event List & Details:** Shows upcoming events. Past events are marked "Ended".
- [x] **Registration Form:** Collects name, email, and 11-digit PH mobile. Client and server-side validation.
- [x] **Capacity Check & Waitlist:** Server checks capacity. If full, attendees join a waitlist. Staff can promote them.
- [x] **Duplicate Prevention:** One email can only register once per event.
- [x] **Ticket Page:** Generates a unique, cryptographically secure ticket code and a scannable QR code.
- [x] **Ticket Lookup:** Attendees can find their ticket using their Ticket Code + Email.
- [x] **Cancellation:** Attendees can cancel their ticket, freeing up a spot.
- [x] **Staff Sign-in:** Secure JWT-based authentication protecting staff routes.
- [x] **Check-in Screen:** Staff can enter a ticket code manually OR use the camera to scan the QR code.
- [x] **Attendee List:** Staff can view a table of attendees with search functionality and live totals.
- [x] **Event Management:** Staff can create, edit, and close events with server-side validation.
- [x] **CSV Export:** Staff can download the attendee list.
- [x] **Undo Check-in:** Staff can reverse a mistaken check-in via a custom modal.

## 👑 Completed Features (Level 3)
- [x] **Camera QR Scanning:** Staff can use their device camera to scan tickets instantly.
- [x] **Secure QR Content:** Ticket codes are 32-character cryptographically secure random strings. Rate limiting prevents brute-force attacks.
- [x] **Roles & Audit Log:** Two roles (Organizer, Staff). Door staff only sees the Check-In tab. Every check-in, undo, and promotion is logged in the Audit Log.
- [x] **Deployment:** Fully deployed to Vercel with a Neon serverless PostgreSQL database.

## ⚠️ Known Limitations
*   Prisma 8 is currently in Release Candidate (RC). Due to changes in the query engine, some operations (like `.count()`) were bypassed in favor of fetching and filtering in memory to ensure stability.
*   Rate limiting is currently implemented in-memory. In a multi-instance serverless environment, a Redis-based rate limiter would be needed for strict global limits.
