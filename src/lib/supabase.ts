import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
  console.error(
    '⚠️  VITE_SUPABASE_URL is not set.\n' +
    'Add it to your .env.local file (dev) or Cloudflare Pages environment variables (production).\n' +
    'Get it from: https://supabase.com/dashboard → Project Settings → API'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)
