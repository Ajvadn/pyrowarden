-- Make pyrowardentechnologies@gmail.com an admin
-- This script will add admin role to the specified user

-- First, let's check if the user exists
SELECT 'Checking if user exists...' as status;
SELECT id, email, created_at FROM auth.users WHERE email = 'pyrowardentechnologies@gmail.com';

-- Add admin role to the user
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'pyrowardentechnologies@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the admin role was added
SELECT 'Verifying admin role...' as status;
SELECT 
    u.email,
    ur.role,
    ur.created_at as role_created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'pyrowardentechnologies@gmail.com';

-- Show all admin users
SELECT 'All admin users:' as status;
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.created_at DESC;
