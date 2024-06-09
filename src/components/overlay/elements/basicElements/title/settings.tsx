import React from "react";
import { TitleContent } from ".";
import { Checkbox } from "@/components/ui/checkbox";
import useOverlay from "@/hooks/useOverlay";
import { EditorElement } from "@/types/overlay-editor";

type Props = {
  element: EditorElement<TitleContent>;
};

export default function Settings({ element }: Props) {
  const { dispatch } = useOverlay();


  const updateContent = () => {
    const updatedContent = {
      ...element.content,
      devider: !element.content.devider 
    };


    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: updatedContent,
        },
      },
    });
  };

  return (
    
      <div className="flex gap-1.5 leading-none">
        <label htmlFor="terms1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Show Devider
        </label>
        <Checkbox checked={element.content.devider} onClick={updateContent} />
      </div>
  );
}
