import { components, overlay, widgets } from "@/types/overlay";

export interface OverlayAction {
  type: "OVERRIDE_STATE" | "ADD_WIDGET" | "REMOVE_WIDGET" | "UPDATE_WIDGET" | "UPDATE_COMPONENT";
  payload: any;
}

export function overlayReducer(state: overlay, action: OverlayAction): overlay {
  switch (action.type) {
    case "OVERRIDE_STATE":
      return action.payload;

    case "ADD_WIDGET":
      return {
        ...state,
        widgets: [...state.widgets, action.payload],
      };
    case "REMOVE_WIDGET":
      return {
        ...state,
        widgets: state.widgets.filter((widget: widgets) => widget.id !== action.payload),
      };
    case "UPDATE_WIDGET":
      return {
        ...state,
        widgets: state.widgets.map((widget: widgets) =>
          widget.id === action.payload.id
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
    case "UPDATE_COMPONENT":
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
