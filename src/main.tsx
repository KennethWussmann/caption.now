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
import { ImageCaptionProvider } from "./lib/image-caption-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

const queryClient = new QueryClient();

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
    children: [
      {
        path: ":filename",
      },
    ],
  },
  {
    path: "setup",
    element: <SetupPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <DatasetDirectoryProvider>
          <ImageCaptionProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </ImageCaptionProvider>
        </DatasetDirectoryProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
);
