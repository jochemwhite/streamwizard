import { EditorElement } from "@/types/pageEditor";
import React, { useEffect, useState } from "react";
import { TitleContent } from ".";
import useEditor from "@/hooks/useEditor";

type Props = {
  element: EditorElement<TitleContent>;
};

export default function TitleComponent({ element }: Props) {
  const { state, dispatch } = useEditor();
  const { title, devider } = element.content;

  return (
    <>
      <h3
        className="fn_title"
        contentEditable={state.editor.displayMode === "Editor"}
        onBlur={(e) => {
          const spanElemtn = e.target;
          dispatch({
            type: "pageEditor/updateAnElement",
            payload: {
              ...element,
              content: {
                title: spanElemtn.innerText,
              },
            } as EditorElement<TitleContent>,
          });
        }}
      >
        {title}
      </h3>
      {devider && (
        <div className="line">
          <span />
        </div>
      )}
    </>
  );
}
