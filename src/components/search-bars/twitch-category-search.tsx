"use client";
import { searchChatter, searchTwitchCategories } from "@/actions/twitch/twitch-api";
import { ChannelSearchResult, TwitchCategory } from "@/types/API/twitch";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { SearchBar } from "../ui/search-bar";
import { useSession } from "@/providers/session-provider";

interface results extends TwitchCategory {
  exactMatch?: boolean;
}

interface Props {
  button_label?: string;
  placeholder?: string;
  disabled?: boolean;
  onSelect?: (game_id: string) => void;
}

export default function TwitchCategorySearch({
  button_label = "Select",
  placeholder = "Rocket League",
  disabled = false,
  onSelect = () => {},
}: Props) {
  const [results, setResults] = useState<results[]>([]);

  const { user } = useSession();

  const search = async (searchTerm: string) => {
    const data = await searchTwitchCategories(user.user_metadata.sub, searchTerm);
    if (data) {
      setResults(data);

      const match = data.find((Category: TwitchCategory) => Category.name.toLowerCase() === searchTerm.toLowerCase());
      if (match) {
        const newResults: results[] = data.map((Category: TwitchCategory) => {
          if (Category.name.toLowerCase() === searchTerm.toLowerCase()) {
            return { ...Category, exactMatch: true };
          }
          return Category;
        });

        newResults.sort((a, b) => {
          if (a.exactMatch) {
            return -1;
          }
          return 0;
        });

        setResults(newResults);
      }
    } else {
      toast.error("Error searching for chatters.");
    }
  };

  return (
    <SearchBar
      results={results}
      setResults={setResults}
      search={search}
      disabled={disabled}
      placeholder={placeholder}
      Component={() => (
        <ul className="overflow-scroll h-48">
          {results.map((channel) => (
            <li key={channel.id} className="flex items-center justify-between gap-4 p-4 border-b">
              <div className="flex items-center">
                <img src={channel.box_art_url} className="w-8 h-8 rounded-full" />
                <span className="mx-4">{channel.name}</span>
                {channel.exactMatch && <span className="text-xs text-red-500">Exact Match</span>}
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onSelect(channel.id);
                  setResults([]);
                }}
              >
                {button_label}
              </Button>
            </li>
          ))}
        </ul>
      )}
    />
  );
}
