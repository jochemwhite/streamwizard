"use client";
import { SpotifyQueueTable } from "@/types/database";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import useOverlay from "@/hooks/useOverlay";

const variableRegex = /\${(.*?)}/g;

interface Props {
  styles: React.CSSProperties;
  content: string;
  settings: any;
}

const mockData: SpotifyQueueTable[] = [
  {
    artists: "Rick Astley",
    broadcaster_id: "123",
    broadcaster_name: "mo_coww",
    chatter_id: "123",
    chatter_name: "mo_coww",
    created_at: "2021-08-17T21:00:00.000Z",
    id: 1,
    song_id: "4PTG3Z6",
    song_name: "Never Gonna Give You Up",
    user_id: "116728530",
    img_url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  },
];

const Queue = ({ styles, content, settings }: Props) => {
  const [queue, setQueue] = useState<SpotifyQueueTable[]>([]);
  const { user_id } = useOverlay();

  useEffect(() => {
    const initalQueue = async () => {
      const { data, error } = await supabase.from("spotify_queue").select("*").eq("user_id", user_id);

      if (error) {
        console.error(error);
      }

      if (data) {
        setQueue(data);
      }
    };

    initalQueue();

    const channelA = supabase
      .channel("spotify_queue")
      .on<SpotifyQueueTable>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          filter: `user_id=${user_id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT")
            setQueue((prev) => {
              return [...prev, payload.new];
            });
          if (payload.eventType === "DELETE")
            setQueue((prev) => {
              return prev.filter((q) => q.id !== payload.old.id);
            });

        }
      )
      .subscribe();

    return () => {
      channelA.unsubscribe();
    };
  }, [queue]);

  function parser(song: SpotifyQueueTable) {
    let messageArray = content.trim().split(" ");

    const newArray = messageArray.map((word, index) => {
      //if it has a variable
      if (word.match(variableRegex)) {
        //get inside of the variable
        const variable = word.match(variableRegex)![0].replace("${", "").replace("}", "");

        //get the value of from the database
        const value = replaceVariables(variable, song);

        //replace the variable with the value
        const newWord = word.replace(variableRegex, value?.toString() || "");

        //return the new word
        return newWord;
      } else {
        return word;
      }
    });

    return newArray.join(" ");
  }

  function replaceVariables(variable: string, song: SpotifyQueueTable) {
    switch (variable) {
      case "song.requested_by":
        return song.chatter_name;

      case "song.songID":
        return song.song_id;

      case "song.name":
        return song.song_name;

      case "song.artist":
        return song.artists;
    }
  }
  return (
    <ul style={styles}>
      {queue.map((q) => {
        return (
          <li key={q.id}>
            <div className="flex items-center">
              {settings && settings.showAlbum && q.img_url && <img src={q.img_url} alt={q.song_name} className="w-10" />}
              <p className="text-center">{parser(q)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Queue;
