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
