"use client";
import { SyncBroadcasterClips } from "@/actions/twitch/twitch-api";
import React from "react";
import { toast } from "sonner";

export default function SyncTwitchClips() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(SyncBroadcasterClips(), {
      loading: "Syncing Clips",
      success: "Clips Synced",
      error: "Failed to Sync Clips",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button>InsertClips</button>
    </form>
  );
}
