import { SupabaseAdapter } from "@auth/supabase-adapter";
import type { NextAuthConfig } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
import { TWITCH_SCOPES } from "./lib/constant";
import { env } from "./lib/env";

const {NEXT_PUBLIC_TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY} = env

export default {
  providers: [
    TwitchProvider({
      clientId: NEXT_PUBLIC_TWITCH_CLIENT_ID,
      clientSecret: TWITCH_CLIENT_SECRET,
      authorization: {
        params: {
          scope: TWITCH_SCOPES.join(" "),
        },
      }, 
    }),
  ],

  adapter: SupabaseAdapter({
    url: NEXT_PUBLIC_SUPABASE_URL,
    secret: SUPABASE_SERVICE_ROLE_KEY,
  }),




} satisfies NextAuthConfig;
