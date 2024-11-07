import { Alert, AlertDescription, AlertTitle } from "@/components/ui";
import { Lock } from "lucide-react";

export const DataPrivacyAlert = () => {
  return (
    <Alert className="mt-6">
      <Lock className="h-4 w-4" />
      <AlertTitle>Your data belongs to you</AlertTitle>
      <AlertDescription>
        This app works entirely offline! At no point will your data leave your
        computer. All processing and data entered is only processed locally in
        your browser. You could disconnect from the internet now.
      </AlertDescription>
    </Alert>
  );
};
