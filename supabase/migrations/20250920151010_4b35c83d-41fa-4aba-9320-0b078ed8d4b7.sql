-- Security Enhancement Migration
-- Fixes identified security vulnerabilities in the database

-- 1. Fix HIGH PRIORITY: User Role Information Exposure
-- Add SELECT policies to user_roles table to prevent unauthorized role visibility

-- First, add a policy allowing users to view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add policy allowing admins to view all roles for management purposes
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix MEDIUM PRIORITY: Database Function Security
-- Update functions to include explicit search_path for security

-- Update the get_user_roles function to be more secure
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS text[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(ARRAY(
    SELECT role::text FROM public.user_roles WHERE user_id = _user_id
  ), '{}');
$$;

-- Update the has_role function to be more secure
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    );
$$;

-- Update generate_order_number function for consistency
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    new_number TEXT;
BEGIN
    SELECT 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((COUNT(*) + 1)::TEXT, 4, '0')
    INTO new_number
    FROM public.orders
    WHERE DATE(created_at) = DATE(NOW());
    
    RETURN new_number;
END;
$$;

-- Update update_updated_at_column function for consistency
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 3. Add security logging for sensitive operations
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    RAISE LOG 'SECURITY_AUDIT: Role % assigned to user %', NEW.role, NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    RAISE LOG 'SECURITY_AUDIT: Role % removed from user %', OLD.role, OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for role change logging
DROP TRIGGER IF EXISTS log_user_role_changes ON public.user_roles;
CREATE TRIGGER log_user_role_changes
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();

-- 4. Verification queries
SELECT 'Security fixes applied successfully!' as status;

-- Verify policies exist
SELECT 
  'Policies created:' as check_type,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'user_roles' AND cmd = 'SELECT';

-- Test role function security
SELECT 'Function security test:' as check_type,
       has_role(auth.uid(), 'admin'::app_role) as admin_check;