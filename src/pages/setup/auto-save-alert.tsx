import { Alert, AlertDescription, AlertTitle } from "@/components/ui";
import { Save } from "lucide-react";
import { motion } from "framer-motion";

export const AutoSaveAlert = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)", y: -20 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(4px)", y: 20 }}
      transition={{ duration: 0.2, delay: 0.5 }}
      className="bg-transparent backdrop-blur-sm"
    >
      <Alert className="border-none bg-transparent backdrop-blur-sm">
        <Save className="h-4 w-4" />
        <AlertTitle>We save automatically</AlertTitle>
        <AlertDescription>
          All your progress is saved automatically to your browser and in the
          directory you selected. You can close the app at any time.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
