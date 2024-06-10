import { EditorState, OverlayElement, overlay } from "@/types/overlay";

export interface OverlayAction {
  type: "OVERRIDE_STATE" | "ADD_ELEMENT" | "REMOVE_ELEMENT" | "UPDATE_ELEMENT";
  payload: {
    elementDetails: OverlayElement;
    containerId?: string;
  };
}

export function overlayReducer(state: EditorState, action: OverlayAction): EditorState {
  switch (action.type) {
    case "ADD_ELEMENT":
      return {
        ...state,
        editor: {
          ...state.editor,
          elements: addElement(state.editor.elements, action.payload),
        },
      };

    case "UPDATE_ELEMENT":
      const newElementArray = updateElement(state.editor.elements, action.payload.elementDetails);

      return {
        ...state,
        editor: {
          ...state.editor,
          elements: newElementArray,
        },
      };

    default:
      return state;
  }
}

/**
 * Adds an element to the ElementsArray based on the provided action.
 * If the element's id matches the containerId in the action and the item's content is an array,
 * the elementDetails will be added to the content array of the item.
 * If the item's content is an array, the addElement function will be recursively called on the item's content.
 * If none of the conditions are met, the item will be returned as is.
 *
 * @param ElementsArray - The array of OverlayElement objects.
 * @param action - The action object containing the containerId and elementDetails.
 * @returns The updated ElementsArray with the new element added.
 */
export const addElement = (ElementsArray: OverlayElement[], action: OverlayAction["payload"]): OverlayElement[] => {
  console.log("addElement", ElementsArray, action);

  return [...ElementsArray, action.elementDetails];
};

// function to update the element
const updateElement = (ElementsArray: OverlayElement[], element: OverlayElement): OverlayElement[] => {
  console.log("updateElement", ElementsArray, element	)

  // find the element in the array
  return ElementsArray.map((item) => {
    if (item.id === element.id) {
      return { ...item, ...element };
    } else if (item.content && Array.isArray(item.content) && item.content.length > 0) {
      return {
        ...item,
        content: updateElement(item.content, element),
      };
    }
    return item;
  });
};
