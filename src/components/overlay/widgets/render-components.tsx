import { OverlayElement } from "@/types/overlay";
import TextComponent from "../elements/basicElements/text/text";
import { toast } from "sonner";
import TitleComponent from "../elements/basicElements/title/title";

interface Props {
  element: OverlayElement
}

export default function RenderComponents({ element }: Props) {
  switch (element.type) {
    case "basicElements/text":
      return <TextComponent element={element} />

    case "basicElements/title":
      return <TitleComponent element={element} />;
    default:
      toast.error("Element not found");
      return <div>Element not found</div>;
  }




  
}
