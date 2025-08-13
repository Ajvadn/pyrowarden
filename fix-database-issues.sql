-- Comprehensive Database Fix for Products and Internships
-- This script fixes RLS policies and ensures all tables work properly

-- ========================================
-- STEP 1: Fix Products Table Issues
-- ========================================

-- First, let's check if products table exists and has the right structure
DO $$
BEGIN
    -- Create products table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        CREATE TABLE public.products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            compare_price DECIMAL(10,2),
            sku TEXT UNIQUE,
            stock_quantity INTEGER DEFAULT 0,
            images TEXT[] DEFAULT '{}',
            category TEXT,
            tags TEXT[] DEFAULT '{}',
            status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
            featured BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        
        -- Create indexes
        CREATE INDEX idx_products_status ON public.products(status);
        CREATE INDEX idx_products_category ON public.products(category);
        CREATE INDEX idx_products_featured ON public.products(featured);
        
        RAISE NOTICE 'Products table created successfully';
    ELSE
        RAISE NOTICE 'Products table already exists';
    END IF;
END $$;

-- ========================================
-- STEP 2: Fix Internships Table Issues
-- ========================================

-- Create internship status enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'internship_status') THEN
        CREATE TYPE public.internship_status AS ENUM ('open', 'closed', 'in_progress', 'completed');
        RAISE NOTICE 'Internship status enum created';
    ELSE
        RAISE NOTICE 'Internship status enum already exists';
    END IF;
END $$;

-- Create internships table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'internships') THEN
        CREATE TABLE public.internships (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT[] DEFAULT '{}',
            responsibilities TEXT[] DEFAULT '{}',
            duration TEXT NOT NULL,
            location TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('remote', 'onsite', 'hybrid')),
            department TEXT NOT NULL,
            salary_range TEXT,
            benefits TEXT[] DEFAULT '{}',
            status internship_status DEFAULT 'open',
            max_applications INTEGER,
            current_applications INTEGER DEFAULT 0,
            start_date DATE,
            end_date DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        
        -- Create indexes
        CREATE INDEX idx_internships_status ON public.internships(status);
        CREATE INDEX idx_internships_department ON public.internships(department);
        CREATE INDEX idx_internships_type ON public.internships(type);
        
        RAISE NOTICE 'Internships table created successfully';
    ELSE
        RAISE NOTICE 'Internships table already exists';
    END IF;
END $$;

-- Create internship applications table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'internship_applications') THEN
        CREATE TABLE public.internship_applications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE NOT NULL,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected')),
            cover_letter TEXT,
            resume_url TEXT,
            portfolio_url TEXT,
            github_url TEXT,
            linkedin_url TEXT,
            expected_graduation_date DATE,
            current_education TEXT,
            relevant_experience TEXT,
            skills TEXT[] DEFAULT '{}',
            availability_start DATE,
            availability_end DATE,
            notes TEXT,
            admin_notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            UNIQUE(internship_id, user_id)
        );
        
        -- Create indexes
        CREATE INDEX idx_internship_applications_internship_id ON public.internship_applications(internship_id);
        CREATE INDEX idx_internship_applications_user_id ON public.internship_applications(user_id);
        CREATE INDEX idx_internship_applications_status ON public.internship_applications(status);
        
        RAISE NOTICE 'Internship applications table created successfully';
    ELSE
        RAISE NOTICE 'Internship applications table already exists';
    END IF;
END $$;

-- ========================================
-- STEP 3: Fix RLS Policies
-- ========================================

-- Disable RLS temporarily to fix policies
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications DISABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view open internships" ON public.internships;
DROP POLICY IF EXISTS "Admins can manage all internships" ON public.internships;
DROP POLICY IF EXISTS "Users can manage their own applications" ON public.internship_applications;
DROP POLICY IF EXISTS "Admins can manage all applications" ON public.internship_applications;

-- Re-enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies for products
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage all products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create simple, working policies for internships
CREATE POLICY "Anyone can view open internships" ON public.internships
    FOR SELECT USING (status = 'open');

CREATE POLICY "Admins can manage all internships" ON public.internships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create policies for internship applications
CREATE POLICY "Users can manage their own applications" ON public.internship_applications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all applications" ON public.internship_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- ========================================
-- STEP 4: Add Sample Products
-- ========================================

-- Clear existing products to avoid duplicates
DELETE FROM public.products WHERE sku LIKE 'ESP32-%' OR sku LIKE 'USB-%' OR sku LIKE 'RFID-%';

-- Add cybersecurity products
INSERT INTO public.products (name, description, price, compare_price, sku, stock_quantity, category, tags, status, featured, images) VALUES
(
  'ESP32 WiFi Deauthentication Tool',
  'Preprogrammed ESP32 microcontroller designed for WiFi security testing and deauthentication attacks. Perfect for penetration testing, security research, and educational purposes. Includes custom firmware with advanced WiFi monitoring capabilities.',
  89.99,
  129.99,
  'ESP32-WIFI-DEAUTH-001',
  15,
  'Microcontrollers',
  ARRAY['ESP32', 'WiFi', 'Deauthentication', 'Security', 'Penetration Testing', 'Preprogrammed'],
  'active',
  true,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'USB Rubber Ducky - Advanced Edition',
  'Professional USB Rubber Ducky with custom payloads for penetration testing. Preloaded with cybersecurity scripts for Windows, Linux, and macOS systems. Includes stealth mode and advanced evasion techniques.',
  149.99,
  199.99,
  'USB-RUBBER-DUCKY-ADV-001',
  8,
  'USB Tools',
  ARRAY['USB', 'Rubber Ducky', 'Penetration Testing', 'Payload', 'HID Attack', 'Preprogrammed'],
  'active',
  true,
  ARRAY['/assets/usb-rubber-ducky.webp']
),
(
  'RFID Cloning Kit - Pro',
  'Complete RFID cloning and testing kit with preprogrammed Arduino Nano. Includes multiple RFID cards, reader/writer, and custom firmware for cloning various RFID protocols (125kHz, 13.56MHz).',
  179.99,
  249.99,
  'RFID-CLONING-KIT-PRO-001',
  12,
  'RFID Tools',
  ARRAY['RFID', 'Cloning', 'Arduino', 'Nano', 'Preprogrammed', 'Security Testing'],
  'active',
  false,
  ARRAY['/assets/rfid-tool.webp']
),
(
  'Bluetooth Security Tester',
  'ESP32-based Bluetooth security testing tool with preprogrammed firmware. Capable of Bluetooth scanning, device enumeration, and security assessment. Includes custom payloads for Bluetooth Low Energy testing.',
  119.99,
  159.99,
  'BT-SECURITY-TESTER-001',
  10,
  'Bluetooth Tools',
  ARRAY['Bluetooth', 'ESP32', 'Security Testing', 'BLE', 'Preprogrammed', 'Wireless'],
  'active',
  false,
  ARRAY['/assets/bluetooth-tester.webp']
),
(
  'Badge Flipper - Access Control Testing',
  'Professional badge cloning and access control testing device. Preprogrammed with custom firmware for various card formats including HID, Indala, and other proximity card systems.',
  199.99,
  279.99,
  'BADGE-FLIPPER-PRO-001',
  6,
  'Access Control',
  ARRAY['Badge', 'Cloning', 'Access Control', 'HID', 'Indala', 'Preprogrammed'],
  'active',
  true,
  ARRAY['/assets/badge-flipper.webp']
),
(
  'WiFi Pineapple - Nano',
  'Compact WiFi security testing platform with preloaded penetration testing tools. Features WiFi deauthentication, packet injection, and network monitoring capabilities. Perfect for security professionals and researchers.',
  299.99,
  399.99,
  'WIFI-PINEAPPLE-NANO-001',
  5,
  'WiFi Tools',
  ARRAY['WiFi', 'Pineapple', 'Penetration Testing', 'Deauthentication', 'Network Security'],
  'active',
  true,
  ARRAY['/assets/wifi-testing-device.webp']
),
(
  'Arduino Pro Mini - Security Bundle',
  'Arduino Pro Mini with preprogrammed security testing firmware. Includes multiple payloads for USB attacks, keyboard injection, and device enumeration. Comes with development board and programming cable.',
  79.99,
  109.99,
  'ARDUINO-PRO-MINI-SEC-001',
  20,
  'Microcontrollers',
  ARRAY['Arduino', 'Pro Mini', 'Security', 'USB Attack', 'Preprogrammed', 'HID'],
  'active',
  false,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'Raspberry Pi Zero - Security Edition',
  'Raspberry Pi Zero W with custom security testing OS and preloaded tools. Includes WiFi monitoring, network scanning, and penetration testing software. Perfect for learning and professional security testing.',
  89.99,
  129.99,
  'RPI-ZERO-SEC-001',
  15,
  'Single Board Computers',
  ARRAY['Raspberry Pi', 'Zero W', 'Security', 'WiFi', 'Penetration Testing', 'Preloaded'],
  'active',
  false,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'NFC Testing Kit - Professional',
  'Complete NFC testing and cloning kit with preprogrammed Arduino. Supports NFC-A, NFC-B, and NFC-F protocols. Includes multiple NFC tags and comprehensive testing software.',
  159.99,
  219.99,
  'NFC-TESTING-KIT-PRO-001',
  8,
  'NFC Tools',
  ARRAY['NFC', 'Cloning', 'Testing', 'Arduino', 'Preprogrammed', 'Contactless'],
  'active',
  false,
  ARRAY['/assets/rfid-tool.webp']
),
(
  'Hardware Security Toolkit - Complete',
  'Comprehensive hardware security testing toolkit including ESP32, Arduino Nano, RFID tools, and various connectors. All devices come preprogrammed with security testing firmware and payloads.',
  449.99,
  599.99,
  'HW-SECURITY-TOOLKIT-001',
  3,
  'Toolkits',
  ARRAY['Toolkit', 'Hardware', 'Security', 'Complete', 'Preprogrammed', 'Professional'],
  'active',
  true,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'WiFi Deauthentication Module - DIY Kit',
  'DIY kit for building WiFi deauthentication tools. Includes ESP32 board, OLED display, buttons, and custom PCB. Preprogrammed firmware with user-friendly interface for WiFi security testing.',
  69.99,
  99.99,
  'WIFI-DEAUTH-DIY-001',
  25,
  'DIY Kits',
  ARRAY['DIY', 'WiFi', 'Deauthentication', 'ESP32', 'Kit', 'Preprogrammed'],
  'active',
  false,
  ARRAY['/assets/wifi-testing-device.webp']
),
(
  'Keylogger - Educational Kit',
  'Educational keylogger kit for learning about keyboard security. Includes Arduino Leonardo with preprogrammed firmware and detailed documentation. For educational and security research purposes only.',
  49.99,
  79.99,
  'KEYLOGGER-EDU-001',
  30,
  'Educational',
  ARRAY['Keylogger', 'Educational', 'Arduino', 'Leonardo', 'Preprogrammed', 'Security'],
  'active',
  false,
  ARRAY['/assets/hardware-toolkit.webp']
);

-- ========================================
-- STEP 5: Add Sample Internships
-- ========================================

-- Clear existing internships to avoid duplicates
DELETE FROM public.internships WHERE title LIKE '%Cybersecurity%' OR title LIKE '%ESP32%' OR title LIKE '%IoT%';

-- Add sample internships
INSERT INTO public.internships (title, description, requirements, responsibilities, duration, location, type, department, salary_range, benefits, status, max_applications) VALUES
(
  'Cybersecurity Penetration Testing Intern',
  'Learn ethical hacking and penetration testing techniques. Work on real-world security assessments and develop offensive security skills.',
  ARRAY['Basic networking knowledge', 'Linux command line', 'Python programming', 'Analytical skills'],
  ARRAY['Security assessments', 'Network penetration testing', 'Documentation', 'Tool usage'],
  '3 months',
  'Hybrid',
  'hybrid',
  'Cybersecurity',
  '$18-25/hour',
  ARRAY['Hands-on experience', 'Mentorship', 'Certification opportunities', 'Flexible hours'],
  'open',
  5
),
(
  'ESP32 WiFi Security Research Intern',
  'Develop ESP32-based WiFi deauthentication tools and research wireless security vulnerabilities.',
  ARRAY['C/C++ programming', 'WiFi protocols', 'ESP32/Arduino experience', 'Electronics knowledge'],
  ARRAY['ESP32 development', 'WiFi security research', 'Tool creation', 'Documentation'],
  '4 months',
  'On-site',
  'onsite',
  'Hardware Security',
  '$20-28/hour',
  ARRAY['Hardware experience', 'Security tools', 'Professional networking', 'Open-source contribution'],
  'open',
  3
),
(
  'IoT Security Assessment Intern',
  'Focus on IoT device security assessment and vulnerability research for smart devices.',
  ARRAY['Embedded systems', 'IoT protocols', 'Reverse engineering', 'Network security'],
  ARRAY['IoT security assessment', 'Firmware analysis', 'Vulnerability testing', 'Tool development'],
  '3 months',
  'Remote',
  'remote',
  'IoT Security',
  '$16-22/hour',
  ARRAY['IoT device experience', 'Firmware analysis', 'Remote work', 'Industry networking'],
  'open',
  4
),
(
  'Hardware Security Tool Development Intern',
  'Develop hardware security tools including WiFi deauthentication devices, RFID cloning tools, and other penetration testing hardware.',
  ARRAY['PCB design software', 'Embedded programming', 'Wireless protocols', 'Electronics skills'],
  ARRAY['Hardware design', 'Microcontroller programming', 'Security tool creation', 'Testing and validation'],
  '6 months',
  'On-site',
  'onsite',
  'Hardware Development',
  '$22-30/hour',
  ARRAY['Hardware development experience', 'Professional tools access', 'Advanced programming', 'Commercial product contribution'],
  'open',
  2
),
(
  'Wireless Security Research Intern',
  'Focus on wireless security research including WiFi, Bluetooth, Zigbee, and RFID security.',
  ARRAY['Wireless protocols', 'Security tools', 'RF concepts', 'Programming skills'],
  ARRAY['Wireless security research', 'Tool development', 'Security testing', 'Documentation'],
  '4 months',
  'Hybrid',
  'hybrid',
  'Wireless Security',
  '$18-25/hour',
  ARRAY['Wireless security experience', 'RF equipment access', 'Advanced techniques', 'Research publications'],
  'open',
  4
);

-- ========================================
-- STEP 6: Create Updated At Triggers
-- ========================================

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_internships_updated_at ON public.internships;
CREATE TRIGGER update_internships_updated_at
  BEFORE UPDATE ON public.internships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_internship_applications_updated_at ON public.internship_applications;
CREATE TRIGGER update_internship_applications_updated_at
  BEFORE UPDATE ON public.internship_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- STEP 7: Verification Queries
-- ========================================

-- Show all products
SELECT 'PRODUCTS' as table_name, COUNT(*) as count FROM public.products
UNION ALL
SELECT 'INTERNSHIPS' as table_name, COUNT(*) as count FROM public.internships
UNION ALL
SELECT 'INTERNSHIP_APPLICATIONS' as table_name, COUNT(*) as count FROM public.internship_applications;

-- Show sample products
SELECT name, category, price, stock_quantity, featured FROM public.products ORDER BY created_at DESC LIMIT 5;

-- Show sample internships
SELECT title, department, type, status FROM public.internships ORDER BY created_at DESC LIMIT 5;
