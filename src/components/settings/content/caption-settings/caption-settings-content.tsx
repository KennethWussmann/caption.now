import { Pencil } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input, Switch } from "@/components/ui";
import { StrategySelector } from "./strategy-selector";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { CaptionPreview } from "@/components/caption/components/caption-preview";
import { CaptionPreviewAI } from "@/components/caption/components/caption-preview-ai";

const CaptionSettingsContent = () => {
  const [strategy] = useAtom(settings.caption.strategy);
  const [separator, setSeparator] = useAtom(settings.caption.separator);
  const [endWithSeparator, setEndWithSeparator] = useAtom(
    settings.caption.endWithSeparator
  );
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>Caption part combination strategy</div>
              <div className="text-muted-foreground">
                How caption parts are combined to form a single caption.
              </div>
              <div className="text-muted-foreground">
                <b>AI:</b> The caption parts are given to the AI model with
                instructions to combine them. See the AI settings for more
                customization.
              </div>
              <div className="text-muted-foreground">
                <b>Separator:</b> The caption parts are combined with a
                separator of your choice.
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <StrategySelector />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>Separator</div>
              <div className="text-muted-foreground">
                The separator to use when combining caption parts. Only applies
                if the strategy is set to "Separator".
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Input
              type="text"
              value={separator}
              onChange={(e) => {
                setSeparator(e.target.value);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>End with separator</div>
              <div className="text-muted-foreground">
                Add the separator at the end of a caption.
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Switch
              checked={endWithSeparator}
              onCheckedChange={setEndWithSeparator}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            {strategy === "ai" && <CaptionPreviewAI />}
            {strategy === "separator" && <CaptionPreview />}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const navbarItem: SettingsNavbarItem = {
  name: "Caption",
  icon: Pencil,
  content: <CaptionSettingsContent />,
};

export default navbarItem;
