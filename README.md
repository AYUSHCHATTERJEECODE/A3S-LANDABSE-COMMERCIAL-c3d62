# A3S Landbase Commercial Properties

> Premier Commercial Real Estate Advisory Platform for Gurugram (Golf Course Extension Road, Pioneer Urban Square Sector 62, Cyber City & High-Street Corridors).

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🌟 Overview & Key Features

- **Aesthetic**: Tailored **Creamy Green & Crisp White** luxury architectural visual identity.
- **Client Conversion Pipeline**:
  - **Hero Section**: 4.9★ Google rating badge (130+ reviews), dual commercial consultation CTAs.
  - **Commercial Offerings**: Office leasing (1,000–50,000+ sq. ft.), building rentals, and land acquisition advisory.
  - **Space & Lease Budget Estimator**: Interactive calculator computing estimated monthly lease rentals and Capex requirements with direct pre-fill into booking.
  - **Multi-Step Appointment Scheduler**: Step-by-step consultation booking with Zod validation, Supabase cloud sync, celebration confetti, and WhatsApp confirmation.
  - **Location & 24/7 Hours**: Pioneer Urban Square Sector 62 embedded map, hotline `+91 98106 53905`, and round-the-clock advisory schedule.
- **Exclusive Single-Slot Master Admin Portal**:
  - **Strictly in Footer**: All admin triggers are placed exclusively in the footer. Zero admin buttons on the header or navbar.
  - **Single Slot Guarantee**: Allows exactly **one** master administrator account to be created. Once claimed, public registration is permanently disabled.
  - **Bookings Dashboard**: Live search, status tabs (Pending, Confirmed, Completed, Cancelled), one-click status updates, WhatsApp direct client messaging, CSV export, and deletion.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Production build & TypeScript check
npm run build
```

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub (or use the GitHub CLI integration provided).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import this repository (**`A3S-LANDBASE-COMMERCIAL`**).
4. Set the Framework Preset to **Vite**.
5. Add the Environment Variables:
   - `VITE_SUPABASE_URL`: `https://iupobugldmikbejolkpm.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_Ux1vbMHJ4AvzbZlYmtxRZQ_lD72mL8O`
6. Click **Deploy**. Your application will be live at `https://your-project.vercel.app`!

---

## 🗄️ Supabase Schema Setup

Execute the script in `supabase/schema.sql` inside your [Supabase SQL Editor](https://supabase.com/dashboard/project/iupobugldmikbejolkpm/sql/new) to create:
- `appointments`: Real-time booking requests
- `admin_accounts`: Single-slot master admin credentials with SHA-256 hash storage
- `services`: Commercial leasing, rental, and land services
- `business_hours`: 24/7 advisory schedule
- `reviews`: Verified client endorsements

---

## 🏢 Business Information

- **Agency:** A3S Landbase Commercial Properties
- **Address:** Second Floor, Pioneer Urban Square, C-208, Sector 62, Gurugram, Ghata, Haryana 122098, India
- **Hotline / WhatsApp:** [+91 98106 53905](tel:+919810653905)
- **Schedule:** Open 24 Hours / 7 Days a week
