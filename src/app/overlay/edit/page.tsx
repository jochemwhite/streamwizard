"use client";

import DotPattern from "@/components/magicui/dot-pattern";
import RenderComponents from "@/components/overlay/widgets/render-components";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import UseOverlay from "@/hooks/useOverlay";
import Draggable from "react-draggable";

export default function Page() {
  const { onDrop, canvasStyles, scale, state } = UseOverlay();

 
  return (
    <div className="bg-green-950 relative " style={canvasStyles}>
      <DotPattern  />
      {state?.editor.elements.map((element, index) => {
        return (
          <Draggable
            bounds="parent"
            scale={scale}
            key={index}
            position={{ x: +element.x_axis, y: +element.y_axis }}
            onStop={(e, data) => {
              // console.log("data", data.x, data.y);
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
                    <RenderComponents widget={element} />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuItem
                    inset
                    onClick={() => {
                      // delWidget(widget.id);
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
