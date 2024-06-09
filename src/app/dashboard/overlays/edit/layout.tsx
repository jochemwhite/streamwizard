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
    .select("*, overlay_widgets(*, overlay_components(*))")
    .eq("id", "b1084cfd-c65e-4e26-b8c6-88e265140f5d").single();

  if(!data) return null

  const overlay: overlay = {
    created_at: data?.created_at,
    height: data.height,
    id: data.id,
    name: data.name,
    user_id: data.user_id,
    widgets: data.overlay_widgets,
    width: data.width,
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
