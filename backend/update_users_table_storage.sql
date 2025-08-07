-- Update user_cvs table to support PDF storage
-- Run this SQL in your Supabase SQL editor

-- Add new columns for file storage
ALTER TABLE user_cvs 
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0;

-- Create index on file_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_cvs_file_url ON user_cvs(file_url);

-- Update the table comment
COMMENT ON TABLE user_cvs IS 'Stores user CV/resume files and their extracted data';
COMMENT ON COLUMN user_cvs.file_path IS 'Storage path in Supabase bucket';
COMMENT ON COLUMN user_cvs.file_url IS 'Public URL for accessing the file';
COMMENT ON COLUMN user_cvs.file_size IS 'File size in bytes';
COMMENT ON COLUMN user_cvs.structured_data IS 'JSON data extracted from the CV';
COMMENT ON COLUMN user_cvs.raw_text IS 'Raw text extracted from the CV';
COMMENT ON COLUMN user_cvs.status IS 'Processing status: uploaded, processing, processed, failed';

-- Create a function to clean up old files (optional)
CREATE OR REPLACE FUNCTION cleanup_old_cvs()
RETURNS void AS $$
BEGIN
    -- This function can be used to clean up old CV files
    -- Implementation depends on your retention policy
    RAISE NOTICE 'Cleanup function called - implement retention policy as needed';
END;
$$ LANGUAGE plpgsql;

-- Create storage policies for the bucket (run these in Supabase dashboard if needed)
-- These policies ensure users can only access their own files

-- Policy for SELECT (viewing files)
-- CREATE POLICY "Users can view their own CV files" ON storage.objects
-- FOR SELECT USING (bucket_id = 'ttttt' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Policy for INSERT (uploading files)  
-- CREATE POLICY "Users can upload their own CV files" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'ttttt' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Policy for DELETE (deleting files)
-- CREATE POLICY "Users can delete their own CV files" ON storage.objects  
-- FOR DELETE USING (bucket_id = 'ttttt' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Note: The above policies assume you're using Supabase Auth
-- Since you're using custom JWT auth, you may need to adjust these policies
-- or handle access control in your application code