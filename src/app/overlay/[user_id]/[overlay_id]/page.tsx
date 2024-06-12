import { getOverlay } from "@/actions/supabase/table-overlays";
import OverlayEditorCanvas from "@/components/overlay/overlay-editor-canvas";
import { OverlayProvider } from "@/providers/overlay-editor/overlay-provider";
import { overlay } from "@/types/overlay";

export default async function Page({ params }: { params: { user_id: string; overlay_id: string } }) {
  const overlay = await getOverlay(params.user_id, params.overlay_id);

  if (!overlay) return null;

  const overlayobj: overlay = {
    created_at: overlay?.created_at,
    height: overlay.height,
    width: overlay.width,
    id: overlay.id,
    name: overlay.name,
    user_id: overlay.user_id,
    displayMode: "Live",
    elements: overlay.elements ? JSON.parse(overlay.elements) : [],
    selectedElement: null,
    published: false,
  };

  return (
    <OverlayProvider overlay={overlayobj} user_id={params.user_id}>
      <OverlayEditorCanvas />
    </OverlayProvider>
  );
}
