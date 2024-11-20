import { Button, ButtonProps, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import { FC } from "react";

type IconTooltipButtonProps = ButtonProps & { icon: FC; tooltip: string };

export const IconTooltipButton = (props: IconTooltipButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant={"ghost"}
            size={"icon"}
            {...props}
          >
            <props.icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {props.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}