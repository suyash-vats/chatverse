-- Drop existing policies
DROP POLICY IF EXISTS "Members can see who's in their rooms" ON room_members;
DROP POLICY IF EXISTS "Users can delete their own membership" ON room_members;
DROP POLICY IF EXISTS "Users can insert their own membership" ON room_members;
DROP POLICY IF EXISTS "Users can join rooms" ON room_members;
DROP POLICY IF EXISTS "Users can update their own membership" ON room_members;
DROP POLICY IF EXISTS "Users can view room memberships they belong to" ON room_members;

-- Enable RLS
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- Simplified policies
-- Allow room creators to add members
CREATE POLICY "Room creators can add members" ON room_members
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_rooms
    WHERE chat_rooms.id = room_members.room_id
    AND chat_rooms.created_by = auth.uid()
  )
);

-- Allow users to join rooms
CREATE POLICY "Users can join rooms" ON room_members
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow users to view members in their rooms
CREATE POLICY "Users can view members" ON room_members
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM room_members rm
    WHERE rm.room_id = room_members.room_id
    AND rm.user_id = auth.uid()
  )
);

-- Allow users to delete their own memberships
CREATE POLICY "Users can delete memberships" ON room_members
FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Allow users to update their own memberships
CREATE POLICY "Users can update memberships" ON room_members
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- First, drop existing policies on chat_rooms
DROP POLICY IF EXISTS "Enable read access for all users" ON chat_rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON chat_rooms;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON chat_rooms;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON chat_rooms;
DROP POLICY IF EXISTS "Room creators can see their rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Anyone can see public rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Room members can see their private rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Room creators can update their rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Room creators can delete their rooms" ON chat_rooms;

-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

-- Policy for seeing rooms by code (for joining)
CREATE POLICY "Anyone can see rooms by code"
ON chat_rooms FOR SELECT
USING (true);

-- Policy for room members to see their rooms
CREATE POLICY "Room members can see their rooms"
ON chat_rooms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM room_members
    WHERE room_members.room_id = chat_rooms.id
    AND room_members.user_id = auth.uid()
  )
);

-- Policy for creating rooms
CREATE POLICY "Authenticated users can create rooms"
ON chat_rooms FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating rooms (only by creator)
CREATE POLICY "Room creators can update their rooms"
ON chat_rooms FOR UPDATE
USING (auth.uid() = created_by);

-- Policy for deleting rooms (only by creator)
CREATE POLICY "Room creators can delete their rooms"
ON chat_rooms FOR DELETE
USING (auth.uid() = created_by); 