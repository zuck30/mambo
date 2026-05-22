-- ENUMS
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE swipe_direction AS ENUM ('like', 'pass', 'superlike');
CREATE TYPE gender_option AS ENUM ('male', 'female', 'non-binary');
CREATE TYPE show_gender_pref AS ENUM ('men', 'women', 'everyone');

-- PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  birthday DATE,
  gender gender_option,
  show_gender show_gender_pref DEFAULT 'everyone',
  bio TEXT,
  job TEXT,
  school TEXT,
  phone_number TEXT UNIQUE,
  interests TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  latitude FLOAT8,
  longitude FLOAT8,
  location_name TEXT,
  passport_latitude FLOAT8,
  passport_longitude FLOAT8,
  passport_location_name TEXT,
  relationship_goal TEXT,
  smart_photos_enabled BOOLEAN DEFAULT false,
  min_age_pref INT DEFAULT 18,
  max_age_pref INT DEFAULT 55,
  distance_pref INT DEFAULT 80,
  swipes_remaining INT DEFAULT 100,
  super_likes_remaining INT DEFAULT 1,
  boost_until TIMESTAMPTZ,
  role user_role DEFAULT 'user',
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SWIPES
CREATE TABLE swipes (
  id BIGSERIAL PRIMARY KEY,
  swiper_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  direction swipe_direction NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

-- MATCHES
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- REPORTS
CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by authenticated"
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Swipes: Users can only see their own swipes
CREATE POLICY "Users can see their own swipes"
ON swipes FOR SELECT TO authenticated USING (auth.uid() = swiper_id);

CREATE POLICY "Users can insert their own swipes"
ON swipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = swiper_id);

CREATE POLICY "Users can update their own swipes"
ON swipes FOR UPDATE TO authenticated USING (auth.uid() = swiper_id);

CREATE POLICY "Users can delete their own swipes"
ON swipes FOR DELETE TO authenticated USING (auth.uid() = swiper_id);

-- Matches: Users can see matches they are part of
CREATE POLICY "Users can see their own matches"
ON matches FOR SELECT TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create matches"
ON matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their own matches"
ON matches FOR UPDATE TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can delete their own matches"
ON matches FOR DELETE TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages: Users can see/send messages in their matches
CREATE POLICY "Users can see messages in their matches"
ON messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can update messages in their matches"
ON messages FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can delete messages in their matches"
ON messages FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their matches"
ON messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE matches, messages, profiles;

-- Storage Bucket setup (Note: This is usually done via API or Dashboard, but for documentation:)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
