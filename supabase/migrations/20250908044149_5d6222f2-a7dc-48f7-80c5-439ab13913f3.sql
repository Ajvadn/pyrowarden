-- Grant admin role to specific emails and ensure future signups get admin automatically

-- 1) Ensure existing users with these emails are admins
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN (
  lower('pyrowardentechnologies@gmail.com'),
  lower('ajvadaju2003@gmail.com')
)
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Update signup trigger to auto-grant admin for these emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
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
