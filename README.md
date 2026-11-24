# CubeTech Event Registration System

A web application for event registration with QR code ticketing and staff check-in functionality. Built for the CubeTech Innovations Software Development Internship Assessment.

## 🏆 Level Reached
**Level 1 (Core) - Fully Completed**

## 🛠️ Tech Stack
*   **Frontend:** Next.js 16 (App Router, React Server Components, Tailwind CSS v4)
*   **Backend:** Next.js Server Actions (Node.js)
*   **Database:** PostgreSQL (Hosted on Neon)
*   **ORM:** Prisma 8 (Release Candidate)
*   **Authentication:** `jose` (JWT stored in HTTP-Only cookies)
*   **QR Code Generation:** `qrcode`

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
   Populate the database with the demo events and staff account.
    npx tsx prisma/seed.ts

6. **Run the development server:**
    npm run dev
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Staff Login
Use these credentials to access the staff dashboard (`/staff/login`):
*   **Username:** `staff1`
*   **Password:** `password123`

## 📊 Data Model
*   **StaffUser:** Stores organizer/staff credentials (hashed passwords).
*   **Event:** Stores event details (title, venue, capacity, start/end times).
*   **Registration:** Links an attendee to an event, stores their unique ticket code, and tracks check-in status.

## ✅ Completed Features (Level 1 Acceptance Checklist)
- [x] **Event List & Details:** Shows upcoming events. Past events are marked "Ended".
- [x] **Registration Form:** Collects name, email, and 11-digit PH mobile. Client and server-side validation.
- [x] **Capacity Check:** Server checks capacity before saving to prevent overbooking.
- [x] **Duplicate Prevention:** One email can only register once per event.
- [x] **Ticket Page:** Generates a unique ticket code and a scannable QR code.
- [x] **Ticket Lookup:** Attendees can find their ticket using their Ticket Code + Email.
- [x] **Staff Sign-in:** Secure JWT-based authentication protecting staff routes.
- [x] **Check-in Screen:** Staff can enter a ticket code to check someone in (Green: Success, Yellow: Already checked in, Red: Invalid).
- [x] **Attendee List:** Staff can view a table of attendees with search functionality and live totals.

## ⚠️ Known Limitations
*   Prisma 8 is currently in Release Candidate (RC). Due to changes in the query engine, some operations (like `.count()`) were bypassed in favor of fetching and filtering in memory to ensure stability.
*   Level 1 does not include camera scanning (manual code entry only).

## 🚀 Level 2 Progress (In Progress)
- [x] **Cancel a Registration:** Attendees can cancel their confirmed ticket from the Ticket Modal.
- [x] **Waitlist:** Full events allow attendees to join a waitlist. Staff can promote them via the Attendee List.
- [ ] **Staff Dashboard & CSV:** Overview of event stats and attendee list export.
- [ ] **Event Management:** Staff can create, edit, and close events.
- [ ] **Undo Check-in:** Staff can reverse a mistaken check-in.