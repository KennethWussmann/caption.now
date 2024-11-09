import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type PreventCloseContextType = {
  unsavedWork: boolean;
  setUnsavedWork: (value: boolean) => void;
};

const PreventCloseContext = createContext<PreventCloseContextType | undefined>(
  undefined
);

export const PreventCloseProvider = ({
  children,
  initialUnsavedWork = false,
}: {
  children: ReactNode;
  initialUnsavedWork?: boolean;
}) => {
  const [unsavedWork, setUnsavedWork] = useState<boolean>(initialUnsavedWork);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (unsavedWork) {
        event.preventDefault();
        event.returnValue = ""; // Necessary for most modern browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedWork]);

  return (
    <PreventCloseContext.Provider value={{ unsavedWork, setUnsavedWork }}>
      {children}
    </PreventCloseContext.Provider>
  );
};

export const usePreventClose = (
  initialValue = false,
  onBeforeUnload?: VoidFunction
): PreventCloseContextType => {
  const context = useContext(PreventCloseContext);

  if (!context) {
    throw new Error(
      "usePreventClose must be used within a PreventCloseProvider"
    );
  }

  useEffect(() => {
    context.setUnsavedWork(initialValue);
  }, [context, initialValue]);

  useEffect(() => {
    if (!onBeforeUnload || !context.unsavedWork) {
      return;
    }
    const handleBeforeUnload = () => {
      onBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [context.unsavedWork, onBeforeUnload]);

  return context;
};
