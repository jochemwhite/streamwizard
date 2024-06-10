import { ElementSidebar } from "@/types/overlay";
import { AlignJustify } from "lucide-react";
import TextComponent from "./text";

export interface TextContent {
  innerText: string;
}

const text: ElementSidebar<TextContent> = {
  icon: AlignJustify,
  group: "elements",
  name: "Text",
  type: "basicElements/text",

  defaultPayload: {
    id: "",
    name: "Text",
    type: "basicElements/text",
    content: {
      innerText: "Text",
    },
    styles: {
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "normal",
      textAlign: "left",
      fontFamily: "Arial",
    },
    x_axis: 0,
    y_axis: 0,
  },

  component: TextComponent,
};

export default text;
