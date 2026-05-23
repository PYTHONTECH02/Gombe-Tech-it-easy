-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  GOMBE ICT CLUB — Full Database Setup                           ║
-- ║  Paste this entire script into your Supabase SQL Editor         ║
-- ║  Dashboard → SQL Editor → New query → paste → Run              ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- ─── Helper: check if calling user is admin/super_admin ───────────
-- SECURITY DEFINER bypasses RLS so there's no recursive loop
CREATE OR REPLACE FUNCTION public.is_club_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role IN ('admin', 'super_admin')
       FROM public.profiles
      WHERE id = auth.uid()),
    false
  );
$$;

-- ─── 1. profiles ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text,
  full_name   text,
  role        text NOT NULL DEFAULT 'student'
                CHECK (role IN ('student', 'admin', 'super_admin')),
  avatar_url  text,
  bio         text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Any signed-in user can read all profiles (needed for member list)
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users insert only their own row
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users update their own row; admins can update any row
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_club_admin());

-- Users delete their own row
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
CREATE POLICY "profiles_delete" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- ─── 2. announcements ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  body        text NOT NULL,
  tag         text NOT NULL DEFAULT 'INFO',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "announcements_select" ON public.announcements;
CREATE POLICY "announcements_select" ON public.announcements
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "announcements_insert" ON public.announcements;
CREATE POLICY "announcements_insert" ON public.announcements
  FOR INSERT WITH CHECK (public.is_club_admin());

DROP POLICY IF EXISTS "announcements_delete" ON public.announcements;
CREATE POLICY "announcements_delete" ON public.announcements
  FOR DELETE USING (public.is_club_admin());

-- ─── 3. gaming_sessions ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gaming_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  console     text NOT NULL CHECK (console IN ('ps4', 'ps5')),
  title       text NOT NULL,
  day         text NOT NULL,
  month       text NOT NULL,
  year        text,
  time        text NOT NULL,
  venue       text,
  game_type   text,
  slots       integer,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.gaming_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gaming_sessions_select" ON public.gaming_sessions;
CREATE POLICY "gaming_sessions_select" ON public.gaming_sessions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "gaming_sessions_insert" ON public.gaming_sessions;
CREATE POLICY "gaming_sessions_insert" ON public.gaming_sessions
  FOR INSERT WITH CHECK (public.is_club_admin());

DROP POLICY IF EXISTS "gaming_sessions_delete" ON public.gaming_sessions;
CREATE POLICY "gaming_sessions_delete" ON public.gaming_sessions
  FOR DELETE USING (public.is_club_admin());

-- ─── 4. schedules ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.schedules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  date        date NOT NULL,
  time        text NOT NULL,
  location    text,
  description text,
  type        text DEFAULT 'meeting',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "schedules_select" ON public.schedules;
CREATE POLICY "schedules_select" ON public.schedules
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "schedules_insert" ON public.schedules;
CREATE POLICY "schedules_insert" ON public.schedules
  FOR INSERT WITH CHECK (public.is_club_admin());

DROP POLICY IF EXISTS "schedules_delete" ON public.schedules;
CREATE POLICY "schedules_delete" ON public.schedules
  FOR DELETE USING (public.is_club_admin());

-- ─── 5. officers (Members / Leadership page) ─────────────────────
CREATE TABLE IF NOT EXISTS public.officers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  role_title  text NOT NULL,
  class_year  text,
  bio         text,
  skills      text[],
  color       text DEFAULT '#FFE500',
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "officers_select" ON public.officers;
CREATE POLICY "officers_select" ON public.officers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "officers_insert" ON public.officers;
CREATE POLICY "officers_insert" ON public.officers
  FOR INSERT WITH CHECK (public.is_club_admin());

DROP POLICY IF EXISTS "officers_update" ON public.officers;
CREATE POLICY "officers_update" ON public.officers
  FOR UPDATE USING (public.is_club_admin());

DROP POLICY IF EXISTS "officers_delete" ON public.officers;
CREATE POLICY "officers_delete" ON public.officers
  FOR DELETE USING (public.is_club_admin());

-- ─── 6. coding_progress ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coding_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    text NOT NULL,
  completed    boolean DEFAULT true,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.coding_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coding_progress_own" ON public.coding_progress;
CREATE POLICY "coding_progress_own" ON public.coding_progress
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── 7. coding_exam_scores ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coding_exam_scores (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id  text NOT NULL,
  score      integer NOT NULL,
  total      integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.coding_exam_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coding_scores_own" ON public.coding_exam_scores;
CREATE POLICY "coding_scores_own" ON public.coding_exam_scores
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── 8. cyber_progress ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cyber_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    text NOT NULL,
  completed    boolean DEFAULT true,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.cyber_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cyber_progress_own" ON public.cyber_progress;
CREATE POLICY "cyber_progress_own" ON public.cyber_progress
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── 9. cyber_exam_scores ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cyber_exam_scores (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id  text NOT NULL,
  score      integer NOT NULL,
  total      integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cyber_exam_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cyber_scores_own" ON public.cyber_exam_scores;
CREATE POLICY "cyber_scores_own" ON public.cyber_exam_scores
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── 10. Auto-create profile on sign-up ──────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  v_role := CASE
    WHEN NEW.email = 'hpro453176@gmail.com' THEN 'super_admin'
    ELSE 'student'
  END;

  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE
    SET email      = EXCLUDED.email,
        full_name  = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Done! ────────────────────────────────────────────────────────
-- All tables, RLS policies, and the auto-profile trigger are ready.
