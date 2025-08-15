-- Final Database Fix - Complete RLS Policy Reset
-- This script completely fixes all RLS recursion issues

-- ========================================
-- STEP 1: Disable ALL RLS temporarily
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
-- STEP 2: Drop ALL existing policies
-- ========================================

-- Drop all policies from all tables
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for now" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Allow all for now" ON public.products;

DROP POLICY IF EXISTS "Users can manage own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all for now" ON public.orders;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow all for now" ON public.order_items;

DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Allow all for now" ON public.cart_items;

DROP POLICY IF EXISTS "Users can manage own wishlist items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Allow all for now" ON public.wishlist_items;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow all for now" ON public.user_roles;

DROP POLICY IF EXISTS "Anyone can view open internships" ON public.internships;
DROP POLICY IF EXISTS "Admins can manage all internships" ON public.internships;
DROP POLICY IF EXISTS "Allow all for now" ON public.internships;

DROP POLICY IF EXISTS "Users can manage own applications" ON public.internship_applications;
DROP POLICY IF EXISTS "Admins can manage all applications" ON public.internship_applications;
DROP POLICY IF EXISTS "Allow all for now" ON public.internship_applications;

-- ========================================
-- STEP 3: Create tables if they don't exist
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

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
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

-- Create orders table
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

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Create internships table
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

-- Create internship_applications table
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
-- STEP 4: Create simple, non-recursive policies
-- ========================================

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- Create simple policies that don't cause recursion
CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_policy" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "user_roles_select_policy" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "user_roles_insert_policy" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "user_roles_update_policy" ON public.user_roles FOR UPDATE USING (true);
CREATE POLICY "user_roles_delete_policy" ON public.user_roles FOR DELETE USING (true);

CREATE POLICY "products_select_policy" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert_policy" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_policy" ON public.products FOR UPDATE USING (true);
CREATE POLICY "products_delete_policy" ON public.products FOR DELETE USING (true);

CREATE POLICY "orders_select_policy" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_insert_policy" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update_policy" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "cart_items_select_policy" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "cart_items_insert_policy" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "cart_items_update_policy" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "cart_items_delete_policy" ON public.cart_items FOR DELETE USING (true);

CREATE POLICY "wishlist_items_select_policy" ON public.wishlist_items FOR SELECT USING (true);
CREATE POLICY "wishlist_items_insert_policy" ON public.wishlist_items FOR INSERT WITH CHECK (true);
CREATE POLICY "wishlist_items_delete_policy" ON public.wishlist_items FOR DELETE USING (true);

CREATE POLICY "internships_select_policy" ON public.internships FOR SELECT USING (true);
CREATE POLICY "internships_insert_policy" ON public.internships FOR INSERT WITH CHECK (true);
CREATE POLICY "internships_update_policy" ON public.internships FOR UPDATE USING (true);
CREATE POLICY "internships_delete_policy" ON public.internships FOR DELETE USING (true);

CREATE POLICY "internship_applications_select_policy" ON public.internship_applications FOR SELECT USING (true);
CREATE POLICY "internship_applications_insert_policy" ON public.internship_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "internship_applications_update_policy" ON public.internship_applications FOR UPDATE USING (true);

-- ========================================
-- STEP 5: Create or replace functions
-- ========================================

-- Function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT role
        FROM public.user_roles
        WHERE user_id = _user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign admin role
CREATE OR REPLACE FUNCTION public.assign_admin_by_email(_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'
    FROM auth.users
    WHERE email = _email
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 6: Add sample data
-- ========================================

-- Clear existing sample data
DELETE FROM public.products WHERE sku LIKE 'ESP32-%' OR sku LIKE 'USB-%' OR sku LIKE 'RFID-%';
DELETE FROM public.internships WHERE title LIKE '%Cybersecurity%' OR title LIKE '%ESP32%';

-- Add sample products
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

-- Add sample internships
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
-- STEP 7: Verification
-- ========================================

-- Show table counts
SELECT 'PROFILES' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'PRODUCTS' as table_name, COUNT(*) as count FROM public.products
UNION ALL
SELECT 'USER_ROLES' as table_name, COUNT(*) as count FROM public.user_roles
UNION ALL
SELECT 'INTERNSHIPS' as table_name, COUNT(*) as count FROM public.internships;

-- Test functions
SELECT 'Function Test: has_role' as test, public.has_role('00000000-0000-0000-0000-000000000000', 'admin') as result
UNION ALL
SELECT 'Function Test: get_user_roles' as test, array_length(public.get_user_roles('00000000-0000-0000-0000-000000000000'), 1) as result;
