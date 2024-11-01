"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function DeleteIntegrations(integration: string): Promise<{
  message?: string;
  error?: string;
}> {
  let message: string = "";
  let error: string = "";

  const supabase = await createClient();

  switch (integration) {
    case "twitch":
      error = "Cannot delete Twitch integration";
      break;

    default:
      throw new Error("Invalid integration");
  }

  revalidatePath("/dashboard/settings");

  return { message, error };
}
