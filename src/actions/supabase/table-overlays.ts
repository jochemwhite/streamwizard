"use server";

import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { InsertOverlayTable, UpdateOverlayTable } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function createOverlay(overlay: { name: string; width: number; height: number }) {
  const session = await auth();
  const supabase = createClient(session?.supabaseAccessToken as string);

  if (!session?.user?.id) {
    throw new Error("User id not found");
  }

  const overlayObj: InsertOverlayTable = {
    ...overlay,
    user_id: session?.user?.id,
  };

  console.log(overlayObj);

  const { data, error } = await supabase.from("overlays").insert(overlayObj);
  if (error) throw error;
  return data;
}

export async function updateOverlay(overlay: UpdateOverlayTable) {
  const session = await auth();
  const supabase = createClient(session?.supabaseAccessToken as string);

  if (!session?.user?.id) {
    throw new Error("User id not found");
  }

  if (!overlay.id) {
    throw new Error("Overlay id not found");
  }

  const { data, error } = await supabase.from("overlays").update(overlay).eq("id", overlay.id);
  if (error) throw error;

  revalidatePath("/dashboard/overlays");

  return data;
}

export async function getOverlay(user_id: string, overlay_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from("overlays").select("*").eq("id", overlay_id).eq("user_id", user_id).single();


  if (error) {
    console.log(error);
    return null;
  }

  return data;
}


