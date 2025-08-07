-- Update users table to support social authentication
-- Run this SQL in your Supabase SQL editor

-- Add columns for social authentication
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS social_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS social_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS social_data JSONB DEFAULT '{}';

-- Create index on social_provider and social_id
CREATE INDEX IF NOT EXISTS idx_users_social_provider ON users(social_provider);
CREATE INDEX IF NOT EXISTS idx_users_social_id ON users(social_id);

-- Allow password_hash to be nullable for social users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Update the users table to handle social authentication
-- Make password_hash optional for social login users
UPDATE users SET password_hash = '' WHERE password_hash IS NULL;