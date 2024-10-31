"use server";
import { env } from "../env";
import axios from "axios";
import { supabase } from "../supabase/client";

const StreamWizardAPI = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
  },
});

StreamWizardAPI.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  if (!session || !session.supabaseAccessToken) return Promise.reject();
  config.headers.Authorization = session.supabaseAccessToken;

  return config;
});

// StreamWizardAPI.interceptors.response.use(
//   (response) => {
//     return response;
//   },
// )

export default StreamWizardAPI;
