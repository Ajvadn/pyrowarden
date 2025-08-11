/*
  # Fix admin policies for management pages

  1. Changes
    - Update RLS policies to allow admins to manage all data properly
    - Add policies for admin operations on profiles table
    - Ensure admins can view and modify all necessary data

  2. Security
    - Maintains security while allowing proper admin access
    - Uses the existing has_role function to check admin permissions
*/

-- Add missing admin policies for profiles table
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for products table (INSERT and DELETE)
CREATE POLICY "Admins can create products" ON public.products
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for orders table (INSERT and DELETE)
CREATE POLICY "Admins can create orders" ON public.orders
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for order_items table (INSERT and UPDATE)
CREATE POLICY "Admins can create order items" ON public.order_items
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update order items" ON public.order_items
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete order items" ON public.order_items
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));