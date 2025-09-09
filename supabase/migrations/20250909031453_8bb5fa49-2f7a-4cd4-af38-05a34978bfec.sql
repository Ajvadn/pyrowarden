-- Secure profiles table access: restrict to profile owner and admins only

-- Ensure RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies if they exist
DROP POLICY IF EXISTS "Allow all access" ON public.profiles;

-- Ensure policy: Users can view their own profile  
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Ensure policy: Admins can view all profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Ensure policy: Users can update their own profile
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- NEW: Allow admins to update any profile (needed for admin panel)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can update all profiles'
  ) THEN
    CREATE POLICY "Admins can update all profiles"
    ON public.profiles
    FOR UPDATE
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- NEW: Allow admins to delete profiles (users cannot delete their own profiles directly)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can delete profiles'
  ) THEN
    CREATE POLICY "Admins can delete profiles"
    ON public.profiles
    FOR DELETE
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Profiles are created only via signup trigger (handle_new_user), no direct INSERT policy needed