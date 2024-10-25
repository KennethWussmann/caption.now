import { Alert, AlertDescription, AlertTitle, Button } from "@/components/ui";
import { BackgroundLines } from "@/components/ui/animation/background-lines";
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
import { motion } from "framer-motion";

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

  const isReady = isDirectorySelected && isDirectoryLoaded && !isEmpty;

  return (
    <BackgroundLines
      className="flex items-center justify-center h-screen"
      disabled={!isReady}
    >
      <div className="mx-auto max-w-sm z-50">
        {isReady ? (
          <Card className="bg-transparent backdrop-blur-sm">
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
                  <motion.button
                    initial={{
                      scale: 3,
                      opacity: 0,
                      filter: "blur(8px)",
                      y: -50,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 20,
                      duration: 0.5,
                      delay: 0.2,
                    }}
                    onClick={() => navigate("/")}
                    className="w-full mt-4 relative inline-flex h-12 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      <Pencil className="mr-2 h-4 w-4" /> Start Labelling
                    </span>
                  </motion.button>
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
          <Card className="bg-transparent backdrop-blur-sm">
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

        <Alert className="mt-4 bg-transparent backdrop-blur-sm">
          <Lock className="h-4 w-4" />
          <AlertTitle>Your data belongs to you!</AlertTitle>
          <AlertDescription>
            This app works entirely offline! At no point will your data leave
            your computer. You could disconnect from the internet now.
          </AlertDescription>
        </Alert>
      </div>
    </BackgroundLines>
  );
}
