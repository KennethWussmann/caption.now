import { Sparkles } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input, Switch, Textarea } from "@/components/ui";
import { ServiceStatusBadge } from "@/components/common/service-status-badge";
import { useOllamaStatus } from "@/hooks/use-ollama-status";
import { ModelSelector } from "./model-selector";
import { DownloadRecommendedModel } from "./download-recommended-model";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";

const AISettingsContent = () => {
  const { status, recheck } = useOllamaStatus();
  const [ollamaEnabled, setOllamaEnabled] = useAtom(settings.ai.ollamaEnabled);
  const [ollamaUrl, setOllamaUrl] = useAtom(settings.ai.ollamaUrl);
  const [captionModel, setCaptionModel] = useAtom(settings.ai.caption.model);
  const [captionSystemPrompt, setCaptionSystemPrompt] = useAtom(
    settings.ai.caption.systemPrompt
  );
  const [visionSystemPrompt, setVisionSystemPrompt] = useAtom(
    settings.ai.vision.systemPrompt
  );
  const [visionModel, setVisionModel] = useAtom(settings.ai.vision.model);

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
            <Switch
              checked={ollamaEnabled}
              onCheckedChange={setOllamaEnabled}
            />
          </TableCell>
        </TableRow>
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
        <TableRow>
          <TableCell colSpan={2}>
            <div className="flex flex-col gap-2">
              <div>Caption Model</div>
              <div className="text-muted-foreground">
                The model to use for refining your caption
              </div>
              <ModelSelector model={captionModel} setModel={setCaptionModel} />
              <DownloadRecommendedModel
                model={settings.ai.caption._recommendedModel}
              />
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
              <Textarea
                rows={5}
                onChange={(e) => setCaptionSystemPrompt(e.target.value)}
              >
                {captionSystemPrompt}
              </Textarea>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            <div className="flex flex-col gap-2">
              <div>Vision Model</div>
              <div className="text-muted-foreground">
                The model to use for understanding image content
              </div>
              <ModelSelector model={visionModel} setModel={setVisionModel} />
              <DownloadRecommendedModel
                model={settings.ai.vision._recommendedModel}
              />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            <div className="flex flex-col gap-2">
              <div>Vision System Prompt</div>
              <div className="text-muted-foreground">
                This system instruction is given to Ollama to instruct it to
                describe a given image and make recommendations for caption
                parts. The JSON part is highly important, otherwise QuickLabel
                will not understand the response.
              </div>
              <Textarea
                rows={5}
                onChange={(e) => setVisionSystemPrompt(e.target.value)}
              >
                {visionSystemPrompt}
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
