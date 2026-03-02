-- ============================================
-- JurnalAI - Supabase Database Migrations
-- Jalankan di Supabase SQL Editor
-- ============================================

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  display_name  TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  groq_api_key  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WHITELIST TABLE
CREATE TABLE public.whitelist (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  groq_api_key  TEXT,
  added_by      UUID REFERENCES public.profiles(id),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX whitelist_email_idx ON public.whitelist(email);

-- 3. USAGE_LOGS TABLE
CREATE TABLE public.usage_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  feature     TEXT NOT NULL CHECK (feature IN ('title', 'paraphrase', 'seo')),
  input_chars INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS: Auto-create profile on new signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profiles: Admin can view all
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Whitelist: Admin only
CREATE POLICY "Admins can manage whitelist"
  ON public.whitelist FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Whitelist: Authenticated users can check their own email (for callback)
CREATE POLICY "Authenticated users can check whitelist"
  ON public.whitelist FOR SELECT
  TO authenticated
  USING (true);

-- Usage logs: Users can view their own logs
CREATE POLICY "Users can view own usage logs"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs"
  ON public.usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usage logs: Admin can view all
CREATE POLICY "Admins can view all usage logs"
  ON public.usage_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- MANUAL SETUP: Insert admin
-- Ganti 'admin@gmail.com' dan 'gsk_...' dengan nilai asli
-- Jalankan SETELAH admin pertama login dan dicreate di profiles
-- ============================================

-- Step 1: Tambahkan admin ke whitelist terlebih dahulu
-- INSERT INTO public.whitelist (email, groq_api_key, notes)
-- VALUES ('admin@gmail.com', 'gsk_your_groq_api_key', 'Admin utama');

-- Step 2: Setelah admin login, set role admin
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@gmail.com';
