# Supabase RLS Fixes for Oa App

The 403 (Forbidden) errors you are seeing in the console when swiping are likely due to Row Level Security (RLS) policies in Supabase. Specifically, the 'swipes' table and 'matches' table need proper permissions for the 'upsert' and 'delete' operations.

Please run the following SQL in your Supabase SQL Editor to fix these issues:

```sql
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
```

### Why this is needed:
- **403 Error:** Usually happens when an `INSERT` or `UPDATE` (upsert) violates an RLS `WITH CHECK` clause or there is no policy allowing the action.
- **checkMatch Failure:** The `checkMatch` function needs to see if the *other* user has liked *you*. If you don't have a policy allowing you to `SELECT` swipes where `swiped_id = auth.uid()`, this check will always return empty, and you will never get matches.
- **Rewind Failure:** Needs the `DELETE` policy on the `swipes` table.
