"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CustomSlider } from "@/components/overlay/nav/sidebar/custom-slider";
import { Sketch } from "@uiw/react-color";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import UseOverlay from "@/hooks/useOverlay";
import Sidebar from "@/components/nav/sidebar";

export default function SidebarOverlay() {
  const { activeWidget, updateComponentContent, updateWidget, sidebarRef } = UseOverlay();

  function handleChange(componentID: string, content?: string, styles?: React.CSSProperties) {
    if (!activeWidget) return;

    updateComponentContent(activeWidget.id, componentID, content, styles);
  }

  return (
    <Sidebar ref={sidebarRef}>
      {activeWidget ? (
        <div className="px-2">
          <h4 className="text-2xl font-semibold text-center">{activeWidget.name}</h4>

          <CustomSlider
            label="width"
            value={+activeWidget.styles.width!}
            onChange={(value) => {
              updateWidget(activeWidget, {
                width: value,
              });
            }}
            minValue={0}
            maxValue={1000}
          />

          <CustomSlider
            label="height"
            value={+activeWidget.styles.height!}
            onChange={(value) => {
              updateWidget(activeWidget, {
                height: value,
              });
            }}
            minValue={0}
            maxValue={1000}
          />

          <div className="flex justify-between mt-2">
            <label>BackGround Color</label>
            <HoverCard>
              <HoverCardTrigger>
                <div className="h-5 w-5 rounded" style={{ backgroundColor: activeWidget.styles.color ? activeWidget.styles.color : "white" }} />
              </HoverCardTrigger>
              <HoverCardContent>
                <Sketch
                  color={activeWidget.styles.color ? activeWidget.styles.color : "white"}
                  onChange={(color) => {
                    updateWidget(activeWidget, {
                      backgroundColor: color.hexa,
                    });
                  }}
                />
              </HoverCardContent>
            </HoverCard>
          </div>

          <Accordion type="multiple">
            {activeWidget.components?.map((component, index) => (
              <AccordionItem value={index.toString()} key={index}>
                <AccordionTrigger>{component.name}</AccordionTrigger>
                <AccordionContent>{/* <RenderSettings component={component} handleChange={handleChange} /> */}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <div>no active widget</div>
      )}
    </Sidebar>
  );
}
