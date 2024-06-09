import { LucideIcon } from "lucide-react";
import React from "react";

export type EditorElement <T = any> = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: string | null;
  content: T
    
};


export type ElementSidebar<T> = {
  icon: LucideIcon;
  label: string;
  id: string;
  name: string;
  type: string;
  group: "layout" | "elements" | "hero" | "twitch" | "youtube" | "discord" 
  defaultPayload: EditorElement<T>;
  component?: ({ element }: {element: EditorElement<T>}) => JSX.Element;
  settings?: ({ element }: {element: EditorElement<T>}) => JSX.Element;
};