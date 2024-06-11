import { ElementSidebar } from "@/types/overlay";
import { TypeIcon } from "lucide-react";
import TitleComponent from "./title";

export interface TitleContent {
  innerText: string;

}

const title: ElementSidebar<TitleContent> = {
  icon: TypeIcon,
  group: "elements",
  name: "Title",
  type: "basicElements/title",

  defaultPayload: {
    id: "",
    name: "Text",
    type: "basicElements/title",
    content: {
      innerText: "StreamWizard",
    },
    styles: {
      color: "#ffffff",
      fontSize: "50px",

    },
    x_axis: 0,
    y_axis: 0,
  },
  component: TitleComponent,
};

export default title;
