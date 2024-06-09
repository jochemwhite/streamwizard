import { ElementSidebar, TypeTextP } from "@/types/pageEditor";
import {  AlignJustify } from "lucide-react";
import { v4 } from "uuid";
import TextComponent from "./text";

export interface TextContent {
  innerText: string;
  typeText?: TypeTextP;
}

const text: ElementSidebar<TextContent> = {
  icon: AlignJustify,
  group: "elements",
  id: v4(),
  label: "Text",
  name: "Text",
  type: "text",
  defaultPayload: {
    content: {
      innerText: "Text",
    },
    id: v4(),
    name: "Text",
    styles: {
      styles: {
        color: "white",
        fontSize: "16px",
        fontWeight: "normal",
        textAlign: "center",
      },
      mediaQuerys: [],
    },
    type: "text",
  },
  component: TextComponent,
};

export default text;
