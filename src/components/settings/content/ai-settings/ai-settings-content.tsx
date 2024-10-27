import { Sparkles } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui";
import { ModelSelector } from "./model-selector";
import { DownloadRecommendedModel } from "./download-recommended-model";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { OllamaEnabledRow } from "./ollama-enabled-row";
import { OllamaUrlRow } from "./ollama-url-row";
import { productName } from "@/lib/constants";

const AISettingsContent = () => {
  const [captionModel, setCaptionModel] = useAtom(settings.ai.caption.model);
  const [captionUserPrompt, setCaptionUserPrompt] = useAtom(
    settings.ai.caption.userPrompt
  );
  const [visionUserPrompt, setVisionUserPrompt] = useAtom(
    settings.ai.vision.userPrompt
  );
  const [visionModel, setVisionModel] = useAtom(settings.ai.vision.model);

  return (
    <Table>
      <TableBody>
        <OllamaEnabledRow />
        <OllamaUrlRow />
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
              <div>Caption User Prompt</div>
              <div className="text-muted-foreground">
                This is the user prompt given to Ollama to instruct it how to
                work with your caption parts
              </div>
              <Textarea
                rows={5}
                onChange={(e) => setCaptionUserPrompt(e.target.value)}
              >
                {captionUserPrompt}
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
              <div>Vision User Prompt</div>
              <div className="text-muted-foreground">
                This is the user prompt given to Ollama to instruct it to
                describe a given image and make recommendations for caption
                parts. The JSON part is highly important, otherwise{" "}
                {productName}
                will not understand the response.
              </div>
              <Textarea
                rows={5}
                onChange={(e) => setVisionUserPrompt(e.target.value)}
              >
                {visionUserPrompt}
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
