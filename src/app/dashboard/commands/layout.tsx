import { getCommands } from "@/actions/supabase/table-commands";
import { get_twitch_integration } from "@/actions/supabase/table-twitch_integration";
import { CommandProvider } from "@/providers/commands-provider";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const commands = await getCommands();
  const userdata = await get_twitch_integration();

  if (!commands || !userdata) {
    return <div>Loading...</div>;
  }

  return (
    <CommandProvider initialCommands={commands} channel_id={userdata.channel_id} user_id={userdata.user_id} editor={userdata.username}>
      {children}
    </CommandProvider>
  );
}
