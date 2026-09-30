-- ==============================================================================
-- A3S Landbase Commercial Properties - Direct Appointments Table Schema
-- Target: Supabase SQL Editor
-- Includes support for Real-Time Booking & Admin Dashboard Operations
-- ==============================================================================

-- 1. Enable pgcrypto / uuid-ossp for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing table if recreating
DROP TABLE IF EXISTS appointments CASCADE;

-- 3. Create Appointments Table with Exact Requested Columns
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    service_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 5. Public INSERT Policy (Allows website visitors to submit bookings)
CREATE POLICY "Public users can insert appointments"
    ON appointments
    FOR INSERT
    TO public
    WITH CHECK (
        length(trim(customer_name)) > 1 AND
        length(trim(customer_phone)) >= 10 AND
        customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
        appointment_date >= CURRENT_DATE
    );

-- 6. Read Policy (Allows Admin Dashboard and authenticated staff to query all appointments)
CREATE POLICY "Allow reading appointments"
    ON appointments
    FOR SELECT
    USING (TRUE);

-- 7. Update Policy (Allows Admin Dashboard to update status in real-time)
CREATE POLICY "Allow updating appointment status"
    ON appointments
    FOR UPDATE
    USING (TRUE)
    WITH CHECK (TRUE);

-- 8. Delete Policy (Allows Admin Dashboard to delete appointments)
CREATE POLICY "Allow deleting appointments"
    ON appointments
    FOR DELETE
    USING (TRUE);

-- 9. High performance query indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON appointments(created_at DESC);

-- 10. Sample Seed Test Records
INSERT INTO appointments (customer_name, customer_phone, customer_email, service_name, appointment_date, appointment_time, status, notes)
VALUES 
(
    'Vikramaditya Singhania (MD, Singhania Fintech)',
    '+91 98106 53905',
    'vikram@singhaniafintech.com',
    'Commercial Office Leasing',
    CURRENT_DATE,
    '11:30 AM',
    'confirmed',
    'Final lease signing for 22,000 sq. ft. Grade-A office at Pioneer Urban Square'
),
(
    'Ananya Khurana (NexaCloud Global)',
    '+91 98112 44321',
    'ananya.k@nexacloud.io',
    'Commercial Building Rentals',
    CURRENT_DATE,
    '02:00 PM',
    'pending',
    'Looking for 15,000 sq. ft. floorplate with high-speed internet & HVAC fitouts'
),
(
    'Rajeshwar Mehta (Partner, Horizon PE)',
    '+91 98711 90876',
    'mehta@horizonpefunds.com',
    'Commercial Land Acquisition & Advisory',
    CURRENT_DATE + INTERVAL '2 days',
    '05:00 PM',
    'pending',
    'Advisory consultation for 2.4-acre DTCP commercial parcel on Golf Course Ext Road'
);
