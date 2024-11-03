import { Progress } from "@/components/ui/progress";
import { useExportProgress } from "./export-progress-provider";

export const ExportProgress = () => {
  const { progress: { percentage, done, total } } = useExportProgress();
  return (
    <div className="flex gap-2 flex-col">
      <Progress value={percentage} />
      {percentage > 0 && (
        <div className="flex gap-2 items-center justify-center text-muted-foreground text-lg font-mono">
          {percentage}%{" "}
          {done > 0 && total > 0 && `(${done} / ${total})`}
        </div>
      )}
    </div>
  );
};
