import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { Combine, Sparkles } from "lucide-react";

export const StrategySelector = () => {
  const [strategy, setStrategy] = useAtom(settings.caption.strategy);

  return (
    <Select value={strategy} onValueChange={setStrategy}>
      <SelectTrigger>
        <SelectValue placeholder="Strategy" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"ai"}>
          <div className="flex gap-2 items-center">
            <Sparkles className="h-4 w-4" />
            AI
          </div>
        </SelectItem>
        <SelectItem value={"separator"}>
          <div className="flex gap-2 items-center">
            <Combine className="h-4 w-4" />
            Separator
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
