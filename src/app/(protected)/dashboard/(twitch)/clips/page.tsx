import { AdvancedPagination } from "@/components/advanced-pagination";
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
    creator_id?: string;
    is_featured?: boolean;
    start_date?: string;
    end_date?: string;
    search_query?: string;
    page?: string;
  };
}) {
  const supabase = await createClient();

  // Destructure and parse filter values from searchParams
  const { game_id, creator_id, is_featured, end_date, start_date, search_query, page } = await searchParams;

  // Build the Supabase query with filters
  let query = supabase.from("clips").select("*", { count: "exact" }).limit(100).order("created_at_twitch", { ascending: false });

  if (game_id) query = query.eq("game_id", game_id);
  if (creator_id) query = query.eq("creator_id", creator_id);
  if (is_featured !== undefined) query = query.eq("is_featured", is_featured);
  if (start_date) query = query.gte("created_at_twitch", start_date);
  if (end_date) query = query.lte("created_at_twitch", end_date);
  if (search_query) query = query.ilike("title", `%${search_query}%`);

  // Set pagination parameters
  const pageIndex = page ? parseInt(page) : 1;
  const pageSize = 100; // Fixed page size
  const from = (pageIndex - 1) * pageSize; // Calculate starting index
  const to = from + pageSize - 1; // Calculate ending index

  // Add the range to the query
  query = query.range(from, to);

  let { data, error, count } = await query;

  if (error) {
    console.error(error);
    return null;
  }

  if (!count) {
    count = 0;
  }

  const maxPage = Math.ceil(count! / pageSize);

  return (
    <>
      <FilterForm />

      {/* Clips Display */}
      {data && data.length > 0 ? (
        <>
          <div className="grid grid-cols-4 gap-4 mb-4" >
            {data.map((clip: Database["public"]["Tables"]["clips"]["Row"]) => (
              <TwitchClipCard key={clip.id} {...clip} />
            ))}
          </div>

          <AdvancedPagination totalPages={maxPage} initialPage={pageIndex} />
        </>
      ) : (
        <SyncTwitchClips />
      )}
    </>
  );
}
