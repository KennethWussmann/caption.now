import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

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
  return children;
};
