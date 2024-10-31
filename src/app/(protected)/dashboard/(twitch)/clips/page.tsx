import SyncTwitchClips from "@/components/buttons/insert-clips";
import TwitchClipCard from "@/components/cards/clip-card";
import FilterForm from "@/components/forms/twitch-clip-filter-form";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export default async function page({
  searchParams,
}: {
  searchParams: {
    game_id?: string;
    creator_name?: string;
    is_featured?: boolean;
  };
}) {
  const supabase = await createClient();

  // Destructure and parse filter values from searchParams
  const { game_id: gameId, creator_name: creatorName, is_featured: isFeatured } = await searchParams;

  // Build the Supabase query with filters
  let query = supabase.from("clips").select("*").limit(100).order("created_at_twitch", { ascending: true });

  if (gameId) query = query.eq("game_id", gameId);
  if (creatorName) query = query.ilike("creator_name", `%${creatorName}%`);
  if (isFeatured !== undefined) query = query.eq("is_featured", isFeatured);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <>
      <FilterForm gameId={gameId} creatorName={creatorName} isFeatured={isFeatured ?? false} />

      {/* Clips Display */}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {data.map((clip: Database["public"]["Tables"]["clips"]["Row"]) => (
            <TwitchClipCard key={clip.id} {...clip} />
          ))}
        </div>
      ) : (
        <SyncTwitchClips />
      )}
    </>
  );
}
