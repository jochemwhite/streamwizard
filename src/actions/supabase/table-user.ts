"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("users").select("*").single();

  if (error || !data || data === null) {
    console.error(error);
    return null;
  }

  return data;
}
