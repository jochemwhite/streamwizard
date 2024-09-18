"use server";
import { env } from "../env";
import { auth } from "@/auth";
import axios from "axios";

const StreamWizardAPI = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
  },
});

StreamWizardAPI.interceptors.request.use(async (config) => {
  const session = await auth();
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
