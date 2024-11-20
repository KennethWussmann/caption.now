import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ArrowKeyNavigationContextType = {
  selectedIndex: number | null;
  setLength: (length: number) => void;
  selectLast: () => void;
  selectFirst: () => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  submitCurrentItem: () => void;
  isSelected: (index: number) => boolean;
  unselect: () => void;
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;
};

const ArrowKeyNavigationContext = createContext<ArrowKeyNavigationContextType | null>(null);

type ArrowKeyNavigationProviderProps = {
  children: React.ReactNode;
  enabled?: boolean;
  onSubmit?: (index: number) => void;
};

export const ArrowKeyNavigationProvider: React.FC<ArrowKeyNavigationProviderProps> = ({
  children,
  enabled: enabledInitially = false,
  onSubmit,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [length, setLength] = useState<number>(0);
  const [enabled, setEnabled] = useState<boolean>(enabledInitially);

  const navigateNext = useCallback(() => {
    if (!enabled || length === 0) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % length));
  }, [enabled, length]);

  const navigatePrevious = useCallback(() => {
    if (!enabled || length === 0) return;
    setSelectedIndex((prev) =>
      prev === null ? length - 1 : (prev - 1 + length) % length
    );
  }, [enabled, length]);

  const isSelected = useCallback(
    (index: number) => selectedIndex === index && enabled,
    [selectedIndex, enabled]
  );

  const unselect = useCallback(() => setSelectedIndex(null), []);
  const selectFirst = useCallback(() => setSelectedIndex(0), []);
  const selectLast = useCallback(() => {
    setSelectedIndex(length - 1)
  }, [length]);

  const enable = useCallback(() => setEnabled(true), []);
  const disable = useCallback(() => setEnabled(false), []);

  const submitCurrentItem = useCallback(() => {
    if (!enabled || selectedIndex === null || !onSubmit) {
      return;
    }
    disable()
    onSubmit(selectedIndex);
  }, [enabled, disable, onSubmit, selectedIndex]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          navigateNext();
          break;
        case 'ArrowUp':
          navigatePrevious();
          break;
        case 'Enter':
          event.preventDefault();
          submitCurrentItem();
          break;
        case 'Escape':
          event.preventDefault();
          disable();
          setSelectedIndex(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disable, enabled, navigateNext, navigatePrevious, submitCurrentItem]);

  return (
    <ArrowKeyNavigationContext.Provider
      value={{
        selectedIndex,
        setLength,
        navigateNext,
        navigatePrevious,
        submitCurrentItem,
        isSelected,
        unselect,
        selectFirst,
        selectLast,
        isEnabled: enabled,
        enable,
        disable,
      }}
    >
      {children}
    </ArrowKeyNavigationContext.Provider>
  );
};

export const useArrowKeyNavigation = (): ArrowKeyNavigationContextType => {
  const context = useContext(ArrowKeyNavigationContext);
  if (!context) {
    throw new Error(
      'useArrowKeyNavigation must be used within an ArrowKeyNavigationProvider'
    );
  }

  return context;
};
