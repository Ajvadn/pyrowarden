-- Admin functionality hardening: ensure required tables, policies, functions, and relationships exist
-- This migration is idempotent and safe to run multiple times

-- 1) Ensure helper function exists for roles used by UI (ManageUsers)
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(ARRAY(
    SELECT role::text FROM public.user_roles WHERE user_id = _user_id
  ), '{}');
$$;

-- 2) Ensure order_items table exists (used by ManageOrders)
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for order_items if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Users can view their own order items'
  ) THEN
    CREATE POLICY "Users can view their own order items"
    ON public.order_items
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
          AND o.user_id = auth.uid()
      ) OR has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Admins can manage all order items'
  ) THEN
    CREATE POLICY "Admins can manage all order items"
    ON public.order_items
    FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- 3) Ensure internships and internship_applications tables exist (used by ManageInternships)
CREATE TABLE IF NOT EXISTS public.internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  responsibilities text[] DEFAULT '{}',
  duration text NOT NULL,
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('remote','onsite','hybrid')),
  department text NOT NULL,
  salary_range text,
  benefits text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','in_progress','completed')),
  max_applications integer,
  current_applications integer DEFAULT 0,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.internship_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id uuid NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','withdrawn')),
  cover_letter text,
  resume_url text,
  portfolio_url text,
  github_url text,
  linkedin_url text,
  expected_graduation_date date,
  current_education text,
  relevant_experience text,
  skills text[] DEFAULT '{}',
  availability_start date,
  availability_end date,
  notes text,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (internship_id, user_id)
);

-- Enable RLS
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- Policies for internships (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='internships' AND policyname='Anyone can view open internships'
  ) THEN
    CREATE POLICY "Anyone can view open internships"
    ON public.internships
    FOR SELECT
    USING (status = 'open' OR has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='internships' AND policyname='Admins can manage all internships'
  ) THEN
    CREATE POLICY "Admins can manage all internships"
    ON public.internships
    FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Policies for internship_applications (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='internship_applications' AND policyname='Users can view their own applications'
  ) THEN
    CREATE POLICY "Users can view their own applications"
    ON public.internship_applications
    FOR SELECT
    USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='internship_applications' AND policyname='Users can create their own applications'
  ) THEN
    CREATE POLICY "Users can create their own applications"
    ON public.internship_applications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='internship_applications' AND policyname='Users can update their own applications'
  ) THEN
    CREATE POLICY "Users can update their own applications"
    ON public.internship_applications
    FOR UPDATE
    USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='internship_applications' AND policyname='Admins can manage all applications'
  ) THEN
    CREATE POLICY "Admins can manage all applications"
    ON public.internship_applications
    FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- 4) Ensure updated_at triggers exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='update_internships_updated_at') THEN
    CREATE TRIGGER update_internships_updated_at
    BEFORE UPDATE ON public.internships
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='update_internship_applications_updated_at') THEN
    CREATE TRIGGER update_internship_applications_updated_at
    BEFORE UPDATE ON public.internship_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 5) Ensure profile creation trigger on auth.users exists for clean profile data
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'on_auth_user_created'
      AND c.relname = 'users'
      AND n.nspname = 'auth'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 6) Improve embeddings: ensure orders.user_id references profiles.user_id so PostgREST can embed profiles
-- Ensure profiles.user_id is unique
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_unique'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Ensure FK from orders.user_id -> profiles.user_id
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT orders_user_id_profiles_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;
  END IF;
END $$;