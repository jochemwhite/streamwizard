import type { Connection, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import type React from "react";
import { IconType } from "react-icons/lib";

type TwitchTriggersTypes =
  | "channel.channel_points_custom_reward_redemption.add"
  | "channel.ad_break.begin"
  | "channel.raid"
  | "channel.shoutout.create"
  | "channel.shoutout.receive";
type TwitchActionsTypes =
  | "custom_reward_update"
  | "send_chat_message"
  | "get_ad_schedule"
  | "send_chat_announcement"
  | "add_channel_vip"
  | "remove_channel_vip"
  | "get_channel_vip"
  | "send_shoutout";

type Actions = TwitchActionsTypes;
type Triggers = TwitchTriggersTypes;

export type integrationTypes = Actions | Triggers;

export type NodeTypes = "Action" | "Trigger";

export type Metadata = Record<string, string>;

export type ErrorLogs = {
  error_message: string;
  shouldTurnOffWorkflow: boolean;
  originalError: Error;
};

export type logs = {
  node_id: string;
  message: string;
  status: "success" | "error" | "warning";
  started_at: Date;
  data?: any;
};

export type workflowDetails = {
  workflow_id: string;
  name: string;
  description: string;
  user_id: string;
};

export type WorkflowEditor = {
  nodes: Node[];
  edges: Edge[];
  logs: logs[];
  selectedNode: Node | null;
  parentNodes: Node[] | null;
  sidebar: "triggers" | "actions" | "settings" | "logs";
  workflowDetails: workflowDetails;
};
export type EditorState = {
  editor: WorkflowEditor;
  // history for in the future
};

export type EditorCanvasCardType = {
  title: string;
  description: string;
  metadata: Metadata;
  type: Triggers | Actions;
};

export type EditorActions =
  | { type: "LOAD_DATA"; payload: { nodes: Node[]; edges: Edge[]; workflowDetails: workflowDetails } }
  | { type: "UPDATE_NODE"; payload: { nodes: Node } }
  | { type: "SELECTED_NODE"; payload: { id: string | null } }
  | { type: "UPDATE_METADATA"; payload: { id: string; metadata: Metadata } }
  | { type: "UPDATE_NODES"; payload: { nodes: NodeChange<Node>[] } }
  | { type: "UPDATE_EDGES"; payload: { edges: EdgeChange[] } }
  | { type: "ON_CONNECT"; payload: { connection: Connection } }
  | { type: "ADD_NODE"; payload: { node: Node } }
  | { type: "SET_SIDEBAR"; payload: { sidebar: "triggers" | "actions" | "settings" } }
  | { type: "DELETE_NODE"; payload: { id: string } }
  | { type: "UPDATE_LOGS"; payload: { logs?: logs[] } };

export type EditorCanvasDefaultCardType = {
  [provider: string]: {
    actions: Action[];
    triggers: Trigger[];
  };
};

export type Trigger = {
  id: string;
  title: string;
  description: string;
  type: Triggers;
  event_id: string | null;
  nodeType: NodeTypes;
  metaData?: Metadata;
  settingsComponent?: React.FC;
  icon?: IconType;
  placeholders?: string[];
  integration?: string;
};

export type Action = {
  id: string;
  title: string;
  description: string;
  type: Actions;
  nodeType: NodeTypes;
  metaData?: Metadata;
  icon?: IconType;
  placeholders?: string[];
  integration?: string;
};
