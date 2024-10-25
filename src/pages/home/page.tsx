import { RequireDatasetSelection } from "@/lib/require-dataset-selection";
import { Navigate } from "react-router-dom";

export default function Page() {
  return (
    <RequireDatasetSelection>
      <Navigate to="/caption" />
    </RequireDatasetSelection>
  );
}
