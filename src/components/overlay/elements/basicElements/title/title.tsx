import React, { useEffect, useState } from "react";
import { TitleContent } from ".";
import useOverlay from "@/hooks/useOverlay";
import { EditorElement } from "@/types/overlay-editor";

type Props = {
  element: EditorElement<TitleContent>;
};

export default function TitleComponent({ element }: Props) {
  const { state, dispatch } = useOverlay();
  const { title, devider } = element.content;

  const handleOnBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    const spanElemtn = e.target;
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: {
            title: spanElemtn.innerText,
            devider,
          },
        } as EditorElement<TitleContent>,
      },
    });
  };

  return (
    <>
      <h3 className="fn_title" contentEditable={state.editor.displayMode === "Editor"} onBlur={handleOnBlur}>
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
