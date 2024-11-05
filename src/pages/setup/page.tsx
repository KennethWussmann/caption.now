import { BackgroundLines } from "@/components/ui/animation/background-lines";
import { useState } from "react";
import { SelectActionView } from "./select-action-view";
import { SelectDirectoryView } from "./select-directory-view";
import { LoadingDatasetView } from "./loading-dataset-view";
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";

type SetupStep = "select-directory" | "loading" | "select-action";

export default function Page() {
  const [step, setStep] = useState<SetupStep>("select-directory");
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [isEmpty, setEmpty] = useState(false);
  const { reset } = useDatasetDirectory()
  
  const handleCancel = () => {
    reset()
    setStep("select-directory")
  }

  return (
    <BackgroundLines
      className="flex items-center justify-center h-screen"
      disabled
    >
      <div className="mx-auto max-w-md z-50">
        {step === "select-action" && (
          <SelectActionView onCancel={handleCancel} />
        )}
        {step === "loading" && directoryHandle && (
          <LoadingDatasetView
            directoryHandle={directoryHandle}
            onDone={() => setStep("select-action")} onEmptyDataset={() => {
              setStep("select-directory")
              setEmpty(true)
            }}
          />
        )}
        {step === "select-directory" && (
          <SelectDirectoryView
            onSelected={(handle) => {
              setEmpty(false)
              setStep("loading")
              setDirectoryHandle(handle)
            }}
            isEmpty={isEmpty}
          />
        )}
      </div>
    </BackgroundLines >
  );
}
