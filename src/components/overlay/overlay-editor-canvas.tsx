"use client";
import DotPattern from "@/components/magicui/dot-pattern";
import { elements } from "@/components/overlay/elements";
import RenderComponents from "@/components/overlay/widgets/render-components";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import UseOverlay from "@/hooks/useOverlay";
import { EditorBtns, OverlayElement } from "@/types/overlay";
import Draggable from "react-draggable";
import { toast } from "sonner";
import { v4 } from "uuid";

export default function OverlayEditorCanvas() {
  const { onDrop, canvasStyles, scale, state, dispatch } = UseOverlay();
  const isLiveMode = state.editor.displayMode === "Live";
  const canDrag = !isLiveMode;

  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation();

    if (!canDrag) {
      console.log("can't drag in live mode");
      return;
    }

    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;

    if (componentType === "widget_container") {
      console.log("widget_container");
    }

    
    const Element = elements.find((element) => element.type === componentType);
    console.log(Element);

    if (!Element) {
      toast.error("Element not found");
      return;
    }

    const newElement: OverlayElement = {
      id: v4(),
      name: Element.name,
      type: Element.type,
      x_axis: e.clientX,
      y_axis: e.clientY,
      styles: {
        ...Element?.defaultPayload.styles,
      },
      content: Element?.defaultPayload.content,
    };

    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        elementDetails: newElement,
      },
    });
  };

  const delElement = (Element: OverlayElement) => {
    dispatch({
      type: "REMOVE_ELEMENT",
      payload: {
        elementDetails: Element,
      },
    });
  };

  return (
    <div
      className="bg-green-950 relative"
      style={canvasStyles}
      onDrop={(e) => {
        e.preventDefault();
        handleOnDrop(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        // console.log(e);
      }}
    >
      <DotPattern />
      {state?.editor.elements.map((element, index) => {
        return (
          <Draggable
            bounds="parent"
            scale={scale}
            key={index}
            position={{ x: +state.editor.elements[index].x_axis, y: +state.editor.elements[index].y_axis }}
            onStop={(e, data) => {
              onDrop(element, data);
            }}
            // onDrag={(e, data) => {
            //   console.log(data);
            // }}
          >
            <div className="inline-block absolute overflow-hidden">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    style={element.styles}
                    onClick={() => {
                      // setActiveWidget(widget);
                    }}
                  >
                    <RenderComponents element={element} />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuItem
                    inset
                    onClick={() => {
                      delElement(element);
                    }}
                  >
                    Delete
                    <ContextMenuShortcut>del</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}
