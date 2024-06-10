"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import useOverlay from "@/hooks/useOverlay";
import { PropertisElementHandler, customSettings } from "@/types/overlay";
import { elements } from "@/components/overlay/elements";
import TypographySettings from "../styles/typography";
import DimensionsSettings from "../styles/dimensions";
import DecorationsSettings from "../styles/decorations";
import DisplaySettings from "../styles/display";

export default function SettingsTab() {
  const { state, dispatch } = useOverlay();

  const activeStyle = state.editor.selectedElement.styles;

  function handleOnChanges(e: PropertisElementHandler) {
    const styleSettings = e.target.id;
    // const styleSettings = e.target.id as keyof typeof activeStyle;

    const { id, value } = e.target;
    const styleObject: customSettings = {
      [styleSettings]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    });
  }

  return (
    <Accordion
      type="multiple"
      className="w-full"
      // defaultValue={["Typography", "Dimesions", "Decorations", "Flexbox"]}
    >
      {elements
        .filter((element) => element.type === state.editor.selectedElement.type)
        .map((element, index) => (
          <div key={index}>
            {element.settings && (
              <AccordionItem key={index} value={element.label} className="px-6 py-0 border-y-[1px]">
                <AccordionTrigger className="!no-underline">{element.label} Settings</AccordionTrigger>
                <AccordionContent>{element.settings && <element.settings element={state.editor.selectedElement} />}</AccordionContent>
              </AccordionItem>
            )}
          </div>
        ))}

      <AccordionItem value="Typography" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">Typography</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <TypographySettings activeStyle={activeStyle} handleOnChanges={handleOnChanges} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Dimensions" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">Dimensions</AccordionTrigger>
        <AccordionContent>
          <DimensionsSettings activeStyle={activeStyle} handleOnChanges={handleOnChanges} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Decorations" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">Decorations</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <DecorationsSettings activeStyle={activeStyle} handleOnChanges={handleOnChanges} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Flexbox" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">Display</AccordionTrigger>
        <AccordionContent>
          <DisplaySettings activeStyle={activeStyle} handleOnChanges={handleOnChanges} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
