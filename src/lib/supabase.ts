import { createClient } from '@supabase/supabase-js'

// --- CARA KASAR TAPI AMPUH 100% ---
// Langsung tempel Link & Key dari .env.local kamu di sini
// Jangan lupa pakai tanda kutip ''

const supabaseUrl = 'https://mlywpfcalretnnklvhlb.supabase.co' // <-- GANTI DENGAN URL SUPABASE KAMU (Lihat file .env.local)
const supabaseKey = 'sb_publishable_xZvsbYg3LSKxb3t45a5D2Q_GfGvNeeX' // <-- GANTI DENGAN ANON KEY PANJANG KAMU (Lihat file .env.local)

export const supabase = createClient(supabaseUrl, supabaseKey)