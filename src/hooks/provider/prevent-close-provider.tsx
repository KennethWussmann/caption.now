import React, {
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
  initialValue = false
): PreventCloseContextType => {
  const context = useContext(PreventCloseContext);

  if (!context) {
    throw new Error(
      "usePreventClose must be used within a PreventCloseProvider"
    );
  }

  // Set initial value for unsavedWork
  useEffect(() => {
    context.setUnsavedWork(initialValue);
  }, [context, initialValue]);

  return context;
};
