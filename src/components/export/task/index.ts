import { ExportTask, ExportType } from "../types";
import { CaptionTxtTask } from "./caption-txt-task";
import { SortTask } from "./sort-task";

export const tasks: Record<ExportType, ExportTask> = {
  sort: SortTask,
  "caption-txt": CaptionTxtTask,
};
