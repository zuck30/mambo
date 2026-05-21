-- 1. Fix Swipes Policies
-- Ensure users can insert, update, and delete their own swipes (needed for swiping and rewind)
DROP POLICY IF EXISTS "Users can insert their own swipes" ON swipes;
DROP POLICY IF EXISTS "Users can update their own swipes" ON swipes;
DROP POLICY IF EXISTS "Users can delete their own swipes" ON swipes;
DROP POLICY IF EXISTS "Users can see their own swipes" ON swipes;

CREATE POLICY "Users can manage their own swipes"
ON swipes FOR ALL
TO authenticated
USING (auth.uid() = swiper_id)
WITH CHECK (auth.uid() = swiper_id);

-- IMPORTANT: Allow users to SEE swipes where they are the recipient
-- This is necessary for the checkMatch logic to work!
CREATE POLICY "Users can see swipes received"
ON swipes FOR SELECT
TO authenticated
USING (auth.uid() = swiped_id);

-- 2. Fix Matches Policies
-- Ensure users can create and see matches they are part of
DROP POLICY IF EXISTS "Users can see their own matches" ON matches;
DROP POLICY IF EXISTS "Users can create matches" ON matches;
DROP POLICY IF EXISTS "Users can update their own matches" ON matches;

CREATE POLICY "Users can manage their own matches"
ON matches FOR ALL
TO authenticated
USING (auth.uid() = user1_id OR auth.uid() = user2_id)
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 3. Ensure profiles are readable for discovery
DROP POLICY IF EXISTS "Profiles are viewable by authenticated" ON profiles;
CREATE POLICY "Profiles are viewable by authenticated"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- 4. Messages Policies
-- Clean up existing policies to avoid name conflicts
DROP POLICY IF EXISTS "Users can update messages in their matches" ON messages;
DROP POLICY IF EXISTS "Users can delete messages in their matches" ON messages;
DROP POLICY IF EXISTS "Users can send messages in their matches" ON messages;

-- Re-apply the Update Policy
CREATE POLICY "Users can update messages in their matches"
ON messages FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Re-apply the Delete Policy
CREATE POLICY "Users can delete messages in their matches"
ON messages FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Re-apply the Insert (Send) Policy
CREATE POLICY "Users can send messages in their matches"
ON messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- 5. Profile Management (Onboarding & Updates)
-- Allow users to insert their own profile during onboarding
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Ensure the update policy covers the onboarding 'upsert'
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Discovery RPC Function
-- This function performs the complex discovery query on the server side for better performance and robustness.
CREATE OR REPLACE FUNCTION get_discovery_stack(
  p_user_id UUID,
  p_latitude FLOAT,
  p_longitude FLOAT,
  p_distance_pref INT,
  p_show_gender TEXT,
  p_min_age INT,
  p_max_age INT,
  p_user_gender TEXT
)
RETURNS SETOF profiles AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM profiles p
  WHERE p.id != p_user_id
    AND p.is_onboarded = true
    -- Exclude users already swiped
    AND NOT EXISTS (
      SELECT 1 FROM swipes s
      WHERE s.swiper_id = p_user_id AND s.swiped_id = p.id
    )
    -- Gender Filter (Bidirectional)
    AND (
      p_show_gender = 'everyone' OR
      p.gender = (CASE WHEN p_show_gender = 'men' THEN 'male' WHEN p_show_gender = 'women' THEN 'female' ELSE NULL END)
    )
    AND (
      p.show_gender = 'everyone' OR p.show_gender IS NULL OR
      p.show_gender = (CASE WHEN p_user_gender = 'male' THEN 'men' WHEN p_user_gender = 'female' THEN 'women' ELSE 'everyone' END)
    )
    -- Age Filter
    AND p.birthday >= (CURRENT_DATE - (p_max_age || ' years')::INTERVAL)
    AND p.birthday <= (CURRENT_DATE - (p_min_age || ' years')::INTERVAL)
    -- Distance Filter (Haversine Formula)
    AND (
      p_latitude IS NULL OR p_longitude IS NULL OR
      (6371 * acos(
        least(1.0,
          sin(radians(p_latitude)) * sin(radians(p.latitude)) +
          cos(radians(p_latitude)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(p.longitude))
        )
      )) <= p_distance_pref
    )
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
