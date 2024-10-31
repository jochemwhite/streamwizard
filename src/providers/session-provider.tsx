"use client";

import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext<Session | null>(null);

interface Props {
  children: React.ReactNode;
  session: Session | null;
}

const queryClient = new QueryClient()
// session Provider component
export const SessionProvider = ({ children, session }: Props) => {
  const [Session, setSession] = useState<Session | null>(session);

  return (
    <SessionContext.Provider value={Session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionContext.Provider>
  );
};

// Custom hook to use the session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("use SSSession must be used within a sessionProvider");
  }
  return context;
};

// Example session component
