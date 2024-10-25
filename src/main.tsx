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
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DatasetDirectoryProvider>
        <ImageCaptionProvider>
          <RouterProvider router={router} />
        </ImageCaptionProvider>
      </DatasetDirectoryProvider>
    </ThemeProvider>
  </StrictMode>
);
