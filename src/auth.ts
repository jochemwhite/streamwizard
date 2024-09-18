import axios from "axios";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { env } from "./lib/env";
import { supabaseAdmin } from "./lib/supabase/admin";
import { TwitchEventSubscriptions } from "./lib/utils";
import { GetEventSubSubscriptionsResponse } from "./types/API/twitch";

const { SUPABASE_JWT_SECRET, TWITCH_APP_TOKEN, NEXT_PUBLIC_TWITCH_CLIENT_ID } = env;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // debug: true,
  
  callbacks: {
    signIn: async ({ account, user }) => {
      const hasEvents = await checkTwitchSubscriptions(account!.providerAccountId);

      if (!account) return "/unauthorized";

      await supabaseAdmin
        .from("twitch_integration")
        .update({
          access_token: account?.access_token,
          refresh_token: account?.refresh_token,
        })
        .eq("broadcaster_id", account.providerAccountId.toString());

      if (!hasEvents) {
        return "/unauthorized?error=events";
      }

      if (!user.email) return "/unauthorized?error=email";

      const { data, error } = await supabaseAdmin.from("whitelist").select("*").eq("email", user.email!).single();

      if (error) {
        console.log(error);
        return "/unauthorized?error=not-whitelisted";
      }

      if (!data) {
        return "/unauthorized?error=not-whitelisted";
      }

      user.broadcaster_id = account.providerAccountId;


      return true;
    },

    async jwt({ token, user, account }) {
      if (account) {
        token.id = user.id
        token.broadcaster_id = account?.providerAccountId
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = session.user || {}
        session.user.id = token.id as string
        session.user.broadcaster_id = token.broadcaster_id 

        const signingSecret = process.env.SUPABASE_JWT_SECRET!

        const payload = {
          aud: "authenticated",
          ekuxp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub,
          email: token.email,
          role: "authenticated",
        }

        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }

      // console.log(session)
      return session
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
        Authorization: `Bearer ${TWITCH_APP_TOKEN}`,
        "Client-Id": NEXT_PUBLIC_TWITCH_CLIENT_ID,
      },
    });


    const subscriptions = TwitchEventSubscriptions(user_id);

    const missingSubs = subscriptions.map((sub) => sub.type).filter((sub) => !res.data.data.some((data) => data.type === sub && data.transport.conduit_id === env.CONDUIT_ID));

    console.log(missingSubs);

    if (missingSubs.length > 0) {
      await Promise.all(
        missingSubs.map((sub) =>
          axios.post(
            "https://api.twitch.tv/helix/eventsub/subscriptions",
            {
              ...subscriptions.find((subscription) => subscription.type === sub),
              transport: {
                method: "conduit",
                conduit_id: env.CONDUIT_ID,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${TWITCH_APP_TOKEN}`,
                "Client-Id": NEXT_PUBLIC_TWITCH_CLIENT_ID,
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
