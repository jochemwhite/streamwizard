import Recursive from "@/components/overlay/recursive";
import useOverlay from "@/hooks/useOverlay";
import { cn } from "@/lib/utils";
import { OverlayElement } from "@/types/overlay";
import { Trash } from "lucide-react";

type Props = {
  element: OverlayElement<OverlayElement[]>;
};

export default function ElementContainer({ element }: Props) {
  const { state, dispatch } = useOverlay();

  const handleDeleteElement = () => {
    dispatch({
      type: "REMOVE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleOnCLickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "SET_SELECTED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };


  const handleOnDrop = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as string;

    const Element = state.editor.elements.find((element) => element.type === componentType);

    if (!Element) {
      console.log("Element not found");
      return;
    }

    const newElement: OverlayElement<OverlayElement[]> = {
      id: Element.id,
      name: Element.name,
      type: Element.type,
      x_axis: e.clientX,
      y_axis: e.clientY,
      styles: Element.styles,
      content: Element.content,
    };

    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        elementDetails: newElement,
      },
    });
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };




  return (
    <div
      style={element.styles}
      className={cn("relative z-50", {
        "!p-0 !m-0": state.editor.selectedElement?.type === "widget_container" && state.editor.displayMode === "Live",
        "max-w-full w-full ": element.type === "widget_container",
        "p-4": state.editor.displayMode === "Editor",
        "h-fit": element.type === "widget_container",
        "!border-blue-500": state.editor.selectedElement?.id === element.id && state.editor.displayMode === "Editor",
        "!border-solid": state.editor.selectedElement?.id === element.id && state.editor.displayMode === "Editor",
        "border-dashed border-[1px] border-slate-300 ": state.editor.displayMode === "Editor",
      })}
      onDrop={(e) => handleOnDrop(e, element.id)}
      onDragOver={handleDragOver}
      onClick={handleOnCLickBody}
    >
      {Array.isArray(element.content) &&
        element.content.map((childElement) => (
          // <Reorder.Item key={childElement.id} value={JSON.stringify(childElement)} className="w-full" dragListener={false}>
          <Recursive key={childElement.id} element={childElement} />
          // </Reorder.Item>
        ))}

      {state.editor.selectedElement?.id === element.id && state.editor.displayMode === "Editor" && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white z-50">
          <Trash
            className="cursor-pointer"
            size={16}
            onClick={() => {
              handleDeleteElement();
            }}
          />
        </div>
      )}

      {element.styles.backgroundVideo && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-[1] opacity-50 ">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src={element.styles.backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
