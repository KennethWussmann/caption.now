import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CaptionPage from "./pages/caption/page.tsx";
import HomePage from "./pages/home/page.tsx";
import SetupPage from "./pages/setup/page.tsx";
import { DatasetDirectoryProvider } from "./lib/dataset-directory-provider.tsx";
import { RequireDatasetSelection } from "./lib/require-dataset-selection.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "caption",
    element: (
      <RequireDatasetSelection>
        <CaptionPage />
      </RequireDatasetSelection>
    ),
  },
  {
    path: "setup",
    element: <SetupPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DatasetDirectoryProvider>
        <RouterProvider router={router} />
      </DatasetDirectoryProvider>
    </ThemeProvider>
  </StrictMode>
);
