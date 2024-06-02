"use client";
import { components, overlay, widgets } from "@/types/overlay";
import { ReactNode, createContext, useEffect, useReducer, useRef, useState } from "react";
import { toast } from "sonner";
import { useWindowSize } from "usehooks-ts";
import Draggable, { DraggableData } from "react-draggable";
import Sidebar from "@/components/nav/sidebar";

// Define the type for the context
export interface OverlayContextType {
  addWidget: (widget: widgets) => void;
  delWidget: (widgetId: string) => void;
  onDrop: (updatedWidget: widgets, data: DraggableData) => void;
  updateComponentContent: (widgetID: string, componentID: string, Content?: string, styles?: React.CSSProperties) => void;
  updateWidget: (widget: widgets, styles?: React.CSSProperties) => void;
  Save: () => void;

  activeWidget?: widgets;
  setActiveWidget?: (widget: widgets) => void;

  
}

// Create the context with TypeScript type
export const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

enum OverlayActionKind {
  OVERRIDE_STATE = "OVERRIDE_STATE",
  ADD_WIDGET = "ADD_WIDGET",
  REMOVE_WIDGET = "REMOVE_WIDGET",
  UPDATE_WIDGET = "UPDATE_WIDGET",
  UPDATE_COMPONENT = "UPDATE_COMPONENT",
}

interface OverlayAction {
  type: OverlayActionKind;
  payload: any;
}

const initialState: overlay = {
  id: "",
  height: 0,
  name: "",
  widgets: [],
  width: 0,
  created_at: "",
  user_id: "",
};

function overlayReducer(state: overlay, action: OverlayAction): overlay {
  switch (action.type) {
    case OverlayActionKind.OVERRIDE_STATE:
      return action.payload;

    case OverlayActionKind.ADD_WIDGET:
      return {
        ...state,
        widgets: [...state.widgets, action.payload],
      };
    case OverlayActionKind.REMOVE_WIDGET:
      return {
        ...state,
        widgets: state.widgets.filter((widget: widgets) => widget.id !== action.payload),
      };
    case OverlayActionKind.UPDATE_WIDGET:
      return {
        ...state,
        widgets: state.widgets.map((widget: widgets) =>
          widget.id === action.payload.widgetID
            ? {
                ...widget,
                x_axis: action.payload.x_axis,
                y_axis: action.payload.y_axis,
                styles: {
                  ...widget.styles,
                  ...(action.payload.styles || {}),
                },
              }
            : widget
        ),
      };
    case OverlayActionKind.UPDATE_COMPONENT:
      return {
        ...state,
        widgets: state.widgets.map((widget: widgets) =>
          widget.id === action.payload.widgetID
            ? {
                ...widget,
                components: widget.components?.map((component: components) =>
                  component.id === action.payload.componentID
                    ? {
                        ...component,
                        settings: {
                          ...component.settings,
                          ...(action.payload.settings || {}),
                        },
                        styles: {
                          ...component.styles,
                          ...(action.payload.styles || {}),
                        },
                        content: action.payload.content !== undefined ? action.payload.content : component.content,
                      }
                    : component
                ),
              }
            : widget
        ),
      };
    default:
      return state;
  }
}

interface Props {
  children: ReactNode;
  overlay: overlay;
}

export const OverlayProvider = ({ children, overlay }: Props) => {
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [canvasStyles, setCanvasStyles] = useState({} as React.CSSProperties);
  const [scale, setScale] = useState<number>(0);
  const [activeWidget, setActiveWidget] = useState<widgets>();
  const [state, dispatch] = useReducer(overlayReducer, initialState);

  const loadOverlay = () => {
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
        type: OverlayActionKind.OVERRIDE_STATE,
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
  };

  useEffect(() => {
    loadOverlay();
  }, [screenWidth, screenHeight]);

  const addWidget = (widget: widgets) => {
    dispatch({
      type: OverlayActionKind.ADD_WIDGET,
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
      type: OverlayActionKind.REMOVE_WIDGET,
      payload: widgetId,
    });
  };

  const onDrop = (updatedWidget: widgets, data: DraggableData) => {
    dispatch({
      type: OverlayActionKind.UPDATE_WIDGET,
      payload: {
        ...updatedWidget,
        x_axis: data.x.toString(),
        y_axis: data.y.toString(),
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

    dispatch({ type: OverlayActionKind.UPDATE_COMPONENT, payload });
  };

  const updateWidget = (widget: widgets, styles?: React.CSSProperties) => {
    dispatch({
      type: OverlayActionKind.UPDATE_WIDGET,
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
  };

  return (
    <OverlayContext.Provider value={values}>
      <div className="flex">
        <div ref={sidebarRef}>
          <Sidebar>
            <SidebarOverlay
              widget={state.widgets.find((widget) => widget.widgetID === activeWidget?.widgetID)}
              updateComponent={updateComponentContent}
              updateWidget={updateWidget}
            />
          </Sidebar>
        </div>
        <div className="w-full">
          <div ref={headerRef}>
            <Header>
              <HeaderOverlay Save={Save} addWidget={addWidget} />
            </Header>
          </div>
          <div>
            <div className="bg-green-950 relative" style={canvasStyles}>
              {state?.widgets.map((widget, index) => {
                return (
                  <Draggable
                    bounds="parent"
                    scale={scale}
                    key={index}
                    position={{ x: +widget.x_axis, y: +widget.y_axis }}
                    onStop={(e, data) => {
                      onDrop(widget, data);
                    }}
                  >
                    <div className="inline-block absolute overflow-hidden">
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <div
                            style={widget.styles}
                            onClick={() => {
                              setActiveWidget(widget);
                            }}
                          >
                            <RenderComponents widget={widget} />
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-64">
                          <ContextMenuItem
                            inset
                            onClick={() => {
                              delWidget(widget.widgetID);
                            }}
                          >
                            Delete
                            <ContextMenuShortcut>del</ContextMenuShortcut>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </div>
                  </Draggable>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </OverlayContext.Provider>
  );
};
