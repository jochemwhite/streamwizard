import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import { ModalProvider } from "@/providers/modal-provider";
import { SessionProvider } from "@/providers/session-provider";
import { createClient } from "@/lib/supabase/server";


export const metadata: Metadata = {
  title: "StreamWizard", // Replace with a catchy title
  description:
    "Elevate your Twitch streams by letting viewers request songs directly from your chat. StreamWizard fosters a more interactive and engaging experience for you and your chat.", // Replace with a descriptive summary
  authors: {
    name: "StreamWizard",
    url: "https://streamwizard.org",
  },

  keywords: ["twitch", "music", "streaming", "interactive", "chat"],
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();





  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider session={data.session}>
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
            <ModalProvider>{children}</ModalProvider>
            <Toaster position="bottom-right" visibleToasts={10} theme="dark" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
