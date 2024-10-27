import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { ArrowRight } from "lucide-react";
import { Table, TableBody } from "../ui/table";
import { OllamaEnabledRow } from "../settings/content/ai-settings/ollama-enabled-row";
import { OllamaUrlRow } from "../settings/content/ai-settings/ollama-url-row";
import { productName } from "@/lib/constants";
import { useOllamaStatus } from "@/hooks/use-ollama-status";

export const OnboardingDialog = () => {
  const [isOllamaEnabled] = useAtom(settings.ai.ollamaEnabled);
  const { isOnline } = useOllamaStatus();
  const [onboardingComplete, setOnboardingComplete] = useAtom(
    settings.onboardingCompleted
  );

  const isButtonDisabled = isOllamaEnabled ? !isOnline : false;

  return (
    <Dialog open={!onboardingComplete}>
      <DialogContent className="sm:max-w-[425px]" hideClose>
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>
            Let's get you started by setting up a few things. You can always
            change this later in the settings.
            <br />
            <br />
            <b>
              Ollama is a tool that you would need to install manually in
              addition to {productName}.
            </b>{" "}
            It allows {productName} to accelerate the captioning process by
            using state of the art open-source AI models.
            <br />
            <br />
            <b>
              Your images and captions will be sent to this Ollama server. So be
              sure to use an instance you operate and trust, ideally, on your
              local machine!
            </b>{" "}
            If you decide to disable Ollama, {productName} will not communicate
            with any external server and your data stays on your machine!
            <br />
            <br />
            We recommend you to enable Ollama and set up the URL to your local
            Ollama instance.
            <br />
            <br />
            <a
              href="https://ollama.com/"
              className="text-blue-500 hover:underline"
            >
              Read more about Ollama ...
            </a>
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableBody>
            <OllamaEnabledRow />
            <OllamaUrlRow />
          </TableBody>
        </Table>
        <DialogFooter>
          <Button
            onClick={() => setOnboardingComplete(true)}
            disabled={isButtonDisabled}
          >
            <ArrowRight className="h-4 w-4" />
            Let's go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
