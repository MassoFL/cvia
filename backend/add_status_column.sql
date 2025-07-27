-- Add status columns to uploaded_files table if they don't exist
DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'uploaded_files' AND column_name = 'status') THEN
        ALTER TABLE uploaded_files ADD COLUMN status VARCHAR(50) DEFAULT 'uploaded';
    END IF;
    
    -- Add error_message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'uploaded_files' AND column_name = 'error_message') THEN
        ALTER TABLE uploaded_files ADD COLUMN error_message TEXT;
    END IF;
    
    -- Add uploaded_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'uploaded_files' AND column_name = 'uploaded_at') THEN
        ALTER TABLE uploaded_files ADD COLUMN uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Create index on status for faster queries
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_uploaded_files_status') THEN
        CREATE INDEX idx_uploaded_files_status ON uploaded_files(status);
    END IF;
    
END $$; 