import { Alert, AlertDescription, AlertTitle } from "@/components/ui"
import { TriangleAlert } from "lucide-react"

export const UnsupportedBrowserAlert = () => {
  return (
    <Alert variant={"destructive"}>
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>Unsupported Browser</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col gap-2">
          Your browser does not support the File System Access
          API which is required by this app. Please use a
          supported chromium-based browser, like Google Chrome,
          Edge, Arc or Brave.
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href="https://caniuse.com/native-filesystem-api"
          >
            Learn more ...
          </a>
        </div>
      </AlertDescription>
    </Alert>
  )
}