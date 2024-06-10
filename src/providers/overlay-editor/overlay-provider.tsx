"use client";
import { widgetList } from "@/components/overlay/widgets/widgets";
import { EditorState, HistoryState, overlay, OverlayElement } from "@/types/overlay";
import { Dispatch, MutableRefObject, ReactNode, createContext, useEffect, useReducer, useRef, useState } from "react";
import { DraggableData } from "react-draggable";
import { toast } from "sonner";
import { useWindowSize } from "usehooks-ts";
import { OverlayAction, overlayReducer } from "./overlay-actions";

// Define the type for the context
export interface OverlayContextType {
  onDrop: (updatedWidget: OverlayElement, data: DraggableData) => void;

  Save: () => void;
  user_id: string;

  canvasStyles: React.CSSProperties;
  sidebarRef: MutableRefObject<HTMLDivElement | null>;
  headerRef: MutableRefObject<HTMLDivElement | null>;

  scale?: number;
  state: EditorState;

  dispatch: Dispatch<OverlayAction>;
}

// Create the context with TypeScript type
export const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

const initialOverlayState: EditorState["editor"] = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "container",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  displayMode: "Editor",
  width: 1920,
  height: 1080,
  created_at: new Date().toISOString(),
  id: "",
  name: "New Overlay",
  user_id: "",
  published: false,
};

const initialHistoryState: HistoryState = {
  history: [initialOverlayState],
  currentIndex: 0,
};

interface Props {
  children: ReactNode;
  overlay: overlay;
  user_id: string;
}

export const OverlayProvider = ({ children, overlay, user_id }: Props) => {
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [canvasStyles, setCanvasStyles] = useState({
    height: "100px",
    width: "100px",
  } as React.CSSProperties);
  const [scale, setScale] = useState<number>(0);
  const [state, dispatch] = useReducer(overlayReducer, { editor: initialOverlayState, history: initialHistoryState });

  // calculate canvas dimensions
  useEffect(() => {
    const res = overlay;

    if (sidebarRef.current && headerRef.current && res) {
      const sidebarWidth = sidebarRef.current.offsetWidth;
      const headerHeight = headerRef.current.offsetHeight;

      // Calculate available width and height for the canvas
      const availableWidth = screenWidth - sidebarWidth;
      const availableHeight = screenHeight - headerHeight;

      // Calculate canvas dimensions while maintaining the same aspect ratio
      const canvasAspectRatio = res.width / res.height;
      let canvasWidth = availableWidth;
      let canvasHeight = availableWidth / canvasAspectRatio;

      // If the calculated canvas height is greater than the available height, adjust the dimensions
      if (canvasHeight > availableHeight) {
        canvasHeight = availableHeight;
        canvasWidth = availableHeight * canvasAspectRatio;
      }
      // Calculate zoom factor in both width and height
      const zoomFactorWidth = canvasWidth / res.width;
      // const zoomFactorHeight = canvasHeight / dimensions.height;
      setScale(zoomFactorWidth);

      const canvasStyles: React.CSSProperties = {
        width: res.width,
        height: res.height,
        zoom: zoomFactorWidth, // Use zoom property instead of transform
        transformOrigin: "top left",
      };

      // Update canvas styles state
      setCanvasStyles(canvasStyles);
    }
  }, [screenWidth, screenHeight]);

  // handle drop event
  const onDrop = (updatedWidget: OverlayElement, data: DraggableData) => {
    const { x, y } = data;
    const updatedElement: OverlayElement = { ...updatedWidget, styles: { ...updatedWidget.styles, left: x, top: y } };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: updatedElement,
      },
    });
  };

  //

  // Save overlay
  const Save = async () => {
    if (state.editor.elements.length === 0) {
      toast.error("you need atleast one widget");
      return;
    }

    toast.promise(
      async () => {
        try {
          const res = () => {};

          console.log(res);
        } catch (error) {
          throw error;
        }
      },
      {
        loading: `saving overlay...`,
        error: `failed to save overlay`,
        success: `overlay has been saved`,
      }
    );
  };

  const values: OverlayContextType = {
    headerRef,
    sidebarRef,
    canvasStyles,
    user_id,
    state: state,
    Save,
    onDrop,
    dispatch,
  };

  return <OverlayContext.Provider value={values}>{children}</OverlayContext.Provider>;
};
