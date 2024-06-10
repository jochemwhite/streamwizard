import { OverlayElement } from "@/types/overlay";
import TextComponent from "../elements/basicElements/text/text";

interface Props {
  element: OverlayElement
}

export default function RenderComponents({ element }: Props) {
  switch (element.type) {
    case "basicElements/text":
      return <TextComponent element={element} />
    default:
      return <div>Element not found</div>;
  }




  
}
