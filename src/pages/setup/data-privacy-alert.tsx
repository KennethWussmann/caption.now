import { Alert, AlertDescription, AlertTitle } from "@/components/ui";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export const DataPrivacyAlert = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      transition={{ duration: 1, delay: 0.5 }}
      className="bg-transparent backdrop-blur-sm"
    >
      <Alert className="border-none">
        <Lock className="h-4 w-4" />
        <AlertTitle>Your data belongs to you</AlertTitle>
        <AlertDescription>
          This app works entirely offline! At no point will your data leave your
          computer. All processing and data entered is only processed locally in
          your browser. You could disconnect from the internet now.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
