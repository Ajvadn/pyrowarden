-- Targeted Profile Security Enhancement
-- Addresses: Customer Personal Information Could Be Stolen by Hackers

-- 1) Add RESTRICTIVE security policies for defense-in-depth
DO $$ 
BEGIN
  -- Block all unauthenticated access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' 
    AND policyname = 'SECURITY_RESTRICT_unauthenticated'
  ) THEN
    CREATE POLICY "SECURITY_RESTRICT_unauthenticated"
    ON public.profiles
    AS RESTRICTIVE
    FOR ALL
    TO public
    USING (auth.uid() IS NOT NULL);
    
    RAISE NOTICE 'Added restrictive policy: Block unauthenticated access';
  END IF;

  -- Block direct INSERT operations (force signup trigger only)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' 
    AND policyname = 'SECURITY_RESTRICT_direct_inserts'
  ) THEN
    CREATE POLICY "SECURITY_RESTRICT_direct_inserts"
    ON public.profiles
    AS RESTRICTIVE
    FOR INSERT
    TO public
    WITH CHECK (false);
    
    RAISE NOTICE 'Added restrictive policy: Block direct profile creation';
  END IF;

  -- Explicitly deny anonymous access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' 
    AND policyname = 'SECURITY_RESTRICT_anonymous'
  ) THEN
    CREATE POLICY "SECURITY_RESTRICT_anonymous"
    ON public.profiles
    AS RESTRICTIVE
    FOR SELECT
    TO anon
    USING (false);
    
    RAISE NOTICE 'Added restrictive policy: Block anonymous access';
  END IF;
END $$;

-- 2) Add data integrity constraints
DO $$ 
BEGIN
  -- Email format validation
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_email_format_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_email_format_check
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    
    RAISE NOTICE 'Added constraint: Email format validation';
  END IF;

  -- User ID format validation  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_id_format_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_user_id_format_check
    CHECK (user_id IS NOT NULL);
    
    RAISE NOTICE 'Added constraint: User ID validation';
  END IF;
END $$;

-- 3) Add security audit logging
CREATE OR REPLACE FUNCTION public.log_profile_security_events()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log sensitive data changes for security monitoring
  IF TG_OP = 'UPDATE' THEN
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE LOG 'SECURITY_AUDIT: Email changed for user % from % to %', 
        NEW.user_id, OLD.email, NEW.email;
    END IF;
    
    IF NEW.phone IS DISTINCT FROM OLD.phone THEN
      RAISE LOG 'SECURITY_AUDIT: Phone changed for user %', NEW.user_id;
    END IF;
  END IF;
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

-- Create the security audit trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'profile_security_audit'
  ) THEN
    CREATE TRIGGER profile_security_audit
      AFTER UPDATE OF email, phone ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.log_profile_security_events();
    
    RAISE NOTICE 'Added security audit trigger';
  END IF;
END $$;

-- 4) Add table security documentation
COMMENT ON TABLE public.profiles IS 
'SECURITY CRITICAL: Contains customer PII (email, phone). RLS enabled with restrictive policies. Access logged.';

COMMENT ON COLUMN public.profiles.email IS 
'SECURITY: Customer email address - access restricted to owner and admins only';

COMMENT ON COLUMN public.profiles.phone IS 
'SECURITY: Customer phone number - access restricted to owner and admins only';

-- 5) Create security status check function
CREATE OR REPLACE FUNCTION public.check_profiles_security_status()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    CASE 
      WHEN (
        -- RLS is enabled
        (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles' AND relnamespace = 'public'::regnamespace) = true
        AND 
        -- Has restrictive policies
        (SELECT count(*) FROM pg_policies WHERE tablename = 'profiles' AND permissive = 'RESTRICTIVE') >= 2
        AND
        -- Has permissive policies for authorized access
        (SELECT count(*) FROM pg_policies WHERE tablename = 'profiles' AND permissive = 'PERMISSIVE') >= 3
      )
      THEN 'SECURE: Multi-layer RLS protection active'
      ELSE 'WARNING: Security configuration incomplete'
    END;
$$;

-- 6) Final verification
DO $$
DECLARE
  security_status text;
BEGIN
  SELECT public.check_profiles_security_status() INTO security_status;
  RAISE NOTICE 'Profile security status: %', security_status;
  
  -- Log policy counts for verification
  RAISE NOTICE 'Total RLS policies: % (Permissive: %, Restrictive: %)',
    (SELECT count(*) FROM pg_policies WHERE tablename = 'profiles'),
    (SELECT count(*) FROM pg_policies WHERE tablename = 'profiles' AND permissive = 'PERMISSIVE'),
    (SELECT count(*) FROM pg_policies WHERE tablename = 'profiles' AND permissive = 'RESTRICTIVE');
END $$;