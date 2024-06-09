import { Element, ElementSidebar } from "@/types/pageEditor";
import { Video } from "lucide-react";
import { v4 } from "uuid";
import VideoComponent from "./video";

export interface VideoElementPayload {
  src: string;
}


const VideoElement: ElementSidebar<VideoElementPayload> = {
  group: "elements",
  icon: Video,
  id: "video",
  label: "Video",
  name: "Video",
  defaultPayload: {
    content: {
      src: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=y_Sm2klboPmi5UnT",
    },
    id: v4(),
    name: "Video",
    styles: {
      styles: {},
      mediaQuerys: [],
    },
    type: "video",
  },
  type: "video",
  component: VideoComponent,
};

export default VideoElement;
