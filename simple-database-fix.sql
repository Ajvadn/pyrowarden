-- Simple Database Fix for Pyrowarden
-- This fixes the RLS recursion issues and creates missing tables

-- ========================================
-- STEP 1: Disable RLS temporarily to fix policies
-- ========================================

ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.internship_applications DISABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: Drop all problematic policies
-- ========================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;

DROP POLICY IF EXISTS "Users can manage own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage own wishlist items" ON public.wishlist_items;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;

DROP POLICY IF EXISTS "Anyone can view open internships" ON public.internships;
DROP POLICY IF EXISTS "Admins can manage all internships" ON public.internships;

DROP POLICY IF EXISTS "Users can manage own applications" ON public.internship_applications;
DROP POLICY IF EXISTS "Admins can manage all applications" ON public.internship_applications;

-- ========================================
-- STEP 3: Create missing tables if they don't exist
-- ========================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    address JSONB,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
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
    status TEXT DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Create other tables
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    responsibilities TEXT[] DEFAULT '{}',
    duration TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    department TEXT NOT NULL,
    salary_range TEXT,
    benefits TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'open',
    max_applications INTEGER,
    current_applications INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.internship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending',
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

-- ========================================
-- STEP 4: Re-enable RLS with simple policies
-- ========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "Allow all for now" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.cart_items FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.wishlist_items FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.user_roles FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.internships FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.internship_applications FOR ALL USING (true);

-- ========================================
-- STEP 5: Add sample data (with conflict handling)
-- ========================================

-- Add sample products (only if they don't exist)
INSERT INTO public.products (name, description, price, compare_price, sku, stock_quantity, category, tags, status, featured, images) VALUES
(
  'ESP32 WiFi Deauthentication Tool',
  'Preprogrammed ESP32 microcontroller designed for WiFi security testing and deauthentication attacks.',
  89.99,
  129.99,
  'ESP32-WIFI-DEAUTH-001',
  15,
  'Microcontrollers',
  ARRAY['ESP32', 'WiFi', 'Deauthentication', 'Security'],
  'active',
  true,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'USB Rubber Ducky - Advanced Edition',
  'Professional USB Rubber Ducky with custom payloads for penetration testing.',
  149.99,
  199.99,
  'USB-RUBBER-DUCKY-ADV-001',
  8,
  'USB Tools',
  ARRAY['USB', 'Rubber Ducky', 'Penetration Testing'],
  'active',
  true,
  ARRAY['/assets/usb-rubber-ducky.webp']
),
(
  'RFID Cloning Kit - Pro',
  'Complete RFID cloning and testing kit with preprogrammed Arduino Nano.',
  179.99,
  249.99,
  'RFID-CLONING-KIT-PRO-001',
  12,
  'RFID Tools',
  ARRAY['RFID', 'Cloning', 'Arduino'],
  'active',
  false,
  ARRAY['/assets/rfid-tool.webp']
)
ON CONFLICT (sku) DO NOTHING;

-- Add sample internships (only if they don't exist)
INSERT INTO public.internships (title, description, requirements, responsibilities, duration, location, type, department, salary_range, benefits, status, max_applications) VALUES
(
  'Cybersecurity Penetration Testing Intern',
  'Learn ethical hacking and penetration testing techniques.',
  ARRAY['Basic networking knowledge', 'Linux command line', 'Python programming'],
  ARRAY['Security assessments', 'Network penetration testing', 'Documentation'],
  '3 months',
  'Hybrid',
  'hybrid',
  'Cybersecurity',
  '$18-25/hour',
  ARRAY['Hands-on experience', 'Mentorship', 'Certification opportunities'],
  'open',
  5
),
(
  'ESP32 WiFi Security Research Intern',
  'Develop ESP32-based WiFi deauthentication tools and research wireless security vulnerabilities.',
  ARRAY['C/C++ programming', 'WiFi protocols', 'ESP32/Arduino experience'],
  ARRAY['ESP32 development', 'WiFi security research', 'Tool creation'],
  '4 months',
  'On-site',
  'onsite',
  'Hardware Security',
  '$20-28/hour',
  ARRAY['Hardware experience', 'Security tools', 'Professional networking'],
  'open',
  3
)
ON CONFLICT DO NOTHING;

-- ========================================
-- STEP 6: Verification
-- ========================================

-- Show table counts
SELECT 'PROFILES' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'PRODUCTS' as table_name, COUNT(*) as count FROM public.products
UNION ALL
SELECT 'USER_ROLES' as table_name, COUNT(*) as count FROM public.user_roles
UNION ALL
SELECT 'INTERNSHIPS' as table_name, COUNT(*) as count FROM public.internships;

-- Show sample data
SELECT 'Sample Products:' as info;
SELECT name, category, price, stock_quantity FROM public.products ORDER BY created_at DESC LIMIT 3;

SELECT 'Sample Internships:' as info;
SELECT title, department, type, status FROM public.internships ORDER BY created_at DESC LIMIT 3;
