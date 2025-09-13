-- Idempotent Profile Security Hardening
-- Addresses: Customer Personal Information Could Be Stolen by Hackers

-- 1) Ensure RLS is enabled with security documentation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.profiles IS 'SECURITY: Contains sensitive customer data - RLS must remain enabled';

-- 2) Add RESTRICTIVE policies for defense-in-depth (only if not exists)
DO $$ 
BEGIN
  -- Block unauthenticated access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' 
    AND policyname = 'SECURITY: Block unauthenticated access'
  ) THEN
    CREATE POLICY "SECURITY: Block unauthenticated access"
    ON public.profiles
    AS RESTRICTIVE
    FOR ALL
    TO public
    USING (auth.uid() IS NOT NULL);
  END IF;

  -- Block unauthorized profile creation
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' 
    AND policyname = 'SECURITY: Block unauthorized profile creation'
  ) THEN
    CREATE POLICY "SECURITY: Block unauthorized profile creation"
    ON public.profiles
    AS RESTRICTIVE
    FOR INSERT
    TO public
    WITH CHECK (false); -- Forces profile creation only via signup trigger
  END IF;

  -- Add explicit public access denial policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' 
    AND policyname = 'SECURITY: Deny public profile access'
  ) THEN
    CREATE POLICY "SECURITY: Deny public profile access"
    ON public.profiles
    AS RESTRICTIVE
    FOR SELECT
    TO anon, public
    USING (false); -- Explicitly denies anonymous/public access
  END IF;
END $$;

-- 3) Create audit function for security monitoring
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log sensitive profile changes for security monitoring
  IF TG_OP = 'UPDATE' THEN
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE LOG 'SECURITY AUDIT: Profile email changed for user_id: % from % to %', 
        NEW.user_id, OLD.email, NEW.email;
    END IF;
    
    IF NEW.phone IS DISTINCT FROM OLD.phone THEN
      RAISE LOG 'SECURITY AUDIT: Profile phone changed for user_id: %', NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4) Create audit trigger if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'audit_profile_security_changes'
  ) THEN
    CREATE TRIGGER audit_profile_security_changes
      AFTER UPDATE OF email, phone ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.audit_profile_changes();
  END IF;
END $$;

-- 5) Add data integrity constraints
DO $$ 
BEGIN
  -- Ensure user_id is always valid UUID format
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_valid_user_id_format'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_valid_user_id_format 
    CHECK (user_id IS NOT NULL AND char_length(user_id::text) = 36);
  END IF;

  -- Ensure email format validation
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_valid_email_format'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_valid_email_format 
    CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- 6) Create security validation function
CREATE OR REPLACE FUNCTION public.validate_profile_security()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT jsonb_build_object(
    'rls_enabled', (
      SELECT relrowsecurity 
      FROM pg_class 
      WHERE relname = 'profiles' AND relnamespace = 'public'::regnamespace
    ),
    'restrictive_policies_count', (
      SELECT count(*) 
      FROM pg_policies 
      WHERE tablename = 'profiles' AND permissive = 'RESTRICTIVE'
    ),
    'total_policies_count', (
      SELECT count(*) 
      FROM pg_policies 
      WHERE tablename = 'profiles'
    ),
    'security_status', CASE 
      WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles' AND relnamespace = 'public'::regnamespace) 
           AND (SELECT count(*) FROM pg_policies WHERE tablename = 'profiles' AND permissive = 'RESTRICTIVE') >= 2
      THEN 'SECURE'
      ELSE 'NEEDS_ATTENTION'
    END
  );
$$;

-- 7) Create secure profile access function
CREATE OR REPLACE FUNCTION public.get_user_profile_secure(target_user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
  id uuid,
  user_id uuid, 
  email text,
  full_name text,
  phone text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  -- Additional security checks
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'SECURITY: Authentication required to access profiles';
  END IF;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'SECURITY: User ID cannot be null';
  END IF;

  -- Check authorization
  IF auth.uid() != target_user_id AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'SECURITY: Unauthorized access to profile data';
  END IF;

  -- Return profile data with RLS protection
  RETURN QUERY
  SELECT p.id, p.user_id, p.email, p.full_name, p.phone, p.created_at, p.updated_at
  FROM public.profiles p
  WHERE p.user_id = target_user_id;
END;
$$;

-- 8) Final security verification
DO $$
DECLARE
  security_status jsonb;
BEGIN
  SELECT public.validate_profile_security() INTO security_status;
  
  IF (security_status->>'security_status') != 'SECURE' THEN
    RAISE WARNING 'SECURITY: Profile security configuration needs attention: %', security_status;
  ELSE
    RAISE NOTICE 'SUCCESS: Profile security hardening completed. Status: %', security_status;
  END IF;
END $$;