"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function OauthRedirect(integrations: string) {
  const header = headers();
  const origin = header.get("origin");

  let url: string;
  switch (integrations) {
    default:
      return;
  }

  return redirect(url);
}
