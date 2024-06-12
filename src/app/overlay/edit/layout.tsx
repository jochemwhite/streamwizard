import { auth } from "@/auth";
import Sidebar from "@/components/nav/sidebar";
import HeaderOverlay from "@/components/overlay/nav/HeaderOverlay";
import SidebarOverlay from "@/components/overlay/nav/overlay-editor-sidebar";
import { createClient } from "@/lib/supabase/server";
import { OverlayProvider } from "@/providers/overlay-editor/overlay-provider";
import { overlay } from "@/types/overlay";
import React from "react";

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const supabase = createClient(session?.supabaseAccessToken as string);
  const { data, error } = await supabase
    .from("overlays")
    .select("*")
    .eq("id", "9dffa4c9-db7b-4661-9821-87bc74860cbb").single();

  if(!data) return null

  const overlay: overlay = {
    created_at: data?.created_at,
    height: data.height,
    width: data.width,
    id: data.id,
    name: data.name,
    user_id: data.user_id,
    displayMode: "Editor",
    elements: data.elements ? JSON.parse(data.elements) : [],
    selectedElement: null,
    published: false
  }

  return (
    <OverlayProvider overlay={overlay} user_id={session!.user.id!}>
      <div className="flex absolute top-0 left-0 bg-black h-screen w-full z-50">

        <div className="w-full">
          <HeaderOverlay />

          {children}
        </div>
        <SidebarOverlay />
      </div>
    </OverlayProvider>
  );
}
