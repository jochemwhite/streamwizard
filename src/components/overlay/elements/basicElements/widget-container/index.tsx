import { OverlayElement, ElementSidebar } from "@/types/overlay";
import { Container } from "lucide-react";
import { v4 } from "uuid";
import WidgetContainer from "./widget-container";

const container: ElementSidebar<OverlayElement[]> = {
  icon: Container,
  group: "elements",
  name: "Container",
  defaultPayload: {
    content: [],
    id: "",
    name: "widget_container",

    styles: {},
    x_axis: 0,
    y_axis: 0,

    type: "widget_container",
  },
  type: "widget_container",
  component: WidgetContainer,
};

export default container;
