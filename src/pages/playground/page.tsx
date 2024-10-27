import { Button } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

export default function Page() {
  const { toast } = useToast();
  const showToast = () => {
    console.log("Triggering toast");
    const result = toast({
      title: "Hello world",
      description: "This is a toast",
      duration: Infinity,
      action: (
        <Button>
          <RefreshCw />
          Refresh
        </Button>
      ),
    });
    console.log("Toast triggered", result);
  };
  return (
    <div className="flex flex-col gap-4 justify-center align-middle items-center mt-40">
      <h1 className="text-4xl">Playground</h1>
      <Button onClick={showToast}>Show toast</Button>
    </div>
  );
}
