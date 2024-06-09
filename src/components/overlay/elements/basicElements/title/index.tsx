import { ElementSidebar } from "@/types/overlay-editor";
import { TypeIcon } from "lucide-react";
import { v4 } from "uuid";
import TitleComponent from "./title";
import settings from "./settings";

export interface TitleContent {
  title: string;
  devider: boolean;
}

const title: ElementSidebar<TitleContent> = {
  icon: TypeIcon,
  group: "elements",
  id: v4(),
  label: "Title",
  name: "Title",
  type: "title",
  defaultPayload: {
    content: {
      title: "Title",
      devider: true,
    },
    id: v4(),
    name: "title",
    styles: {
      color: "white",
      fontSize: "50px",
      fontWeight: "normal",
      textAlign: "center",
    },
    type: "title",
  },
  component: TitleComponent,
  settings: settings,
};

export default title;
