import { createClient } from '@supabase/supabase-js'

// Masukkan URL Supabase kamu (yang https://...supabase.co)
const supabaseUrl = 'https://mlywpfcalretnnklvhlb.supabase.co'

// PASTE ANON KEY (yang depannya eyJ...) DI BAWAH INI:
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seXdwZmNhbHJldG5ua2x2aGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTU3MjQsImV4cCI6MjA4MTY5MTcyNH0.ri9BNsStqy0I3Yb55wGTxhlx_77e9YR7MHOS2OaHtiE'

export const supabase = createClient(supabaseUrl, supabaseKey)