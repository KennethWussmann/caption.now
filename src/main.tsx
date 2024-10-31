import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CaptionPage from "./pages/caption/page.tsx";
import SortPage from "./pages/sort/page.tsx";
import HomePage from "./pages/home/page.tsx";
import SetupPage from "./pages/setup/page.tsx";
import PlaygroundPage from "./pages/playground/page.tsx";
import { DatasetDirectoryProvider } from "./hooks/provider/dataset-directory-provider.tsx";
import { RequireDatasetSelection } from "./lib/require-dataset-selection.tsx";
import { ImageCaptionProvider } from "./hooks/provider/image-caption-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Toaster } from "@/components/ui/toaster";
import { PWAPrompt } from "./components/common/pwa-prompt.tsx";
import { OllamaModelDownloadProvider } from "./hooks/provider/ollama-model-download-provider.tsx";
import { DisableAnimations } from "./lib/disable-animations.tsx";
import { PreventCloseProvider } from "./hooks/provider/prevent-close-provider.tsx";
import { ImageNavigationProvider } from "./hooks/provider/image-navigation-provider.tsx";

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
        <ImageNavigationProvider>
          <CaptionPage />
        </ImageNavigationProvider>
      </RequireDatasetSelection>
    ),
    children: [
      {
        path: ":filename",
      },
    ],
  },
  {
    path: "sort",
    element: (
      <RequireDatasetSelection>
        <ImageNavigationProvider>
          <SortPage />
        </ImageNavigationProvider>
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
  {
    path: "playground",
    element: <PlaygroundPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <DatasetDirectoryProvider>
          <ImageCaptionProvider>
            <QueryClientProvider client={queryClient}>
              <OllamaModelDownloadProvider>
                <PreventCloseProvider>
                  <RouterProvider router={router} />
                  <Toaster />
                  <PWAPrompt />
                  <DisableAnimations />
                </PreventCloseProvider>
              </OllamaModelDownloadProvider>
            </QueryClientProvider>
          </ImageCaptionProvider>
        </DatasetDirectoryProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
);
