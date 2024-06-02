import { auth } from "@/auth";
import ModalButton from "@/components/buttons/modal-button";
import OverlayForm from "@/components/forms/overlay-form";
import { createClient } from "@/lib/supabase/server";
import OverlayCard from "@/components/cards/overlay-card";
export default async function page() {
  const session = await auth();

  const supabase = createClient(session?.supabaseAccessToken as string);

  const overlays = await supabase.from("overlays").select("*");

  return (
    <div className="hidden h-full  flex-1 flex-col  md:flex">
      <div className="flex items-center justify-between space-y-2 border rounded p-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overlays</h2>
        </div>
        <div className="flex items-center space-x-2">
          <ModalButton buttonText="Add Overlay" ModalComponent={OverlayForm} />
        </div>
      </div>
      <div className="flex items-center justify-between space-y-2 border rounded p-4 mt-4">
        {overlays.data?.map((overlay, index) => (
          <div key={index}>
            <OverlayCard overlay={overlay} />
          </div>
        ))}
      </div>
    </div>
  );
}
