import React, { useEffect, useState, useCallback, useRef } from "react";
import { TitleContent } from ".";
import useOverlay from "@/hooks/useOverlay";
import { OverlayElement } from "@/types/overlay";

type Props = {
  element: OverlayElement<TitleContent>;
};

export default function TitleComponent({ element }: Props) {
  const { state, dispatch } = useOverlay();
  const [isEdit, setIsEdit] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { innerText } = element.content;

  const handleOnBlur = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      const spanElement = e.target;
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...element,
            content: {
              innerText: spanElement.innerText,
            },
          } as OverlayElement<TitleContent>,
        },
      });
      setIsEdit(false); // Exit edit mode on blur
    },
    [dispatch, element]
  );

  const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLHeadingElement>) => {
    // check if the display mode is editor
    if (state.editor.displayMode !== "Editor") return;


    setIsEdit(true);
    if (headingRef.current) {
      // Create a range and select all the content of the element
      const range = document.createRange();
      range.selectNodeContents(headingRef.current);

      // Clear any existing selections
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      headingRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isEdit && headingRef.current) {
      headingRef.current.focus();
    }
  }, [isEdit]);

  return (
    <h3
      ref={headingRef}
      contentEditable={state.editor.displayMode === "Editor" && isEdit}
      onBlur={handleOnBlur}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: isEdit ? 'text' : 'pointer' }}
    >
      {innerText}
    </h3>
  );
}
