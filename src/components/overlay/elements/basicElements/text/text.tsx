"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/pageEditor";
import { Trash } from "lucide-react";
import React from "react";
import { TextContent } from ".";
import useEditor from "@/hooks/useEditor";

type Props = {
  element: EditorElement<TextContent>;
};

export default function TextComponent({ element }: Props) {
  const { dispatch, state } = useEditor();

  const sytles = element.styles;


  ///WE ARE NOT ADDING DRAG DROP
  const content = !Array.isArray(element.content) ? element.content : null;
  return (
    <div>
      {(content?.typeText === "Parrafo" || content?.typeText == null) && (
        <span
          contentEditable={state.editor.displayMode === "Editor"}
          onBlur={(e) => {
            const spanElemtn = e.target as HTMLSpanElement;
            dispatch({
              type: "pageEditor/updateAnElement",
              payload: {
          
                  ...element,
                  content: {
                    innerText: spanElemtn.innerText,
                  },
              
              },
            });
          }}
        >
          {content?.innerText}
        </span>
      )}
      {content?.typeText === "Title" && (
        <h1
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
        </h1>
      )}
      {content?.typeText === "SubTitle" && (
        <h2
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
      )}
    </div>
  );
}
