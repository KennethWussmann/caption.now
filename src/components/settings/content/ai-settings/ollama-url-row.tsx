import { ServiceStatusBadge } from "@/components/common/service-status-badge";
import { Input } from "@/components/ui";
import { TableCell, TableRow } from "@/components/ui/table";
import { useOllamaStatus } from "@/hooks/use-ollama-status";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";

export const OllamaUrlRow = () => {
  const { status, recheck } = useOllamaStatus();
  const [ollamaUrl, setOllamaUrl] = useAtom(settings.ai.ollamaUrl);
  return (
    <TableRow>
      <TableCell colSpan={2}>
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-row gap-4">
            <span>Ollama URL</span>
            <ServiceStatusBadge status={status} onClick={recheck} />
          </div>
          <div className="text-muted-foreground">
            Where to reach Ollama. Ideally locally, because{" "}
            <b>
              your captions and images will be shared with the destination
              server
            </b>
            .
          </div>
          <Input
            type="text"
            value={ollamaUrl}
            onChange={(e) => {
              setOllamaUrl(e.target.value);
            }}
          ></Input>
        </div>
      </TableCell>
    </TableRow>
  );
};
