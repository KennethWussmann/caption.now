import { useDatasetDirectory } from "@/lib/dataset-directory-provider";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { DatabaseProvider } from "./database-provider";

export const RequireDatasetSelection = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isDirectoryLoaded, isDirectorySelected, isEmpty, isAccessDenied } =
    useDatasetDirectory();
  if (!isDirectoryLoaded || !isDirectorySelected || isEmpty || isAccessDenied) {
    return <Navigate to="/setup" />;
  }
  return <DatabaseProvider>{children}</DatabaseProvider>;
};
