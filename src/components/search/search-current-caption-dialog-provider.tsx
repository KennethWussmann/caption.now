import { createContext, useContext, useState, ReactNode } from "react";
import { useShortcut } from "@/hooks/use-shortcut";

type SearchCurrentCaptionDialogContextProps = {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

const SearchCurrentCaptionDialogContext = createContext<
  SearchCurrentCaptionDialogContextProps | undefined
>(undefined);

export const SearchCurrentCaptionDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  useShortcut("searchCurrentCaption", () => {
    setDialogOpen((current) => !current);
  });

  return (
    <SearchCurrentCaptionDialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
      {children}
    </SearchCurrentCaptionDialogContext.Provider>
  );
};

export const useSearchCurrentCaptionDialog = () => {
  const context = useContext(SearchCurrentCaptionDialogContext);
  if (!context) {
    throw new Error("useSearchCurrentCaptionDialog must be used within a SearchCurrentCaptionDialogProvider");
  }
  return context;
};
