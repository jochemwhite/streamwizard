import React from "react"

export type overlay = {
  created_at: string
  height: number
  id: string
  name: string
  user_id: string
  width: number
  widgets: widgets[]
}


export type widgets = {
  created_at: string
  id: string
  name: string
  overlay_id: string
  styles: React.CSSProperties
  x_axis: number
  y_axis: number
  components?: components[]
}


export type components = {
  content: string
  created_at: string
  id: string
  name: string
  settings: any
  styles: React.CSSProperties
  widget_id: string | null
}