"use client";
import { searchChatter } from "@/actions/twitch/twitch-api";
import { ChannelSearchResult } from "@/types/API/twitch";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { SearchBar } from "../ui/search-bar";

interface results extends ChannelSearchResult {
  exactMatch?: boolean;
}

interface Props {
  button_label?: string;
  placeholder?: string;
  disabled?: boolean;
  onSelect?: (channel: ChannelSearchResult) => void;
}

export default function TwitchSearchBar({ button_label = "Select", placeholder = "Jochemwhite", disabled = false, onSelect = () => {} }: Props) {
  const [results, setResults] = useState<results[]>([]);

  const search = async (searchTerm: string) => {
    const data = await searchChatter(searchTerm, 100);
    if (data) {
      setResults(data);

      const match = data.find((channel: ChannelSearchResult) => channel.display_name.toLowerCase() === searchTerm.toLowerCase());
      if (match) {
        const newResults: results[] = data.map((channel: ChannelSearchResult) => {
          if (channel.display_name.toLowerCase() === searchTerm.toLowerCase()) {
            return { ...channel, exactMatch: true };
          }
          return channel;
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
                <img src={channel.thumbnail_url} className="w-8 h-8 rounded-full" />
                <span className="mx-4">{channel.display_name}</span>
                {channel.exactMatch && <span className="text-xs text-red-500">Exact Match</span>}
              </div>

              <Button type="button" variant="destructive" onClick={() => {
                onSelect(channel);
                setResults([]);
              }}>
                {button_label}
              </Button>
            </li>
          ))}
        </ul>
      )}
    />
  );
}
