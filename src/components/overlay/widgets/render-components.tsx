import React from "react";
import { DynamicFontLoader } from "./DynamicFontLoader";
import { widgets } from "@/types/overlay";
import Queue from "./spotify/spotify-queue";

interface Props {
  widget: widgets
}

export default function RenderComponents({ widget }: Props) {
  return (
    <div key={widget.id}>
      {widget.components && widget.components.map((component) => {
        const { componentID,  styles, content, settings } = component;


        switch (componentID) {
          case "title":
            const titleKey = "title";
            
            return (
              <React.Fragment key={titleKey}>
                <p style={styles}>
                  {content}
                </p>
              </React.Fragment>
            );

          case "spotify.queue":
            return <Queue key="queue" styles={styles} content={content} settings={settings} />;

          default:
            return null; // or <React.Fragment key="default" />;
        }
      })}
    </div>
  );
}
