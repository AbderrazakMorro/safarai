-- =========================================================================
-- SAFARAI - USERS TABLE FIX
-- =========================================================================

-- 1. Add the missing INSERT policy so new users can create their profiles.
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. (Optional but recommended) Automatically create a public profile for any existing auth users who don't have one yet.
INSERT INTO public.users (id, email, first_name, last_name, password_hash)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'first_name', 'Traveler'), 
    COALESCE(raw_user_meta_data->>'last_name', ''),
    'supabase_auth'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);
