import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEditor } from "@/hooks/UseWorkflowEditor";
import { logs } from "@/types/workflow";
import { useEffect } from "react";
import { Button } from "../ui/button";

type LogEntry = {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
};

const LogEntry = ({ entry }: { entry: logs }) => {
  const { state, dispatch } = useEditor();
  // get node by id

 const getnode = state.editor.nodes.find((node) => node.id === entry.node_id)


 if(!getnode) return null


  const handleClick = () => {
    dispatch({ type: "SELECTED_NODE", payload: { id: getnode.id } });
    dispatch({ type: "SET_SIDEBAR", payload: { sidebar: "settings" } });
  };


  const levelColors = {
    success: "bg-green-500 text-blue-100",
    warning: "bg-orange-500 text-yellow-100",
    error: "bg-red-900 text-red-100",
    trigger: "bg-blue-500 text-blue-100",
  };

  return (
    <div className="py-2 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center justify-between">
        <Button onClick={handleClick} variant="link" className="text-sm text-gray-400 !p-0  ">{getnode.data.title as string} </Button>
        <Badge className={levelColors[entry.status]}>{entry.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-gray-200">{entry.message}</p>
    </div>
  );
};

export default function LogViewer() {
  const { state } = useEditor();

  return (
    <div className="w-full  mx-auto rounded-lg overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4">
          {state.editor.logs.map((log, index) => (
            <LogEntry key={index} entry={log} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
