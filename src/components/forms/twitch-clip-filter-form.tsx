"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TwitchCategorySearch from "../search-bars/twitch-category-search";

interface FilterFormProps {
  gameId?: string;
  creatorName?: string;
  isFeatured?: boolean;
}

export default function FilterForm({ gameId, creatorName, isFeatured }: FilterFormProps) {
  const router = useRouter();
  const [gameIdInput, setGameIdInput] = useState(gameId || "");
  const [creatorNameInput, setCreatorNameInput] = useState(creatorName || "");
  const [isFeaturedInput, setIsFeaturedInput] = useState(isFeatured || false);

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (gameIdInput) params.append("game_id", gameIdInput);
    if (creatorNameInput) params.append("creator_name", creatorNameInput);
    if (isFeaturedInput) params.append("is_featured", String(isFeaturedInput));

    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleFilter} className="flex gap-4 mb-4">
      <TwitchCategorySearch onSelect={(game_id) => setGameIdInput(game_id)} />
      <input
        type="text"
        placeholder="Search by Creator Name"
        value={creatorNameInput}
        onChange={(e) => setCreatorNameInput(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <label className="flex items-center">
        <input type="checkbox" checked={isFeaturedInput} onChange={(e) => setIsFeaturedInput(e.target.checked)} className="mr-2" />
        Featured Only
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
        Apply Filters
      </button>
    </form>
  );
}
