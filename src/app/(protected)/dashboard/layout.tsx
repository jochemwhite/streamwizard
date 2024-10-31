import { redirect } from "next/navigation";

import { getChannelPoints } from "@/actions/twitch/twitch-api";
import { SidebarNav } from "@/components/nav/SidebarNav";
import { Breadcrumb } from "@/components/nav/breadcrumb";
import { DashboardNav } from "@/components/nav/dashboardNav";
import Sidebar from "@/components/nav/sidebar";
import { dashboardConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { ChannelPointsProvider } from "@/providers/channelpoints-provider";


export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase.auth.getSession();

  if (!data || !data.session || error || !user) {
    redirect("/error");
  }

  const channelpoints = await getChannelPoints();

  return (
    <div className="flex">
      {/* <SessionProvider session={data.session}> */}
      <ChannelPointsProvider initialChannelPoints={channelpoints}>
        <Sidebar>
          <SidebarNav config={dashboardConfig} user={user} />
        </Sidebar>
        <div className="w-full">
          <DashboardNav />
          <div className="h-[calc(100vh-60px)] overflow-x-hidden  pb-10">
            <Breadcrumb />
            <div className="mx-auto px-10">{children}</div>
          </div>
        </div>
      </ChannelPointsProvider>

      {/* {children} */}
      {/* </SessionProvider> */}
    </div>
  );
}
