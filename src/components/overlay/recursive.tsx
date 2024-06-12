import { OverlayElement } from "@/types/overlay";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import useOverlay from "@/hooks/useOverlay";
import { elements } from "./elements";

type Props = {
  element: OverlayElement;
};

export default function Recursive({ element }: Props) {
  const Component = elements.find((el) => el.type === element.type)?.component;

  const { state, dispatch } = useOverlay();
  const [fontFace, setFontFace] = useState<FontFace>();

  // useEffect(() => {
  //   if (activeStyle.customFont !== undefined) {
  //     const url = storage.getFileView("65f05c4a768b37937d9e", activeStyle.customFont).href;

  //     const fontName = activeStyle.customFont.split(".")[0];

  //     const fontFace = new FontFace(fontName, `url(${url})`);
  //     fontFace.load().then((loadedFontFace) => {
  //       document.fonts.add(loadedFontFace);
  //       setFontFace(loadedFontFace);
  //     });
  //   }
  // }, [activeStyle]);

  if (!Component) {
    console.log("Component not found");
    return;
  }

  const handleDeleteElement = () => {
    dispatch({
      type: "REMOVE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleOnClikBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "SET_SELECTED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  if (element.type === "widget_container" ) {
    return <Component element={element} />;
  }

  return (
    <div
      style={{
        ...element.styles,
        fontFamily: fontFace?.family,
      }}
      onClick={handleOnClikBody}
      className={cn("relative", {
        "!border-blue-500": state.editor.selectedElement?.id === element.id && state.editor.displayMode === "Editor",
        "border-dashed border-[1px] border-slate-300 p-4": state.editor.displayMode === "Editor",
      })}
    >
      {state.editor.selectedElement?.id === element.id && state.editor.displayMode === "Editor" && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">{state.editor.selectedElement?.name}</Badge>
      )}
      <Component element={element} />
      {state.editor.selectedElement?.id === element.id && state.editor.displayMode === "Editor" && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash
            className="cursor-pointer"
            size={16}
            onClick={() => {
              handleDeleteElement();
            }}
          />
        </div>
      )}
    </div>
  );
}
