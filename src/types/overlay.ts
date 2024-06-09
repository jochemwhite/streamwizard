import React from "react";

export type overlay = {
  created_at: string;
  height: number;
  id: string;
  name: string;
  user_id: string;
  width: number;
  widgets: widgets[];
};

export type widgets = {
  id: string;
  name: string;
  category: string;
  styles: React.CSSProperties;
  x_axis: number;
  y_axis: number;
  components?: components[];
};

export type components = {
  content: string;
  id: string;
  componentID: string;
  name: string;
  settings: any;
  styles: React.CSSProperties;
};
