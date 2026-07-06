import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Supabase 설정이 없습니다. .env.local에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 채워주세요.',
  )
}

export const supabase = createClient(url, anonKey)
