"use client";
import { createChannelPoint as create, deleteChannelPoint, updateChannelpoint as update } from "@/actions/twitch/twitch-api";
import { ChannelPointSchema } from "@/schemas/channelpoint-schema";
import { TwitchChannelPointsReward } from "@/types/API/twitch";
import { ReactNode, createContext, useOptimistic } from "react";
import { toast } from "sonner";

// Define the type for the context
export interface ChannelPointContextType {
  channelPoints: TwitchChannelPointsReward[];
  deleteChannelPoint: (channelpoint: TwitchChannelPointsReward[]) => Promise<void>;
  createChannelPoint: (channelpoint: ChannelPointSchema) => Promise<void>;
  updateChannelPoint: (channelpoint: ChannelPointSchema, channelpoint_id: string) => Promise<void>;
}

// Create the context with TypeScript type
export const ChannelPointContext = createContext<ChannelPointContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  initialChannelPoints: TwitchChannelPointsReward[] | null
}

function reducer(state: TwitchChannelPointsReward[], action: { type: string; payload: TwitchChannelPointsReward }) {
  switch (action.type) {
    case "ADD_SONG":
      return [...state, action.payload];
    case "DELETE_SONG":
      return state.filter((c) => c.id !== action.payload.id);
    default:
      return state;
  }
}

export const ChannelPointsProvider = ({ children, initialChannelPoints }: Props) => {
  const [optimisticBannedChatters, dispatch] = useOptimistic(initialChannelPoints ? initialChannelPoints : [], reducer);

  // Function to add a channelpoints
  const createChannelPoint = async (channelPoint: ChannelPointSchema) => {
    // startTransition(() => {
    //   dispatch({ type: "ADD_SONG", payload: {} });
    // });


     const {error} = await create(channelPoint);

    if (error) {
      toast.error(error);
      return;
    }
    

    toast.success(`${channelPoint.title} has been created`);
  };

  // Function to delete channelpoints
  const deleteChannelpoints = async (channelPoint: TwitchChannelPointsReward[]) => {
    const song_ids = channelPoint.map((c) => c.id).filter((id) => id !== undefined) as string[];

    song_ids.forEach(async (id) => {
      try {
        await deleteChannelPoint(id);
        toast.success("reward has been deleted");
      } catch (error: any) {
        toast.error(error.message);
      }
    });

    // startTransition(() => {
    //   channelPoint.forEach((point) => {
    //     dispatch({ type: "DELETE_SONG", payload: point });
    //   });
    // });
  };

  // update a channelpoint
  const updateChannelPoint = async (channelPoint: ChannelPointSchema, channelpoint_id: string) => {
    // startTransition(() => {
    //   dispatch({ type: "UPDATE_SONG", payload: channelPoint });
    // });


    await update(channelPoint, channelpoint_id);

    toast.success(`${channelPoint.title} has been updated`);
  };

  // Value that will be passed to context consumers
  const value: ChannelPointContextType = {
    channelPoints: optimisticBannedChatters,
    deleteChannelPoint: deleteChannelpoints,
    createChannelPoint,
    updateChannelPoint,
  };

  return <ChannelPointContext.Provider value={value}>{children}</ChannelPointContext.Provider>;
};
