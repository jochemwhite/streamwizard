"use server";
import { TwitchAPI } from "@/lib/axios/twitch-api";
import { ChannelPointSchema } from "@/schemas/channelpoint-schema";
import {
  ChannelSearchResults,
  SearchCategories,
  TwitchChannelPointsResponse,
  TwitchChannelPointsReward,
  TwitchClip,
  TwitchClipResponse,
  getTwitchUserResponse,
} from "@/types/API/twitch";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface response<T> {
  data?: T;
  error?: string;
  message?: string;
}

export async function searchChatter(value: string, first: number = 10) {
  const supabase = await createClient();

  const { data, error: DBerror } = await supabase.from("integrations_twitch").select("access_token, twitch_user_id").single();

  if (DBerror) {
    console.error("Tokens not found");
    return null;
  }

  try {
    const res = await TwitchAPI.get<ChannelSearchResults>(`/search/channels`, {
      params: {
        query: value,
        first: first,
      },

      broadcasterID: +data.twitch_user_id,
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUser({ id }: { id: string }) {
  // get broadcaster_id

  const supabase = await createClient();
  const { data, error: DBerror } = await supabase.from("integrations_twitch").select("access_token, twitch_user_id").single();

  if (DBerror) {
    console.error("Tokens not found");
    return null;
  }

  try {
    const res = await TwitchAPI.get<getTwitchUserResponse>(`/users`, {
      params: {
        id: id,
      },
      broadcasterID: +data.twitch_user_id,
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    console.error(error);
  }
}

// channelpoints

// get all the channel points for song requests
export async function getChannelPoints(): Promise<TwitchChannelPointsReward[] | null> {
  const supabase = await createClient();
  const { data, error: DBerror } = await supabase.from("integrations_twitch").select("access_token, twitch_user_id").single();

  if (DBerror) {
    console.error(DBerror);
    return null;
  }

  try {
    const res = await TwitchAPI.get<TwitchChannelPointsResponse>(`/channel_points/custom_rewards?broadcaster_id=${data.twitch_user_id}`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
      broadcasterID: +data.twitch_user_id,
    });

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// create a channel point
export async function createChannelPoint(new_channelpoint: ChannelPointSchema): Promise<response<TwitchChannelPointsResponse>> {
  // get broadcaster_id

  const supabase = await createClient();
  const { data, error: DBerror } = await supabase.from("integrations_twitch").select("access_token, twitch_user_id").single();

  if (DBerror) {
    console.error("Tokens not found");
    return { error: "Tokens not found" };
  }

  try {
    let res = await TwitchAPI.post<response<TwitchChannelPointsResponse>>(
      `/channel_points/custom_rewards?broadcaster_id=${data.twitch_user_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
        broadcasterID: +data.twitch_user_id,
      }
    );

    const newReward = res.data;

    return newReward;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// delete a channel point
export async function deleteChannelPoint(id: string) {
  // get broadcaster_id

  const supabase = await createClient();
  const { data, error: DBerror } = await supabase.from("integrations_twitch").select("access_token, twitch_user_id").single();

  if (DBerror) {
    console.error("Tokens not found");
    return null;
  }

  try {
    const res = await TwitchAPI.delete(`/channel_points/custom_rewards?broadcaster_id=${data.twitch_user_id}&id=${id}`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
      broadcasterID: +data.twitch_user_id,
    });

    // remove the data from the database
    // await supabase.from("twitch_channelpoints").delete().eq("channelpoint_id", id);
    revalidatePath("/dashboard/channelpoints");
    return res.data.data;
  } catch (error) {
    throw error;
  }
}

// update a channel point
export async function updateChannelpoint(channelpoint: ChannelPointSchema, channelpoint_id: string) {
  // get broadcaster_id

  const supabase = await createClient();
  const { data, error: DBerror } = await supabase.from("integrations_twitch").select("access_token, twitch_user_id").single();

  if (DBerror) {
    console.error("Tokens not found");
    return null;
  }

  try {
    const res = await TwitchAPI.patch<TwitchChannelPointsResponse>(
      `/channel_points/custom_rewards?broadcaster_id=${data.twitch_user_id}&id=${channelpoint_id}`,
      channelpoint,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
        broadcasterID: +data.twitch_user_id,
      }
    );

    revalidatePath("/dashboard/channelpoints");
    return res.data.data;
  } catch (error: any) {
    console.error(error.resposne);
    throw error;
  }
}

// add clips to database
export async function SyncBroadcasterClips() {
  try {
    let hasMoreClips = true;
    let cursor: string | undefined;
    let totalClips = 0;
    const batchSize = 100;

    const supabase = await createClient();
    const { data, error: DBerror } = await supabase.from("integrations_twitch").select("access_token, twitch_user_id, user_id").single();

    if (DBerror) {
      console.error("Tokens not found");
      return null;
    }

    while (hasMoreClips) {
      // Construct URL with pagination

      // Fetch clips
      const response = await TwitchAPI.get<TwitchClipResponse>("/clips", {
        params: {
          broadcaster_id: "458505769",
          first: batchSize,
          after: cursor ? cursor : undefined,
        },
        broadcasterID: +data.twitch_user_id,
      });

      const { data: clips, pagination } = response.data;

      if (!clips.length) {
        break;
      }

      // Format clips for database insertion
      const formattedClips = clips.map((clip: TwitchClip) => ({
        twitch_clip_id: clip.id,
        url: clip.url,
        embed_url: clip.embed_url,
        broadcaster_id: clip.broadcaster_id,
        broadcaster_name: clip.broadcaster_name,
        creator_id: clip.creator_id,
        creator_name: clip.creator_name,
        video_id: clip.video_id || null,
        game_id: clip.game_id,
        language: clip.language,
        title: clip.title,
        view_count: clip.view_count,
        created_at_twitch: clip.created_at,
        thumbnail_url: clip.thumbnail_url,
        duration: clip.duration,
        vod_offset: clip.vod_offset,
        is_featured: clip.is_featured,
        user_id: data.user_id,
      }));

      // Upsert clips to database
      const { error } = await supabase.from("clips").upsert(formattedClips, {
        onConflict: "twitch_clip_id",
        ignoreDuplicates: false,
      });

      if (error) {
        throw new Error(`Failed to insert clips: ${error.message}`);
      }

      totalClips += clips.length;
      cursor = pagination.cursor;
      hasMoreClips = !!pagination.cursor;

      console.log(`Synced ${totalClips} clips`);
    }

    return {
      success: true,
      totalClips,
      message: `Successfully synced ${totalClips} clips`,
    };
  } catch (error) {
    console.error("Error syncing clips:", error);
    return {
      success: false,
      totalClips: 0,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      error,
    };
  }
}

export async function searchTwitchCategories(broadcaster_id: string, query: string, first: number = 10) {
  // get broadcaster_id

  const response = await TwitchAPI.get<SearchCategories>("/search/categories", {
    params: {
      first: first,
      query: query,
    },
    broadcasterID: +broadcaster_id,
  });
  return response.data.data;
}
