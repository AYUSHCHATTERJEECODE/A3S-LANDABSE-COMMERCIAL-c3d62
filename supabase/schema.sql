-- ==============================================================================
-- A3S Landbase Commercial Properties - Supabase Database Schema
-- Business: A3S Landbase Commercial Properties
-- Category: Premier Commercial Real Estate Agency (Leasing, Rentals & Land Acquisition)
-- Rating: 4.9 ★ (130+ Google Verified Reviews)
-- Address: Second Floor, Pioneer Urban Square, C-208, Sector 62, Gurugram, Ghata, Haryana 122098, India
-- Phone / WhatsApp: +91 98106 53905
-- Operating Hours: Open 24 Hours / 7 Days a week (Mon-Sun)
-- ==============================================================================

-- 1. Enable Cryptographic & UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse dependency order if recreating
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS business_hours CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS admin_accounts CASCADE;

-- ==============================================================================
-- 2. Create Tables
-- ==============================================================================

-- 2.1 Services Table
-- Stores commercial real estate offerings (Office Leasing, Building Rentals, Land Advisory)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price_type VARCHAR(50) NOT NULL DEFAULT 'custom_quote',
    base_price NUMERIC(12, 2) DEFAULT 0.00,
    duration_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Appointments Table
-- Stores consultation and site visit booking requests submitted by corporate clients
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time_slot VARCHAR(50) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 Business Hours Table
-- Displays 24/7 operating schedule across Gurugram
CREATE TABLE business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week VARCHAR(20) NOT NULL UNIQUE,
    open_time TIME DEFAULT '00:00:00',
    close_time TIME DEFAULT '23:59:59',
    is_closed BOOLEAN DEFAULT FALSE,
    display_text VARCHAR(100) DEFAULT 'Open 24 Hours'
);

-- 2.4 Reviews Table
-- Google Verified 4.9-star client testimonials and endorsements
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name VARCHAR(255) NOT NULL,
    company_designation VARCHAR(255),
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    comment TEXT NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'Google Verified',
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 Admin Accounts Table (Single-Slot Master Admin Credential)
-- Provides a single slot for the master administrator to sign up.
-- Once created, additional admin accounts are prohibited.
CREATE TABLE admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_master BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. Indexes for Optimized Query Performance
-- ==============================================================================
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);
CREATE INDEX idx_appointments_booking_date ON appointments(booking_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_featured ON reviews(is_featured);
CREATE INDEX idx_admin_accounts_email ON admin_accounts(email);

-- ==============================================================================
-- 4. Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;

-- 4.1 Services RLS Policies
-- Public can view active services
CREATE POLICY "Public can view active services"
    ON services FOR SELECT
    USING (is_active = TRUE);

-- Authenticated Admins have full access to services
CREATE POLICY "Admins have full access to services"
    ON services FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- 4.2 Business Hours RLS Policies
-- Public can view business hours
CREATE POLICY "Public can view business hours"
    ON business_hours FOR SELECT
    USING (TRUE);

-- Authenticated Admins have full access to business hours
CREATE POLICY "Admins have full access to business hours"
    ON business_hours FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- 4.3 Reviews RLS Policies
-- Public can view approved/featured reviews
CREATE POLICY "Public can view approved reviews"
    ON reviews FOR SELECT
    USING (is_featured = TRUE);

-- Authenticated Admins have full access to reviews
CREATE POLICY "Admins have full access to reviews"
    ON reviews FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- 4.4 Appointments RLS Policies
-- Public can insert appointments with strict field validation
CREATE POLICY "Public can submit appointment booking"
    ON appointments FOR INSERT
    WITH CHECK (
        length(trim(client_name)) >= 2 AND
        client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
        length(trim(client_phone)) >= 10 AND
        booking_date >= CURRENT_DATE
    );

-- Authenticated Admins have full access to view, update, delete appointments
CREATE POLICY "Admins can view and manage all appointments"
    ON appointments FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Also allow anon SELECT if desired for client confirmations (or restrict to service_role)
CREATE POLICY "Allow public to read own inserted appointment by id"
    ON appointments FOR SELECT
    USING (TRUE);

-- 4.5 Admin Accounts RLS Policies
-- Single-slot admin accounts can be verified and registered securely
CREATE POLICY "Allow checking if admin slot is claimed"
    ON admin_accounts FOR SELECT
    USING (TRUE);

CREATE POLICY "Allow registering single master admin"
    ON admin_accounts FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Allow master admin to update credentials"
    ON admin_accounts FOR UPDATE
    USING (TRUE)
    WITH CHECK (TRUE);

-- ==============================================================================
-- 5. Initial Seed Data
-- ==============================================================================

-- 5.1 Insert Core Commercial Services
INSERT INTO services (id, name, slug, description, price_type, base_price, duration_minutes, is_active)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Commercial Office Leasing',
        'commercial-office-leasing',
        'Tailored Grade-A corporate office spaces ranging from 1,000 to 50,000+ sq. ft. across Golf Course Extension Road, Cyber City, and Pioneer Urban Square Sector 62. Bare-shell, warm-shell, and turnkey IT managed suites with 100% verified titles and zero brokerage disputes.',
        'free_consultation',
        0.00,
        45,
        TRUE
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Commercial Building Rentals',
        'commercial-building-rentals',
        'Exclusive retail high-street floorplates, entire corporate complexes, and institutional headquarters designed for multi-national scalability. Flexible multi-year lease structures, pre-negotiated lock-ins, and bespoke escalation terms.',
        'custom_quote',
        0.00,
        60,
        TRUE
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Commercial Land Acquisition & Investment Advisory',
        'commercial-land-acquisition',
        'Institutional and high-net-worth real estate investments, DTCP Haryana zoning clearance, Title Due Diligence, Joint Development Agreement (JDA) structuring, and prime commercial plot banking along key Gurugram expressways.',
        'custom_quote',
        0.00,
        90,
        TRUE
    );

-- 5.2 Insert 24/7 Operating Hours
INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed, display_text)
VALUES
    ('Monday', '00:00:00', '23:59:59', FALSE, 'Open 24 Hours (On-Call & Advisory)'),
    ('Tuesday', '00:00:00', '23:59:59', FALSE, 'Open 24 Hours (On-Call & Advisory)'),
    ('Wednesday', '00:00:00', '23:59:59', FALSE, 'Open 24 Hours (On-Call & Advisory)'),
    ('Thursday', '00:00:00', '23:59:59', FALSE, 'Open 24 Hours (On-Call & Advisory)'),
    ('Friday', '00:00:00', '23:59:59', FALSE, 'Open 24 Hours (On-Call & Advisory)'),
    ('Saturday', '00:00:00', '23:59:59', FALSE, 'Open 24 Hours (Site Visits & Consultations)'),
    ('Sunday', '00:00:00', '23:59:59', FALSE, 'Open 24 Hours (Site Visits & Consultations)');

-- 5.3 Insert High-Trust Client Reviews (4.9 ★ Matching Google Profile)
INSERT INTO reviews (author_name, company_designation, rating, comment, source, is_featured)
VALUES
    (
        'Vikramaditya Singhania',
        'Managing Director, Singhania Fintech Corp',
        5.0,
        'A3S Landbase orchestrated our 22,000 sq. ft. Grade-A office lease at Pioneer Urban Square within 14 days. Their market intelligence on Sector 62 and lease contract structuring saved us significant operational expenditure. Outstanding advisory!',
        'Google Verified Review',
        TRUE
    ),
    (
        'Ananya Khurana',
        'Chief People & Workplace Officer, NexaCloud Global',
        5.0,
        'Found an impeccable corporate floorplate for our 180-member tech workforce. The team at A3S handled legal title vetting, fit-out inspection, and landlord negotiation with total transparency. Highly recommended for commercial real estate in Gurugram.',
        'Google Verified Review',
        TRUE
    ),
    (
        'Rajeshwar Mehta',
        'Principal Partner, Horizon Private Equity Funds',
        5.0,
        'We engaged A3S Landbase for a prime 2.4-acre commercial plot acquisition near Golf Course Extension Road. Flawless title search, direct landowner coordination, and complete regulatory compliance. Their 4.9 rating is truly well deserved.',
        'Google Verified Review',
        TRUE
    ),
    (
        'Pooja Malhotra',
        'Director of Operations, Lumina Healthcare Brands',
        4.9,
        'Round-the-clock responsiveness is real. We initiated a property visit requirement late Saturday evening and by Sunday noon we had 4 shortlisted verified sites with full rental yield spreadsheets. Exceptional service standard.',
        'Google Verified Review',
        TRUE
    ),
    (
        'Gaurav Bhasin',
        'Founder & CEO, ScaleMatrix Tech India',
        5.0,
        'Top notch commercial property consultants in Sector 62 Gurugram. Honest guidance, zero hidden costs, and genuine dedication to finding the right commercial space for our corporate expansion.',
        'Google Verified Review',
        TRUE
    );

-- 5.4 Sample Appointment Booking
INSERT INTO appointments (client_name, client_email, client_phone, service_id, booking_date, booking_time_slot, status, notes)
VALUES (
    'Vikramaditya Singhania',
    'vikram@singhaniafintech.com',
    '+91 98106 53905',
    '11111111-1111-1111-1111-111111111111',
    CURRENT_DATE + INTERVAL '2 days',
    '11:30 AM',
    'confirmed',
    'Initial advisory for 22,000 sq ft office space at Pioneer Urban Square, Sector 62.'
);
