-- Fix remaining function search path security issues
-- Update all remaining functions to include explicit search_path

-- Update audit_profile_access function
CREATE OR REPLACE FUNCTION public.audit_profile_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log profile access for security monitoring
  -- This can be enhanced with actual audit table if needed
  
  IF TG_OP = 'SELECT' AND NEW.email IS DISTINCT FROM OLD.email THEN
    -- Email changes should be logged
    RAISE LOG 'Profile email changed for user_id: %', NEW.user_id;
  END IF;
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

-- Update validate_profile_security function
CREATE OR REPLACE FUNCTION public.validate_profile_security()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- Check that RLS is enabled
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles' AND relnamespace = 'public'::regnamespace) AND
    -- Check that we have restrictive policies
    (SELECT count(*) > 0 FROM pg_policies WHERE tablename = 'profiles' AND permissive = 'RESTRICTIVE')
$$;

-- Update get_profile_safely function
CREATE OR REPLACE FUNCTION public.get_profile_safely(target_user_id uuid)
RETURNS TABLE(id uuid, user_id uuid, email text, full_name text, phone text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.id, p.user_id, p.email, p.full_name, p.phone, p.created_at, p.updated_at
  FROM public.profiles p
  WHERE p.user_id = target_user_id
    AND (
      -- User can access their own profile
      auth.uid() = target_user_id
      OR
      -- Admins can access any profile
      has_role(auth.uid(), 'admin'::app_role)
    )
    -- Additional security: ensure we have a valid session
    AND auth.uid() IS NOT NULL;
$$;

-- Update log_profile_security_events function
CREATE OR REPLACE FUNCTION public.log_profile_security_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Update check_profiles_security_status function
CREATE OR REPLACE FUNCTION public.check_profiles_security_status()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Base profile creation
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );

  -- Everyone gets 'user' role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Whitelisted emails also get 'admin' role
  IF lower(NEW.email) IN (
    lower('pyrowardentechnologies@gmail.com'),
    lower('ajvadaju2003@gmail.com')
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Verification
SELECT 'All function security paths updated successfully!' as status;