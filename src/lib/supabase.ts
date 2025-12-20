import { createClient } from '@supabase/supabase-js'

// Masukkan URL Supabase kamu (yang https://...supabase.co)
const supabaseUrl = 'https://mlywpfcalretnnklvhlb.supabase.co'

// PASTE ANON KEY (yang depannya eyJ...) DI BAWAH INI:
const supabaseKey = 'sb_publishable_xZvsbYg3LSKxb3t45a5D2Q_GfGvNeeX'

export const supabase = createClient(supabaseUrl, supabaseKey)