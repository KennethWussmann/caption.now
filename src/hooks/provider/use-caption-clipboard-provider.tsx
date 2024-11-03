import { Caption } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCaptionEditor } from './caption-editor-provider';
import { useShortcut } from '../use-shortcut';

type CaptionClipboardContextType = {
  caption: Caption | null;
  setCaption: (newCaption: Caption) => void;
  copy: VoidFunction;
  paste: VoidFunction;
  clear: VoidFunction;
  hasContent: boolean;
};

const CaptionClipboardContext = createContext<CaptionClipboardContextType | undefined>(undefined);

export const CaptionClipboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [caption, setCaption] = useState<Caption | null>(null);
  const { parts, preview, addPart, setPreview } = useCaptionEditor();
  useShortcut("copyCaptionParts", () => copy());
  useShortcut("pasteCaptionParts", () => paste());

  const clear = () => {
    setCaption(null);
  }

  const copy = () => {
    setCaption({
      parts,
      preview: preview ?? undefined
    })
  }

  const paste = () => {
    if (!caption) {
      return;
    }
    caption.parts.forEach(part => addPart(part.text));
    setPreview(caption.preview ?? null);
  }

  return (
    <CaptionClipboardContext.Provider value={{
      caption,
      setCaption,
      hasContent: !!caption,
      copy,
      paste,
      clear
    }}>
      {children}
    </CaptionClipboardContext.Provider>
  );
};

export const useCaptionClipboard = (): CaptionClipboardContextType => {
  const context = useContext(CaptionClipboardContext);
  if (!context) {
    throw new Error('useCaptionClipboard must be used within a CaptionClipboardProvider');
  }
  return context;
};
