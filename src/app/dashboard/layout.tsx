import { redirect } from "next/navigation";

import { getUser } from "@/actions/supabase/table-user";
import { SidebarNav } from "@/components/nav/SidebarNav";
import { Breadcrumb } from "@/components/nav/breadcrumb";
import { DashboardNav } from "@/components/nav/dashboardNav";
import Sidebar from "@/components/nav/sidebar";
import { dashboardConfig } from "@/config/dashboard";
import { auth } from "@/auth";



interface Props {
  children: React.ReactNode;
  params: any;
}


export default async function Layout({ children, params }: Props) {
  const session = await auth()
  const user = await getUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  console.log(params);


  return (
    <div className="flex">
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
    </div>
  );
}
