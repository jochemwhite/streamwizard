"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import React from "react";
import TabList from "./tabs";
import SettingsTab from "./tabs/settings-tab";
import MediaBucketTab from "./tabs/media-bucket-tab";
import ComponentSelector from "./tabs/component-selector";
import LayersComponent from "./tabs/layers-component";
import useOverlay from "@/hooks/useOverlay";

export default function PageEditorSidebar() {
  const { state, sidebarRef} = useOverlay();

  const { editor } = state;

  return (
    <Sheet open={true} modal={false} >
      <Tabs defaultValue="Settings" ref={sidebarRef}>
        <SheetContent side="right" className={cn("mt-[97px] w-12 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden")}>
          <TabList />
        </SheetContent>
        <SheetContent side="right" className={cn("mt-[97px] w-80 z-[80] shadow-none p-0 mr-12 bg-background h-full transition-all overflow-hidden")}>
          <div className="grid gap-4 h-full pb-36 overflow-y-auto">
            <TabsContent value="Settings">
              <SheetHeader className="text-left p-6">
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you
                  <span className="font-bold">
                    {editor.selectedElement.name}#{editor.selectedElement?.id.substring(0, 4)}
                  </span>
                </SheetDescription>
              </SheetHeader>
              {editor.selectedElement?.id && <SettingsTab />}
            </TabsContent>
            <TabsContent value="Media">
              <MediaBucketTab />
            </TabsContent>
            <TabsContent value="Components">
              <SheetHeader className="text-left p-6">
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>You can drag adn drop components on the canvas</SheetDescription>
              </SheetHeader>
              <ComponentSelector />
            </TabsContent>
            <TabsContent value="Layers">
              <SheetHeader className="text-left p-6">
                <SheetTitle>Layers</SheetTitle>
                <SheetDescription>View the editor in a tree like structure</SheetDescription>
              </SheetHeader>
              <LayersComponent />
            </TabsContent>
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
}
