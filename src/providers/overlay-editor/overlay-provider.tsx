"use client";
import { widgetList } from "@/components/overlay/widgets/widgets";
import { components, overlay, widgets } from "@/types/overlay";
import { Dispatch, MutableRefObject, ReactNode, createContext, useEffect, useReducer, useRef, useState } from "react";
import { DraggableData } from "react-draggable";
import { toast } from "sonner";
import { useWindowSize } from "usehooks-ts";
import { OverlayAction, overlayReducer } from "./overlay-actions";

// Define the type for the context
export interface OverlayContextType {
  addWidget: (widget: widgets) => void;
  delWidget: (widgetId: string) => void;
  onDrop: (updatedWidget: widgets, data: DraggableData) => void;
  updateComponentContent: (widgetID: string, componentID: string, Content?: string, styles?: React.CSSProperties) => void;
  updateWidget: (widget: widgets, styles?: React.CSSProperties) => void;
  Save: () => void;
  user_id: string;

  activeWidget?: widgets;
  setActiveWidget: (widget: widgets) => void;

  canvasStyles: React.CSSProperties;
  sidebarRef: MutableRefObject<HTMLDivElement | null>;
  headerRef: MutableRefObject<HTMLDivElement | null>;

  scale?: number;
  state: overlay;

  dispatch: Dispatch<OverlayAction>
}

// Create the context with TypeScript type
export const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

const initialState: overlay = {
  id: "",
  height: 0,
  name: "",
  widgets: [],
  width: 0,
  created_at: "",
  user_id: "",
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
  const [activeWidget, setActiveWidget] = useState<widgets>();
  const [state, dispatch] = useReducer(overlayReducer, initialState);



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
      dispatch({
        type: "OVERRIDE_STATE",
        payload: {
          ...res,
          widgets: res.widgets.map((widgets) => {
            return {
              ...widgets,
              styles: JSON.parse(widgets.styles as string) as React.CSSProperties,
              components: widgets.components?.map((components) => {
                return {
                  ...components,
                  styles: JSON.parse(components.styles as string),
                  settings: JSON.parse(components.settings),
                };
              }),
            };
          }),
        } as overlay,
      });
    }
  }, [screenWidth, screenHeight]);

  const addWidget = (widget: widgets) => {
    dispatch({
      type: "ADD_WIDGET",
      payload: {
        ...widget,
        x_axis: "0",
        y_axis: "0",
        widgetID: crypto.randomUUID(),
      },
    });
  };

  
  const delWidget = (widgetId: string) => {
    dispatch({
      type: "REMOVE_WIDGET",
      payload: widgetId,
    });
  };

  const onDrop = (updatedWidget: widgets, data: DraggableData) => {
    dispatch({
      type: "UPDATE_WIDGET",
      payload: {
        ...updatedWidget,
        x_axis: data.x,
        y_axis: data.y,
      },
    });
    setActiveWidget(updatedWidget);
  };

  const updateComponentContent = (widgetID: string, componentID: string, Content?: string, styles?: React.CSSProperties) => {
    const payload = {
      widgetID,
      componentID,
      content: Content,
      styles: styles,
    };

    dispatch({ type: "UPDATE_COMPONENT", payload });
  };

  const updateWidget = (widget: widgets, styles?: React.CSSProperties) => {
    dispatch({
      type: "UPDATE_WIDGET",
      payload: {
        ...widget,
        styles: styles,
      },
    });
  };

  const Save = async () => {
    if (state.widgets.length === 0) {
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
    addWidget,
    delWidget,
    onDrop,
    updateComponentContent,
    updateWidget,
    Save,
    setActiveWidget,
    dispatch,
    canvasStyles,
    activeWidget,
    headerRef,
    sidebarRef,
    state,
    scale,
    user_id,
  };

  return <OverlayContext.Provider value={values}>{children}</OverlayContext.Provider>;
};
