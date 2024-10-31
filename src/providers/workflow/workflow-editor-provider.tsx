"use client";

import TriggerWorkflow from "@/actions/backend";
// import { SaveWorkflow } from "@/actions/workflows";
import type { EditorActions, EditorState } from "@/types/workflow";
import { addEdge, applyEdgeChanges, applyNodeChanges, OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import { usePathname } from "next/navigation";
import { createContext, Dispatch, useCallback, useReducer } from "react";
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import { toast } from "sonner";
import { useModal } from "../modal-provider";
import { setParentNodes, setSelectedNode, updateMetadata } from "./workflow-editor-actions";
import { useSession } from "../session-provider";
import { SaveWorkflow } from "@/actions/workflows";

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
      if (!action.payload.logs) return state;
      return {
        ...state,

        editor: {
          ...state.editor,
          logs: action.payload.logs,
        },
      };

    default:
      return state;
  }
};

interface WorkflowEditorContextType {
  handleSave: () => Promise<void>;
  TestWorkflow: (trigger_details: Record<string, any>) => void;
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
  const { closeModal } = useModal();
  const { user } = useSession();
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

    // toast.info("todo fix save ");
  };

  function TestWorkflow(data: Record<string, any>) {
    dispatch({ type: "UPDATE_LOGS", payload: { logs: [] } });
    closeModal();
    toast.promise(
      TriggerWorkflow({
        workflow_id: state.editor.workflowDetails.workflow_id,
        user_id: state.editor.workflowDetails.user_id,
        trigger_details: JSON.stringify(data),
        broadcaster_id: user?.user_metadata.sub,
      }),
      {
        loading: "Testing workflow ...",
        success(data) {
          dispatch({ type: "UPDATE_LOGS", payload: { logs: data.node_responses } });
          const error = data.node_responses.find((node) => node.status === "error");
          const warning = data.node_responses.find((node) => node.status === "warning");

          if (error) {
            return (
              <div className="flex items-center">
                <MdError size={20} />
                <span className="ml-2">Workflow completed with errors</span>
              </div>
            );
          }

          if (warning) {
            return (
              <div className="flex items-center">
                <IoIosWarning size={20} />
                <span className="ml-2">Workflow completed with warnings</span>
              </div>
            );
          }

          return "Workflow test successful";
        },

        error(error) {
          return "Could not trigger workflow";
        },
      }
    );
  }

  const values: WorkflowEditorContextType = {
    handleSave,
    state,
    dispatch,
    onNodesChange,
    onEdgesChange,
    onConnect,
    TestWorkflow,
  };

  return <WorkflowEditorContext.Provider value={values}>{props.children}</WorkflowEditorContext.Provider>;
};

export default WorkFlowEditorProvider;
