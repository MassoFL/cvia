# 📄 Resume PDF Storage System

## 🎯 Overview

The CVIA Resume Storage System automatically stores uploaded PDF resumes in Supabase storage while processing them for data extraction. This ensures that users can access their original files later and provides a complete audit trail of processed documents.

## 🏗️ Architecture

### Storage Flow
1. **User uploads PDF** → CV extraction endpoint
2. **PDF is processed** → Text extraction + AI analysis  
3. **PDF is stored** → Supabase storage bucket
4. **Database record created** → Links user to stored file
5. **Response includes** → Extraction results + storage info

### Components

#### Backend Files
- `resume_storage.py` - Core storage logic and database operations
- `resume_endpoints.py` - REST API endpoints for resume management
- `working_extraction_endpoint.py` - Enhanced with storage integration
- `update_users_table_storage.sql` - Database schema updates

#### Database Schema
- `user_cvs` table - Stores resume metadata and extracted data
- File storage in Supabase bucket with organized folder structure

## 🚀 Features

### ✅ Implemented Features

#### **Automatic Storage**
- PDF files automatically stored during extraction process
- Works for both authenticated and anonymous users (with different behavior)
- Organized folder structure: `resumes/{user_id}/{unique_filename}`

#### **File Management**
- Upload validation (file type, size limits)
- Unique filename generation to prevent conflicts
- Public URL generation for file access
- Signed URL generation for secure downloads

#### **Database Integration**
- Complete resume metadata storage
- Links between users and their uploaded files
- Structured data and raw text storage
- Processing status tracking

#### **REST API Endpoints**
- `GET /api/v1/resumes` - List user's resumes
- `GET /api/v1/resumes/{id}` - Get specific resume
- `GET /api/v1/resumes/{id}/download` - Get download URL
- `GET /api/v1/resumes/{id}/download-direct` - Direct download redirect
- `PUT /api/v1/resumes/{id}` - Update resume data
- `DELETE /api/v1/resumes/{id}` - Delete resume and file
- `GET /api/v1/storage/stats` - User storage statistics

#### **Security Features**
- User-based access control (users can only access their own files)
- JWT authentication required for storage operations
- Signed URLs with configurable expiration
- File validation and sanitization

## 📊 Database Schema

### Updated `user_cvs` Table
```sql
CREATE TABLE user_cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cv_name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path TEXT,                    -- Storage path in bucket
    file_url TEXT,                     -- Public URL (NEW)
    file_size BIGINT DEFAULT 0,        -- File size in bytes (NEW)
    structured_data JSONB,
    raw_text TEXT,
    status VARCHAR(50) DEFAULT 'processed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Setup Instructions

### 1. Database Setup

Run the schema update in your Supabase SQL editor:

```bash
# Execute the contents of backend/update_users_table_storage.sql
```

### 2. Supabase Storage Bucket

Ensure your Supabase bucket is properly configured:

1. **Bucket exists**: `cvss` (CV storage bucket)
2. **Public access**: Enabled for file downloads
3. **Storage policies**: Set up for user access control (optional)

### 3. Backend Dependencies

All required dependencies are already in `requirements.txt`:
- `supabase==2.0.2` for storage operations
- `fastapi` for API endpoints
- `PyJWT` for authentication

### 4. Test the Implementation

```bash
cd backend
python test_resume_storage.py
```

## 📝 API Usage Examples

### Upload and Store Resume

```bash
# Upload PDF with authentication
curl -X POST "http://localhost:8000/api/v1/extract_structured_data_working" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@resume.pdf"

# Response includes storage information
{
  "message": "Structured data extraction completed successfully",
  "filename": "resume.pdf",
  "structured_data": {...},
  "resume_stored": true,
  "resume_id": "uuid-here",
  "file_url": "https://...supabase.co/storage/v1/object/public/...",
  "storage_info": {
    "id": "uuid-here",
    "cv_name": "resume",
    "file_size": 245760,
    "created_at": "2025-01-31T..."
  }
}
```

### List User's Resumes

```bash
curl -X GET "http://localhost:8000/api/v1/resumes" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response
{
  "resumes": [
    {
      "id": "uuid-here",
      "cv_name": "resume",
      "original_filename": "resume.pdf",
      "file_url": "https://...",
      "file_size": 245760,
      "status": "processed",
      "created_at": "2025-01-31T..."
    }
  ],
  "total_count": 1,
  "limit": 10,
  "offset": 0
}
```

### Get Download URL

```bash
curl -X GET "http://localhost:8000/api/v1/resumes/{resume_id}/download" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response
{
  "download_url": "https://...supabase.co/storage/v1/object/sign/...",
  "expires_in": 3600,
  "message": "Download URL generated successfully"
}
```

### Get Storage Statistics

```bash
curl -X GET "http://localhost:8000/api/v1/storage/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response
{
  "user_id": "uuid-here",
  "total_files": 5,
  "total_size_bytes": 1228800,
  "total_size_mb": 1.17,
  "total_size_gb": 0.0011,
  "status_breakdown": {
    "processed": 4,
    "uploaded": 1
  },
  "average_file_size_mb": 0.23
}
```

## 🔒 Security Considerations

### Access Control
- **User Isolation**: Users can only access their own files
- **JWT Authentication**: Required for all storage operations
- **Signed URLs**: Temporary access with configurable expiration

### File Validation
- **File Type**: Only PDF files accepted
- **File Size**: Maximum 10MB limit
- **Filename Sanitization**: Unique names prevent conflicts

### Storage Security
- **Organized Structure**: Files stored in user-specific folders
- **Public URLs**: Available but not easily guessable
- **Cleanup**: Failed uploads are automatically cleaned up

## 🎯 User Experience

### For Authenticated Users
1. **Upload PDF** → Automatic storage + processing
2. **View Resume List** → See all uploaded files
3. **Download Original** → Access stored PDF anytime
4. **Track Usage** → Storage statistics available

### For Anonymous Users
- **Processing Only** → PDF is processed but not stored
- **Temporary Access** → Results available in response only
- **No Persistence** → Files are not saved

## 📈 Storage Statistics

The system tracks comprehensive storage metrics:

- **File Count**: Total number of stored resumes
- **Storage Usage**: Total size in bytes/MB/GB
- **Status Breakdown**: Files by processing status
- **Average File Size**: Helps with capacity planning

## 🔄 File Lifecycle

### Upload Process
1. **Validation** → File type and size checks
2. **Processing** → Text extraction and AI analysis
3. **Storage** → Upload to Supabase bucket
4. **Database** → Create record with metadata
5. **Response** → Return results with storage info

### Access Process
1. **Authentication** → Verify user identity
2. **Authorization** → Check file ownership
3. **URL Generation** → Create signed download URL
4. **Download** → User accesses original file

### Deletion Process
1. **Authentication** → Verify user identity
2. **File Removal** → Delete from storage bucket
3. **Database Cleanup** → Remove database record
4. **Confirmation** → Return success status

## 🐛 Troubleshooting

### Common Issues

1. **"Resume not stored" message**
   - Check user authentication
   - Verify JWT token is valid
   - Ensure user has proper permissions

2. **Storage upload failures**
   - Check Supabase bucket configuration
   - Verify bucket permissions
   - Check file size limits

3. **Download URL errors**
   - Verify file exists in storage
   - Check URL expiration time
   - Ensure proper authentication

### Debug Mode

Enable detailed logging in `resume_storage.py`:
```python
logging.basicConfig(level=logging.DEBUG)
```

## 🚀 Future Enhancements

### Planned Features
- **File Versioning** - Keep multiple versions of updated resumes
- **Bulk Operations** - Upload/download multiple files
- **File Sharing** - Share resumes with specific users
- **Storage Quotas** - Per-user storage limits
- **File Compression** - Optimize storage usage
- **Metadata Search** - Search resumes by content
- **Backup System** - Automated backups to external storage

### Integration Opportunities
- **Email Notifications** - Notify users of successful uploads
- **Webhook Support** - Trigger external systems on file events
- **Analytics Dashboard** - Visual storage usage reports
- **API Rate Limiting** - Prevent abuse of storage endpoints

## 📊 Performance Metrics

The system is designed for optimal performance:

- **Upload Speed**: Parallel processing and storage
- **Storage Efficiency**: Organized folder structure
- **Query Performance**: Indexed database queries
- **Download Speed**: Direct Supabase CDN access

## 🤝 Contributing

When adding storage-related features:

1. **Update Tests** - Add test cases for new functionality
2. **Update Documentation** - Keep this README current
3. **Security Review** - Ensure proper access controls
4. **Performance Testing** - Verify scalability
5. **Error Handling** - Implement proper error responses

## 📄 License

This storage system is part of the CVIA project and follows the same MIT license terms.

---

**The Resume Storage System is now fully integrated and ready for production use!** 🎉