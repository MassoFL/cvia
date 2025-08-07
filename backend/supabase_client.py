from supabase import create_client, Client


# Updated Supabase configuration
SUPABASE_URL="https://uxusqvlpusscksejqbbn.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dXNxdmxwdXNzY2tzZWpxYmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTI2NTMsImV4cCI6MjA2OTU2ODY1M30.Uf4eO2YvfYTqDH5lH5r81rVsE4om9cq8YQYlkgO-rTI"
SUPABASE_BUCKET = "cvcv"              # CV storage bucket

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) 