import { LucideIcon } from "lucide-react";
import React from "react";

export type EditorElement <T = any> = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: string | null;
  content: T
    
};





