import { auth } from '@/auth'
import { createClient } from '@/lib/supabase/server'
import { OverlayProvider } from '@/providers/overlay-provider'
import React from 'react'

export default async function layout({children}: {children: React.ReactNode}) {
  const session = await auth()
  const supabase = createClient(session?.supabaseAccessToken as string)
  const {data, error } = await supabase.from("overlays").select("*, overlay_widgets(*, overlay_components(*))").eq("id", "b1084cfd-c65e-4e26-b8c6-88e265140f5d")


  console.log(data)




  return (
    <OverlayProvider>{children}</OverlayProvider>
  )
}
