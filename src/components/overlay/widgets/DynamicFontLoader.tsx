'use client'
import { useEffect } from "react";

interface Props {
  fontName: string;
  fontPath: string;
}

export const DynamicFontLoader = ({ fontName, fontPath }: Props) => {
  useEffect(() => {
    // Create a style element
    const style = document.createElement("style");

    // Create a @font-face rule
    const fontFace = `@font-face {
      font-family: '${fontName}';
      src: url('${fontPath}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }`;

    // Add the @font-face rule to the style element
    style.appendChild(document.createTextNode(fontFace));

    // Append the style element to the document head
    document.head.appendChild(style);
  }, [fontName, fontPath]);

  return null; // This component doesn't render anything
};