import { createClient } from "@supabase/supabase-js";
// import { Database } from "@/types/supabase";
import { env } from "../env";
import { Database } from "@/types/database";

export function createAdminClient() {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

export const supabaseAdmin = createAdminClient();