from supabase import create_client, Client


SUPABASE_URL="https://podcmpxfilnuwbrkvrbx.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZGNtcHhmaWxudXdicmt2cmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDk4OTMsImV4cCI6MjA2Nzk4NTg5M30.bMy5agUCrdxoCA9g3C_U17aT9-JwfK1f56Z3iNtp1zY"
   # Replace with your Supabase anon or service role key
SUPABASE_BUCKET = "ttttt"             # Replace with your actual bucket name

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) 