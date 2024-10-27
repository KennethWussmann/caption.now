import { Switch } from "@/components/ui";
import { TableCell, TableRow } from "@/components/ui/table";
import { productName } from "@/lib/constants";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";

export const OllamaEnabledRow = () => {
  const [ollamaEnabled, setOllamaEnabled] = useAtom(settings.ai.ollamaEnabled);

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-2">
          <div>Use Ollama</div>
          <div className="text-muted-foreground">
            Allows {productName} to accelerate the captioning process by using
            state of the art open-source AI models.
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Switch checked={ollamaEnabled} onCheckedChange={setOllamaEnabled} />
      </TableCell>
    </TableRow>
  );
};
