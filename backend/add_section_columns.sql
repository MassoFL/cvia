-- Add new columns to resume_structured_data table for parallel extraction
-- Run this script in your Supabase SQL editor

-- Add section column to identify which part of the resume this data represents
ALTER TABLE resume_structured_data 
ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'complete';

-- Add raw_agent_response column to store the raw response from Mistral agent
ALTER TABLE resume_structured_data 
ADD COLUMN IF NOT EXISTS raw_agent_response TEXT;

-- Create index for better performance when querying by section
CREATE INDEX IF NOT EXISTS idx_resume_structured_data_section 
ON resume_structured_data(section);

-- Create index for better performance when querying by ocr_result_id and section
CREATE INDEX IF NOT EXISTS idx_resume_structured_data_ocr_section 
ON resume_structured_data(ocr_result_id, section);

-- Update existing records to have 'complete' section
UPDATE resume_structured_data 
SET section = 'complete' 
WHERE section IS NULL;

-- Create a view for easy access to sectioned resume data
CREATE OR REPLACE VIEW resume_sectioned_data AS
SELECT 
    uf.id as file_id,
    uf.filename,
    uf.content_type,
    uf.created_at as upload_date,
    ocr.id as ocr_result_id,
    ocr.text as ocr_text,
    ocr.confidence as ocr_confidence,
    rsd.id as structured_data_id,
    rsd.section,
    rsd.data as structured_data,
    rsd.raw_agent_response,
    rsd.created_at as extraction_date
FROM uploaded_files uf
LEFT JOIN ocr_results ocr ON uf.id = ocr.file_id
LEFT JOIN resume_structured_data rsd ON ocr.id = rsd.ocr_result_id
ORDER BY uf.created_at DESC, rsd.section;

-- Create a function to get extraction status for a specific OCR result
CREATE OR REPLACE FUNCTION get_extraction_status(ocr_result_id_param BIGINT)
RETURNS TABLE(
    ocr_result_id BIGINT,
    overall_status TEXT,
    completed_sections TEXT[],
    total_sections INTEGER,
    sections_status JSONB
) AS $$
DECLARE
    completed_sections_array TEXT[];
    sections_status_json JSONB;
BEGIN
    -- Get completed sections
    SELECT ARRAY_AGG(section) INTO completed_sections_array
    FROM resume_structured_data 
    WHERE ocr_result_id = ocr_result_id_param;
    
    -- Create sections status JSON
    SELECT jsonb_build_object(
        'personal_information', jsonb_build_object(
            'status', CASE WHEN 'personal_information' = ANY(completed_sections_array) THEN 'completed' ELSE 'processing' END,
            'available', 'personal_information' = ANY(completed_sections_array)
        ),
        'resume_details', jsonb_build_object(
            'status', CASE WHEN 'resume_details' = ANY(completed_sections_array) THEN 'completed' ELSE 'processing' END,
            'available', 'resume_details' = ANY(completed_sections_array)
        )
    ) INTO sections_status_json;
    
    -- Determine overall status
    RETURN QUERY
    SELECT 
        ocr_result_id_param,
        CASE 
            WHEN array_length(completed_sections_array, 1) = 2 THEN 'completed'
            WHEN array_length(completed_sections_array, 1) > 0 THEN 'partial'
            ELSE 'processing'
        END as overall_status,
        COALESCE(completed_sections_array, ARRAY[]::TEXT[]) as completed_sections,
        2 as total_sections,
        sections_status_json as sections_status;
END;
$$ LANGUAGE plpgsql; 