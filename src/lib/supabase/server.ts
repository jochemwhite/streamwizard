import { Database } from '@/types/supabase'
import { createServerClient } from '@supabase/ssr'
import { env } from '../env'

const {  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = env


export function createClient(supabaseAccessToken: string) {

  return createServerClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
      cookies: {
        get: undefined,
        set: undefined,
        remove: undefined
      }
    }
  )
}