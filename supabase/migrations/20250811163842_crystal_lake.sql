/*
  # Fix RLS infinite recursion

  1. Changes
    - Create a safe role checking function that avoids recursion
    - Update all admin policies to use the new function instead of direct profile queries
    - This breaks the circular dependency that was causing infinite recursion

  2. Security
    - Maintains the same security model but with proper recursion prevention
    - Admin users can still manage all resources as intended
*/

-- Create a function to safely check user roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Direct query to auth.users metadata to avoid recursion
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.user_id
    WHERE u.id = user_uuid 
    AND p.role::TEXT = role_name
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

-- Recreate policies using the safe function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all order items" ON public.order_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));