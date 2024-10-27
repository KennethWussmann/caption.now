import { ServiceStatusBadge } from "@/components/common/service-status-badge";
import { Input } from "@/components/ui";
import { TableCell, TableRow } from "@/components/ui/table";
import { useOllamaStatus } from "@/hooks/use-ollama-status";
import { productName } from "@/lib/constants";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";

export const OllamaUrlRow = () => {
  const { status, recheck, isReachable } = useOllamaStatus();
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
          />
          {!isReachable && (
            <div className="text-destructive">
              The security policies of modern browsers prevent us from reaching
              the Ollama server. This happens if the Ollama server is not served
              via HTTPS, but {productName} is. You can only use Ollma with this
              constellation, if it is served on localhost. Alternatively, you
              can serve Ollama via HTTPS. <br />
              <a
                href="https://github.com/KennethWussmann/caption.now/tree/main/docs/ollama.md"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
