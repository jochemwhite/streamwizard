"use client";

import { SaveWorkflow } from "@/actions/workflows";
import type { EditorActions, EditorState } from "@/types/workflow";
import { addEdge, applyEdgeChanges, applyNodeChanges, OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import { usePathname } from "next/navigation";
import { createContext, Dispatch, useCallback, useReducer } from "react";
import { toast } from "sonner";
import { setParentNodes, setSelectedNode, updateMetadata } from "./workflow-editor-actions";

// update metadata based on node id

const initialEditorState: EditorState["editor"] = {
  nodes: [],
  edges: [],
  logs: [],
  selectedNode: null,
  parentNodes: null,
  sidebar: "triggers",
  workflowDetails: { workflow_id: "", name: "", description: "", user_id: "" },

};

const initialState: EditorState = {
  editor: initialEditorState,
};

const editorReducer = (state: EditorState = initialState, action: EditorActions): EditorState => {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...state,
        editor: {
          ...state.editor,
          nodes: action.payload.nodes || initialEditorState.nodes,
          edges: action.payload.edges || initialEditorState.edges,
          workflowDetails: action.payload.workflowDetails || initialEditorState.workflowDetails,
        },
      };

    case "UPDATE_NODES":
      return {
        ...state,
        editor: {
          ...state.editor,
          nodes: applyNodeChanges(action.payload.nodes, state.editor.nodes),
        },
      };

    case "UPDATE_EDGES":
      return {
        ...state,
        editor: {
          ...state.editor,
          edges: applyEdgeChanges(action.payload.edges, state.editor.edges),
        },
      };

    case "ON_CONNECT":
      return {
        ...state,
        editor: {
          ...state.editor,
          edges: addEdge(action.payload.connection, state.editor.edges),
        },
      };
    case "SELECTED_NODE":
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedNode: setSelectedNode(state.editor.nodes, action.payload.id),
          parentNodes: setParentNodes(state.editor.nodes, state.editor.edges, action.payload.id!),
        },
      };

    case "ADD_NODE":
      return {
        ...state,
        editor: {
          ...state.editor,
          nodes: [...state.editor.nodes, action.payload.node],
          selectedNode: action.payload.node,
          sidebar: "settings",
        },
      };

    case "UPDATE_METADATA":
      if ("id" in action.payload) {
        const new_nodes = updateMetadata(state.editor.nodes, action.payload.id, action.payload.metadata);
        const new_selected_node = setSelectedNode(new_nodes, action.payload.id);

        return {
          ...state,
          editor: {
            ...state.editor,
            nodes: new_nodes,
            selectedNode: new_selected_node,
          },
        };
      }
      return state;

    case "SET_SIDEBAR":
      return {
        ...state,
        editor: {
          ...state.editor,
          sidebar: action.payload.sidebar,
        },
      };

    case "DELETE_NODE":
      const new_nodes = state.editor.nodes.filter((node) => node.id !== action.payload.id);
      const new_selected_node = setSelectedNode(new_nodes, null);

      // delete all edges that have this node
      const new_edges = state.editor.edges.filter((edge) => edge.source !== action.payload.id && edge.target !== action.payload.id);
      return {
        ...state,
        editor: {
          ...state.editor,
          nodes: new_nodes,
          edges: new_edges,
          selectedNode: new_selected_node,
        },
      };

    case "UPDATE_LOGS":
      if(!action.payload.logs) return state
      return {
        ...state,

        editor: {
          ...state.editor,
          logs: [...state.editor.logs, action.payload.logs],
          
        },
      };

    default:
      return state;
  }
};

interface WorkflowEditorContextType {
  handleSave: () => Promise<void>;
  state: EditorState;
  dispatch: Dispatch<EditorActions>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

export const WorkflowEditorContext = createContext<WorkflowEditorContextType | null>(null);

type EditorProps = {
  children: React.ReactNode;
};

const WorkFlowEditorProvider = (props: EditorProps) => {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => dispatch({ type: "UPDATE_NODES", payload: { nodes: changes } }),
    [state.editor.nodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback((changes) => dispatch({ type: "UPDATE_EDGES", payload: { edges: changes } }), [dispatch]);
  const onConnect: OnConnect = useCallback((connection) => dispatch({ type: "ON_CONNECT", payload: { connection } }), [dispatch]);

  const handleSave = async () => {
    const path = pathname.split("/").pop();

    const edges = JSON.stringify(state.editor.edges);

    const nodes = JSON.stringify(state.editor.nodes);

    toast.promise(SaveWorkflow(path!, nodes, edges), {
      loading: "Saving workflow",
      success: "Workflow saved",
      error: "Failed to save workflow",
    });
  };

  const values: WorkflowEditorContextType = {
    handleSave,
    state,
    dispatch,
    onNodesChange,
    onEdgesChange,
    onConnect,
  };

  return <WorkflowEditorContext.Provider value={values}>{props.children}</WorkflowEditorContext.Provider>;
};

export default WorkFlowEditorProvider;
