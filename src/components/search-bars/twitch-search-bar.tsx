"use client";
import { searchChatter } from "@/actions/twitch/twitch-api";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useBannedChatters from "@/hooks/useBannedChatter";
import { ChannelSearchResult } from "@/types/API/twitch";
import { useState } from "react";
import { toast } from "sonner";
import TwitchCard from "../hover-cards/twitch-card";
import { Button } from "../ui/button";
import { SearchBar } from "../ui/search-bar";

interface results extends ChannelSearchResult {
  exactMatch?: boolean;
}

interface Props {
  placeholder: string;
  action_label:string
}


export default function TwitchSearchBar({ placeholder, action_label }: Props) {
  const [results, setResults] = useState<results[]>([]);

  const search = async (searchTerm: string) => {
    const data = await searchChatter(searchTerm, 3);
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
      placeholder={placeholder}
      Component={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]" />
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]" align="char">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="!h-[20px]">
            {results.map((channel) => (
              <TableRow key={channel.id}>
                <TableCell className="font-medium">
                  <img src={channel.thumbnail_url} className="w-8 h-8 rounded-full" />
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost">{channel.display_name}</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <TwitchCard broadcaster_id={channel.id} />
                    </HoverCardContent>
                  </HoverCard>
                  {channel.exactMatch && <span className="text-xs text-red-500">Exact Match</span>}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      // handleBanChatter({
                      //   chatter_id: channel.id,
                      //   chatter_name: channel.display_name,
                      // });
                    }}
                  >
                    {action_label}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    />
  );
}
