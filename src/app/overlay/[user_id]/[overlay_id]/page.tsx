import { getOverlay } from "@/actions/supabase/table-overlays";
import SpotifyAddSong from "@/components/overlay-widgets/spotify-add-song";
import React from "react";

export default async function Page({ params }: { params: { user_id: string; overlay_id: string } }) {
  const overlay = await getOverlay(params.user_id, params.overlay_id);


  return (
    <>
      {overlay ? (
        <>
          <SpotifyAddSong user_id={params.user_id} />
        </>
      ) : (
        <>Overlay not found</>
      )}
    </>
  );
}
