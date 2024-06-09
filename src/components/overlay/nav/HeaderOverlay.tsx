"use client";
import { widgetList } from "@/components/overlay/widgets/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import UseOverlay from "@/hooks/useOverlay";
import { cn } from "@/utils";
import { ArrowLeftCircle, EyeIcon, Redo2, Undo2 } from "lucide-react";
import Link from "next/link";
import { FocusEventHandler } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function HeaderOverlay() {
  const { Save, headerRef, addWidget, state } = UseOverlay();

  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.value === state.name) return;
    if (event.target.value) {
      toast.success("Page Title Updated");
    } else {
      toast.error("Page Title cannot be empty");
    }
  };

  return (
    <TooltipProvider>
      <nav className={cn("border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all")} ref={headerRef}>
        <aside className="flex items-center gap-4 max-w-[206px] w-[300px]">
          <Link href={`/dashboard/overlays`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full">
            <Input defaultValue={state.name} className="border-none h-5 m-0 p-0 text-lg" onBlur={handleOnBlurTitleChange} />
          </div>
        </aside>
        <aside className="flex flex-row items-center justify-center"></aside>
        <aside className="flex items-center gap-2">
          <Button
            // disabled={!(state.history.currentIndex > 0)}
            // onClick={handleUdo}
            variant="ghost"
            size="icon"
            className="hover:bg-slate-800 mr-4"
          >
            <Undo2 />
          </Button>
          <Button
            // disabled={!(state.history.currentIndex < state.history.history.length - 1)}
            // onClick={handleRedo}
            variant="ghost"
            size="icon"
            className="hover:bg-slate-800 mr-4"
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col items-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch
              // checked={state.editor.published}
              // onCheckedChange={handlePublish}
              />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              Laste updated {new Date(state.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <Button
          // onClick={handleOnSave}
          >
            Save
          </Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
}
