import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import CustomHandle from "./custom-handle";
import EditorCanvasIconHelper from "./editor-canvas-card-icon-hepler";
import { MdOutlineMessage } from "react-icons/md";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useEditor } from "@/hooks/UseWorkflowEditor";
import { cn, getNode } from "@/lib/utils";
import { Action, ErrorLogs, integrationTypes, NodeTypes } from "@/types/workflow";
import { Position, useNodeId } from "@xyflow/react";
import clsx from "clsx";
import { Zap } from "lucide-react";
import { useModal } from "@/providers/modal-provider";
import ChannelRaidForm from "./trigger-forms/channel_raid_form";
import { useSession } from "next-auth/react";

const EditorCanvasCardSingle = ({ data }: { data: Action }) => {
  const { data: session } = useSession();
  if (!session) return null;

  const { dispatch, state } = useEditor();
  const [isSelcted, setIsSelected] = useState(false);
  const { openModal } = useModal();
  const nodeId = useNodeId();

  const update_logs = (error?: ErrorLogs, responses?: Record<string, string>) => {
    dispatch({ type: "UPDATE_LOGS", payload: { logs: { node_errors: error, node_responses: responses, started_at: new Date() } } });
  };

  useEffect(() => {
    if (state.editor.selectedNode) {
      setIsSelected(state.editor.selectedNode.id === nodeId);
    }
  }, [state.editor.selectedNode, nodeId]);

  const handleDelete = () => {
    if (nodeId) {
      dispatch({ type: "DELETE_NODE", payload: { id: nodeId } });

      if (data.nodeType === "Trigger") {
        dispatch({ type: "SET_SIDEBAR", payload: { sidebar: "triggers" } });
      } else {
        dispatch({ type: "SET_SIDEBAR", payload: { sidebar: "actions" } });
      }
    }
  };

  const Icon = () => {
    const nodeType = data.nodeType as NodeTypes;
    const integration = data.integration as unknown as string;
    const integrationType = data.type as integrationTypes;

    const Node = getNode({
      integration,
      integrationType,
      nodeType,
    });

    return Node?.icon ? <Node.icon size={30} /> : <Zap size={30} />;
  };

  const handleTriggerClick = () =>
    openModal(
      <ChannelRaidForm
        broadcaster_display_name={session.user.name!}
        broadcaster_id={session.user.broadcaster_id}
        JWT={session.supabaseAccessToken!}
        workflow={state.editor.workflowDetails}
        update_logs={update_logs}
      />
    );

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {data.nodeType !== "Trigger" && <CustomHandle type="target" position={Position.Top} style={{ zIndex: 100 }} />}
        <Card
          className={cn("relative max-w-[400px]", {
            "dark:border-muted-foreground/70": isSelcted === true,
          })}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <div>
              <Icon />
            </div>
            <div>
              <CardTitle className="text-md">{data.title}</CardTitle>
              <CardDescription>
                <p className="text-xs text-muted-foreground/50">
                  <b className="text-muted-foreground/80">ID: </b>
                  {nodeId}
                </p>
                <p>{data.description}</p>
              </CardDescription>
            </div>
          </CardHeader>
          <Badge variant="secondary" className="absolute right-2 top-2">
            {data.nodeType}
          </Badge>
          <div
            className={clsx("absolute left-3 top-4 h-2 w-2 rounded-full", {
              "bg-green-500": Math.random() < 0.6,
              "bg-orange-500": Math.random() >= 0.6 && Math.random() < 0.8,
              "bg-red-500": Math.random() >= 0.8,
            })}
          />
        </Card>
        <CustomHandle type="source" position={Position.Bottom} id="a" />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={handleDelete}>
          See Details
          <ContextMenuShortcut>alt + I</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onClick={handleTriggerClick}>
          Test Workflow
          <ContextMenuShortcut>alt + T</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onClick={handleDelete}>
          Delete
          <ContextMenuShortcut>Backspace</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default EditorCanvasCardSingle;
