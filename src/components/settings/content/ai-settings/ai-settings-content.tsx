import { Sparkles } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Input,
  Switch,
  Textarea,
  Tooltip,
  TooltipTrigger,
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceStatusBadge } from "@/components/common/service-status-badge";
import { useOllamaStatus } from "@/hooks/use-ollama-status";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { ModelSelector } from "./model-selector";

const AISettingsContent = () => {
  const { status, recheck } = useOllamaStatus();
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>Use Ollama</div>
              <div className="text-muted-foreground">
                Allows QuickLabel to join caption parts into more natural
                language captions
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Switch />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            <div className="flex flex-col gap-2 items-start">
              <div className="flex flex-row gap-4">
                <div>Ollama URL</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ServiceStatusBadge status={status} onClick={recheck} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to refresh</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-muted-foreground">
                Where to reach Ollama. Ideally locally, because your prompt will
                be shared with the destination server.
              </div>
              <Input type="text" value="http://localhost:12345"></Input>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            <div className="flex flex-col gap-2">
              <div>Caption Model</div>
              <div className="text-muted-foreground">
                The model to use for refining your caption
              </div>
              <ModelSelector />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            <div className="flex flex-col gap-2">
              <div>Caption System Prompt</div>
              <div className="text-muted-foreground">
                This system instruction is given to Ollama to instruct it how to
                work with your caption parts
              </div>
              <Textarea rows={10}>
                You are an AI prompt refining assistant. The user is giving you
                a rough prompt. Sometimes only containing tags, sometimes
                containing entire sentences. The order of the sentences is
                important. You are asked to understand and combine the sentences
                logically and grammatically. You are asked to generate a refined
                prompt that is more grammatically correct. You shall not add any
                details that the user didn't mention. You are allowed to add
                periods where necessary. Only reply with the refined prompt, do
                not add any additional text.
              </Textarea>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const navbarItem: SettingsNavbarItem = {
  name: "AI",
  icon: Sparkles,
  content: <AISettingsContent />,
};

export default navbarItem;
