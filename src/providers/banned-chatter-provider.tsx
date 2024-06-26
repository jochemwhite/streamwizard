"use client";
import { addBannedChatter, removeBannedChatter } from "@/actions/supabase/table-banned_chatters";
import { InserSpotifyBannedChatterTable, SpotifyBannedChatterTable } from "@/types/database";
import React, { ReactNode, createContext, startTransition, useOptimistic } from "react";
import { toast } from "sonner";

// Define the type for the context
export interface BannedChatterContextType {
  bannedChatters: SpotifyBannedChatterTable[];
  unbanChatter: (chatter: SpotifyBannedChatterTable[]) => void;
  banChatter: (chatter: { chatter_id: string; chatter_name: string }) => void;
}

// Create the context with TypeScript type
export const BannedChatterContext = createContext<BannedChatterContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  initialBannedChatters: SpotifyBannedChatterTable[];
  user_id: string;
  settings_id: string;
  broadcaster_id: number;
  editor: string;
}

function reducer(state: SpotifyBannedChatterTable[], action: { type: string; payload: SpotifyBannedChatterTable }) {
  switch (action.type) {
    case "ADD_CHATTER":
      return [...state, action.payload];    
    case "DELETE_CHATTER":
      return state.filter((c) => c.id !== action.payload.id);
    default:
      return state;
  }
}

export const BannedChatterProvider = ({ children, initialBannedChatters, broadcaster_id, editor, user_id, settings_id }: Props) => {
  const [optimisticBannedChatters, dispatch] = useOptimistic(initialBannedChatters, reducer);

  // Function to add a command
  const banChatter = async (chatter: { chatter_id: string; chatter_name: string }) => {
    const banned_chatter: InserSpotifyBannedChatterTable = {
      ...chatter,
      broadcaster_id: broadcaster_id.toString(),
      broadcaster_name: editor,
      moderator_name: editor,
      moderator_id: broadcaster_id.toString(),
      settings_id: settings_id,
      user_id: user_id,

    };

    // startTransition(() => {
    //   dispatch({ type: "ADD_CHATTER", payload: banned_chatter });
    // });

    const {error} = await addBannedChatter(banned_chatter, "/dashboard/banned-chatters")

    if(error) {
      toast.error(error);
      return;
    }

    toast.success(`${chatter.chatter_name} has been banned`);

   
  };

  // Function to delete a command
  const unBanChatter = async (chatter: SpotifyBannedChatterTable[]) => {
    startTransition(() => {
      chatter.forEach((chatter) => {
        dispatch({ type: "DELETE_CHATTER", payload: chatter });
      });
    });

    const command_ids = chatter.map((c) => c.id).filter((id) => id !== undefined) 

    command_ids.forEach(async (id) => {
      const { affectedRows, error } = await removeBannedChatter(id.toString(), "/dashboard/commands");

      if (error) {
        toast.error(error);
        return;
      }

      if (affectedRows) {
        toast.success(`${chatter[0].chatter_name} has been unbanned`);
      }
    });
  };

  // Value that will be passed to context consumers
  const value: BannedChatterContextType = { bannedChatters: optimisticBannedChatters, unbanChatter: unBanChatter, banChatter: banChatter };

  return <BannedChatterContext.Provider value={value}>{children}</BannedChatterContext.Provider>;
};
