import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { env } from "./lib/env";
import axios from "axios";
import { TwitchEventSubscriptions } from "./lib/utils";
import { GetEventSubSubscriptionsResponse } from "./types/API/twitch";
import { supabaseAdmin } from "./lib/supabase/admin";

const { SUPABASE_JWT_SECRET } = env;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // debug: true,
  callbacks: {
    async session({ session, user }) {
      const signingSecret = SUPABASE_JWT_SECRET;

      const payload = {
        aud: "authenticated",
        exp: Math.floor(new Date(session.expires).getTime() / 1000),
        sub: user.id,
        email: user.email,
        role: "authenticated",
      };
      session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      const { data } = await supabaseAdmin.from("users").select("*").eq("id", user.id).single();

      session.user.role = data?.role || "user";

      return session;
    },

    signIn: async ({ account, user }) => {
      const hasEvents = await checkTwitchSubscriptions(account!.providerAccountId);

      if (!hasEvents) {
        return "/unauthorized?error=events";
      }

      const { data } = await supabaseAdmin.from("users").select("*").eq("id", user.id!).single();

      if (!data) {
        return "/unauthorized?error=not-registered";
      }

      if (data.role === "user") {
        return "/unauthorized?beta_only=true";
      }

      return true;
    },
  },
});

// check for missing twitch event subscriptions
async function checkTwitchSubscriptions(user_id: string): Promise<boolean> {
  try {
    const res = await axios.get<GetEventSubSubscriptionsResponse>("https://api.twitch.tv/helix/eventsub/subscriptions", {
      params: {
        user_id: user_id,
      },
      headers: {
        Authorization: `Bearer ${env.TWITCH_APP_TOKEN}`,
        "Client-Id": env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
      },
    });

    // console.log(res.data)

    const subscriptions = TwitchEventSubscriptions(user_id);

    const missingSubs = subscriptions.map((sub) => sub.type).filter((sub) => !res.data.data.some((data) => data.type === sub));

    if (missingSubs.length > 0) {
      await Promise.all(
        missingSubs.map((sub) =>
          axios.post(
            "https://api.twitch.tv/helix/eventsub/subscriptions",
            {
              ...subscriptions.find((subscription) => subscription.type === sub),
              transport: {
                method: "conduit",
                conduit_id: "cbdc24bb-6f57-4691-ae2b-681579be0121",
              },
            },
            {
              headers: {
                Authorization: `Bearer ${env.TWITCH_APP_TOKEN}`,
                "Client-Id": env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
              },
            }
          )
        )
      );
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
