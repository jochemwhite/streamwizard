import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface TooltipProps {
  children: React.ReactNode;
  description: string;
}

export function ToolTipButton({ children, description }: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}