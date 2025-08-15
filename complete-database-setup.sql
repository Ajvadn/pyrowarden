-- Complete Database Setup for Pyrowarden
-- This script creates all necessary tables and sets up the database properly

-- ========================================
-- STEP 1: Create Enums
-- ========================================

-- Create user role enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'user');
        RAISE NOTICE 'User role enum created';
    ELSE
        RAISE NOTICE 'User role enum already exists';
    END IF;
END $$;

-- Create app role enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
        RAISE NOTICE 'App role enum created';
    ELSE
        RAISE NOTICE 'App role enum already exists';
    END IF;
END $$;

-- Create product status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
        CREATE TYPE public.product_status AS ENUM ('active', 'inactive', 'out_of_stock');
        RAISE NOTICE 'Product status enum created';
    ELSE
        RAISE NOTICE 'Product status enum already exists';
    END IF;
END $$;

-- Create order status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
        RAISE NOTICE 'Order status enum created';
    ELSE
        RAISE NOTICE 'Order status enum already exists';
    END IF;
END $$;

-- Create internship status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'internship_status') THEN
        CREATE TYPE public.internship_status AS ENUM ('open', 'closed', 'in_progress', 'completed');
        RAISE NOTICE 'Internship status enum created';
    ELSE
        RAISE NOTICE 'Internship status enum already exists';
    END IF;
END $$;

-- ========================================
-- STEP 2: Create Profiles Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    address JSONB,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ========================================
-- STEP 3: Create Products Table
-- ========================================

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
    status product_status DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- ========================================
-- STEP 4: Create Orders Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- ========================================
-- STEP 5: Create Order Items Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for order items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ========================================
-- STEP 6: Create Cart Items Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Create indexes for cart items
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- ========================================
-- STEP 7: Create Wishlist Items Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Create indexes for wishlist items
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON public.wishlist_items(product_id);

-- ========================================
-- STEP 8: Create User Roles Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Create indexes for user roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- ========================================
-- STEP 9: Create Internships Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.internships (
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

-- Create indexes for internships
CREATE INDEX IF NOT EXISTS idx_internships_status ON public.internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_department ON public.internships(department);
CREATE INDEX IF NOT EXISTS idx_internships_type ON public.internships(type);

-- ========================================
-- STEP 10: Create Internship Applications Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.internship_applications (
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

-- Create indexes for internship applications
CREATE INDEX IF NOT EXISTS idx_internship_applications_internship_id ON public.internship_applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_internship_applications_user_id ON public.internship_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_internship_applications_status ON public.internship_applications(status);

-- ========================================
-- STEP 11: Enable Row Level Security
-- ========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 12: Create RLS Policies
-- ========================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Products policies
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage all products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Orders policies
DROP POLICY IF EXISTS "Users can manage own orders" ON public.orders;
CREATE POLICY "Users can manage own orders" ON public.orders
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Order items policies
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_items.order_id 
            AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
CREATE POLICY "Admins can manage all order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Cart items policies
DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
CREATE POLICY "Users can manage own cart items" ON public.cart_items
    FOR ALL USING (auth.uid() = user_id);

-- Wishlist items policies
DROP POLICY IF EXISTS "Users can manage own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can manage own wishlist items" ON public.wishlist_items
    FOR ALL USING (auth.uid() = user_id);

-- User roles policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
CREATE POLICY "Admins can manage all user roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Internships policies
DROP POLICY IF EXISTS "Anyone can view open internships" ON public.internships;
CREATE POLICY "Anyone can view open internships" ON public.internships
    FOR SELECT USING (status = 'open');

DROP POLICY IF EXISTS "Admins can manage all internships" ON public.internships;
CREATE POLICY "Admins can manage all internships" ON public.internships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Internship applications policies
DROP POLICY IF EXISTS "Users can manage own applications" ON public.internship_applications;
CREATE POLICY "Users can manage own applications" ON public.internship_applications
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all applications" ON public.internship_applications;
CREATE POLICY "Admins can manage all applications" ON public.internship_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- ========================================
-- STEP 13: Create Functions
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
BEGIN
    LOOP
        order_num := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
        IF NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = order_num) THEN
            RETURN order_num;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to assign admin role
CREATE OR REPLACE FUNCTION public.assign_admin_by_email(_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'::app_role
    FROM auth.users
    WHERE email = _email
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS app_role[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT role
        FROM public.user_roles
        WHERE user_id = _user_id
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- STEP 14: Create Triggers
-- ========================================

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
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
-- STEP 15: Add Sample Data
-- ========================================

-- Clear existing sample data
DELETE FROM public.products WHERE sku LIKE 'ESP32-%' OR sku LIKE 'USB-%' OR sku LIKE 'RFID-%';
DELETE FROM public.internships WHERE title LIKE '%Cybersecurity%' OR title LIKE '%ESP32%' OR title LIKE '%IoT%';

-- Add sample products
INSERT INTO public.products (name, description, price, compare_price, sku, stock_quantity, category, tags, status, featured, images) VALUES
(
  'ESP32 WiFi Deauthentication Tool',
  'Preprogrammed ESP32 microcontroller designed for WiFi security testing and deauthentication attacks. Perfect for penetration testing, security research, and educational purposes.',
  89.99,
  129.99,
  'ESP32-WIFI-DEAUTH-001',
  15,
  'Microcontrollers',
  ARRAY['ESP32', 'WiFi', 'Deauthentication', 'Security', 'Penetration Testing'],
  'active',
  true,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'USB Rubber Ducky - Advanced Edition',
  'Professional USB Rubber Ducky with custom payloads for penetration testing. Preloaded with cybersecurity scripts for Windows, Linux, and macOS systems.',
  149.99,
  199.99,
  'USB-RUBBER-DUCKY-ADV-001',
  8,
  'USB Tools',
  ARRAY['USB', 'Rubber Ducky', 'Penetration Testing', 'Payload', 'HID Attack'],
  'active',
  true,
  ARRAY['/assets/usb-rubber-ducky.webp']
),
(
  'RFID Cloning Kit - Pro',
  'Complete RFID cloning and testing kit with preprogrammed Arduino Nano. Includes multiple RFID cards, reader/writer, and custom firmware.',
  179.99,
  249.99,
  'RFID-CLONING-KIT-PRO-001',
  12,
  'RFID Tools',
  ARRAY['RFID', 'Cloning', 'Arduino', 'Nano', 'Preprogrammed'],
  'active',
  false,
  ARRAY['/assets/rfid-tool.webp']
);

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
);

-- ========================================
-- STEP 16: Verification
-- ========================================

-- Show all tables and their row counts
SELECT 'PROFILES' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'PRODUCTS' as table_name, COUNT(*) as count FROM public.products
UNION ALL
SELECT 'ORDERS' as table_name, COUNT(*) as count FROM public.orders
UNION ALL
SELECT 'CART_ITEMS' as table_name, COUNT(*) as count FROM public.cart_items
UNION ALL
SELECT 'WISHLIST_ITEMS' as table_name, COUNT(*) as count FROM public.wishlist_items
UNION ALL
SELECT 'USER_ROLES' as table_name, COUNT(*) as count FROM public.user_roles
UNION ALL
SELECT 'INTERNSHIPS' as table_name, COUNT(*) as count FROM public.internships
UNION ALL
SELECT 'INTERNSHIP_APPLICATIONS' as table_name, COUNT(*) as count FROM public.internship_applications;

-- Show sample data
SELECT 'Sample Products:' as info;
SELECT name, category, price, stock_quantity FROM public.products ORDER BY created_at DESC LIMIT 3;

SELECT 'Sample Internships:' as info;
SELECT title, department, type, status FROM public.internships ORDER BY created_at DESC LIMIT 3;
