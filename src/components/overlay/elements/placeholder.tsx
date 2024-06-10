import { EditorBtns } from "@/types/overlay";
import { LucideIcon } from "lucide-react";
import React from "react";
import { FaSwatchbook } from "react-icons/fa";

type Props = {
  Type: EditorBtns;
  Icon: LucideIcon;
};

export default function PlaceHolder({ Type, Icon }: Props) {
  const handleDrapStart = (e: React.DragEvent) => {
    if (Type === null) return;
    e.dataTransfer.setData("componentType", Type);
  };

  return (
    <div draggable onDragStart={handleDrapStart} className="size-14 bg-muted rounded-lg flex items-center justify-center">
      <Icon size={40} className="text-muted-foreground" />
    </div>
  );
}

interface savedComponentProps {
  component: string;
}

