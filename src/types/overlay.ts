import { LucideIcon } from "lucide-react";
import React, { CSSProperties } from "react";

export type overlay = {
  id: string;
  height: number;
  width: number;
  name: string;
  created_at: string;
  user_id: string;
  displayMode: "Live" | "Editor" | "Preview";
  elements: OverlayElement[];
  selectedElement: OverlayElement | null;
  published: boolean;
};

export type OverlayElement<T = any> = {
  id: string;
  styles: customSettings;
  name: string;
  type: EditorBtns | null;
  content: T;
  x_axis: number;
  y_axis: number;
};

export interface customSettings extends CSSProperties {
  backgroundVideo?: string;
  customFont?: string;
}

export type HistoryState = {
  history: overlay[];
  currentIndex: number;
};

export type EditorState = {
  editor: overlay;
  history: HistoryState;
};

export type PropertisElementHandler = {
  target: {
    id: string;
    value: string;
  };
};

export type ElementSidebar<T> = {
  icon: LucideIcon;
  name: string;
  type: EditorBtns;
  group: "layout" | "elements" | "hero" | "twitch" | "youtube" | "discord" 
  defaultPayload: OverlayElement<T>;
  component?: ({ element }: {element: OverlayElement<T>}) => JSX.Element;
  settings?: ({ element }: {element: OverlayElement<T>}) => JSX.Element;
};


export type EditorBtns =
  | "widget_container"
  | 'basicElements/text'
