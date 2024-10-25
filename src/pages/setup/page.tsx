import { Alert, AlertDescription, AlertTitle, Button } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDatasetDirectory } from "@/lib/dataset-directory-provider";
import {
  FileText,
  FolderOpen,
  Image,
  LoaderCircle,
  Lock,
  Pencil,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Page() {
  const navigate = useNavigate();
  const {
    supported,
    openDirectoryPicker,
    isDirectorySelected,
    isDirectoryLoaded,
    isEmpty,
    isAccessDenied,
    imageFiles,
    textFiles,
    reset,
  } = useDatasetDirectory();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="mx-auto max-w-sm">
        {isDirectorySelected && isDirectoryLoaded && !isEmpty ? (
          <Card className="border-green-100 ">
            <CardHeader>
              <CardTitle>Let's Go!</CardTitle>
              <CardDescription>
                Your dataset was loaded successfully, start labelling your
                images now.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-2 items-center">
                  <Image className="h-8 w-8" /> {imageFiles.length} Images
                </div>
                <div className="flex gap-2 items-center">
                  <FileText className="h-8 w-8" /> {textFiles.length} Labels
                </div>
                <div>
                  <Button className="w-full mt-4" onClick={() => navigate("/")}>
                    <Pencil /> Start Labelling
                  </Button>
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className="w-full mt-4"
                    onClick={reset}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome!</CardTitle>
              <CardDescription>
                To start labelling your images, select a directory from your
                computer that contains all images.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAccessDenied && (
                <Alert variant={"destructive"} className="mb-4">
                  <TriangleAlert className="h-4 w-4" />
                  <AlertTitle>Access Denied!</AlertTitle>
                  <AlertDescription>
                    Your browser denied access to select a directory. Please
                    check your browser settings and reload the page.
                  </AlertDescription>
                </Alert>
              )}

              {isDirectoryLoaded && isEmpty && (
                <Alert variant={"destructive"} className="mb-4">
                  <TriangleAlert className="h-4 w-4" />
                  <AlertTitle>No images found</AlertTitle>
                  <AlertDescription>
                    The directory you selected does not contain any images.
                    Please select a different directory that contains JPEG, JPG
                    or PNG files.
                  </AlertDescription>
                </Alert>
              )}

              {(!isDirectorySelected || isEmpty) && (
                <>
                  {!supported && (
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
                  )}
                  {supported && (
                    <Button className="w-full" onClick={openDirectoryPicker}>
                      <FolderOpen /> Select Directory
                    </Button>
                  )}
                </>
              )}

              {isDirectorySelected && !isDirectoryLoaded && (
                <Alert className="border-blue-500">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <AlertTitle>Loading Dataset</AlertTitle>
                  <AlertDescription>
                    Hang tight! We are loading your dataset. Depending on the
                    size this might take a while.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Alert className="mt-4">
          <Lock className="h-4 w-4" />
          <AlertTitle>Your data belongs to you!</AlertTitle>
          <AlertDescription>
            This app works entirely offline! At no point will your data leave
            your computer. You could disconnect from the internet now.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}