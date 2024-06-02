"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { TrackObjectFull } from "@/types/API/spotify-web-api";
import { cn } from "@/utils";

interface Props {
  user_id: string;
}

const SpotifyAddSong: React.FC<Props> = ({ user_id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [song, setSong] = useState<TrackObjectFull>();

  const handleShowToast = () => {
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
      setSong(undefined);
    }, 5000);
  };

  useEffect(() => {
    const channelB = supabase.channel(`spotify:${user_id}`);

    channelB
      .on("broadcast", { event: "new_song" }, (payload) => {
        console.log(payload.payload.new_song);
        setSong(payload.payload.new_song);
        handleShowToast();
      })
      .subscribe((status) => {
        console.log("status", status);
      });
  }, [user_id]);

  return (
    <>
      <motion.div
        animate={isOpen ? "visible" : "hidden"}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 20 },
        }}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
        }}
      >
        <div
          className={cn("h-96 w-96 flex justify-center items-center border rounded-lg ", {})}
          style={{
            backgroundImage: `url(${song?.album.images[0].url})`,
            backgroundSize: "contain",
          }}
        >
          <div className="w-full h-full !bg-black/80 flex justify-center items-center rounded-lg">
            <div className=" text-center">
              <p className="text-4xl font-semibold">{song?.name}</p>
              <p className="text-xl">{song?.artists.map((artist) => artist.name).join(", ")}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SpotifyAddSong;
