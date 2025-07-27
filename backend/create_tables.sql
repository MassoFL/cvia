-- CVIA Database Schema
-- Run this script in your Supabase SQL editor to create all necessary tables

-- 1. Table for uploaded files
CREATE TABLE IF NOT EXISTS uploaded_files (
    id BIGSERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table for OCR results
CREATE TABLE IF NOT EXISTS ocr_results (
    id BIGSERIAL PRIMARY KEY,
    file_id BIGINT REFERENCES uploaded_files(id) ON DELETE CASCADE,
    ocr_engine TEXT NOT NULL DEFAULT 'mistral',
    text TEXT NOT NULL,
    confidence FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table for structured resume data
CREATE TABLE IF NOT EXISTS resume_structured_data (
    id BIGSERIAL PRIMARY KEY,
    file_id BIGINT REFERENCES uploaded_files(id) ON DELETE CASCADE,
    ocr_result_id BIGINT REFERENCES ocr_results(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_uploaded_files_storage_path ON uploaded_files(storage_path);
CREATE INDEX IF NOT EXISTS idx_ocr_results_file_id ON ocr_results(file_id);
CREATE INDEX IF NOT EXISTS idx_resume_structured_data_file_id ON resume_structured_data(file_id);
CREATE INDEX IF NOT EXISTS idx_resume_structured_data_ocr_result_id ON resume_structured_data(ocr_result_id);

-- 5. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create triggers for updated_at
CREATE TRIGGER update_uploaded_files_updated_at 
    BEFORE UPDATE ON uploaded_files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ocr_results_updated_at 
    BEFORE UPDATE ON ocr_results 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_structured_data_updated_at 
    BEFORE UPDATE ON resume_structured_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Enable Row Level Security (RLS) - optional for now
-- ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ocr_results ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE resume_structured_data ENABLE ROW LEVEL SECURITY;

-- 8. Create a view for easy access to complete resume data
CREATE OR REPLACE VIEW resume_complete_data AS
SELECT 
    uf.id as file_id,
    uf.filename,
    uf.content_type,
    uf.created_at as upload_date,
    ocr.id as ocr_result_id,
    ocr.text as ocr_text,
    ocr.confidence as ocr_confidence,
    rsd.id as structured_data_id,
    rsd.data as structured_data,
    rsd.created_at as extraction_date
FROM uploaded_files uf
LEFT JOIN ocr_results ocr ON uf.id = ocr.file_id
LEFT JOIN resume_structured_data rsd ON ocr.id = rsd.ocr_result_id
ORDER BY uf.created_at DESC;

-- 9. Create a function to get resume statistics
CREATE OR REPLACE FUNCTION get_resume_stats()
RETURNS TABLE(
    total_files BIGINT,
    files_with_ocr BIGINT,
    files_with_extraction BIGINT,
    avg_ocr_confidence FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(uf.id) as total_files,
        COUNT(ocr.id) as files_with_ocr,
        COUNT(rsd.id) as files_with_extraction,
        AVG(ocr.confidence) as avg_ocr_confidence
    FROM uploaded_files uf
    LEFT JOIN ocr_results ocr ON uf.id = ocr.file_id
    LEFT JOIN resume_structured_data rsd ON ocr.id = rsd.ocr_result_id;
END;
$$ LANGUAGE plpgsql; 