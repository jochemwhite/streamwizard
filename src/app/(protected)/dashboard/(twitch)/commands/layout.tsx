import { createClient } from "@/lib/supabase/server";
import { CommandProvider } from "@/providers/commands-provider";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data } = await supabase.from("commands").select("*");
  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    redirect("/error");
  }

  if (!data) return null;

  return (
    <CommandProvider initialCommands={data} broadcaster_id={user.user?.user_metadata.sub} user_id={user.user.id} editor="Jochemwhite">
      {children}
    </CommandProvider>
    // <></>
  );
}
