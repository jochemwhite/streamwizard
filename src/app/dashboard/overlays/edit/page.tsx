"use client";

import Draggable from "react-draggable";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import UseOverlay from "@/hooks/useOverlay";
import RenderComponents from "@/components/overlay/widgets/render-components";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/utils";
import { useEffect } from "react";

export default function Page() {
  const { delWidget, onDrop, setActiveWidget, canvasStyles, scale, state } = UseOverlay();

 
  return (
    <div className="bg-green-950 relative " style={canvasStyles}>
      <DotPattern  />
      {state?.widgets.map((widget, index) => {
        return (
          <Draggable
            bounds="parent"
            scale={scale}
            key={index}
            position={{ x: +widget.x_axis, y: +widget.y_axis }}
            onStop={(e, data) => {
              // console.log("data", data.x, data.y);
              onDrop(widget, data);
            }}
            // onDrag={(e, data) => {
            //   console.log(data);
            // }}
          >
            <div className="inline-block absolute overflow-hidden">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    style={widget.styles}
                    onClick={() => {
                      setActiveWidget(widget);
                    }}
                  >
                    <RenderComponents widget={widget} />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuItem
                    inset
                    onClick={() => {
                      delWidget(widget.id);
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
