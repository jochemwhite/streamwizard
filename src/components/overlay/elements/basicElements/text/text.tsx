"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OverlayElement } from "@/types/overlay";
import { Trash } from "lucide-react";
import React from "react";
import { TextContent } from ".";
import useEditor from "@/hooks/useOverlay";

type Props = {
  element: OverlayElement<TextContent>;
};

export default function TextComponent({ element }: Props) {
  const { dispatch, state } = useEditor();

  const sytles = element.styles;

  ///WE ARE NOT ADDING DRAG DROP
  const content = !Array.isArray(element.content) ? element.content : null;
  return (
    <h2
      style={sytles}
      contentEditable={state.editor.displayMode === "Editor"}
      onBlur={(e) => {
        const spanElemtn = e.target;
        dispatch({
          type: "UPDATE_ELEMENT",
          payload: {
            elementDetails: {
              ...element,
              content: {
                innerText: spanElemtn.innerText,
              },
            },
          },
        });
      }}
    >
      {content?.innerText}
    </h2>
  );
}
