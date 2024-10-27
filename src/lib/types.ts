export type DirectoryFile = {
  name: string;
  type: string;
};

export type ImageFile = DirectoryFile & {
  src: string;
  base64: string;
  captionFile?: TextFile;
};

export type TextFile = DirectoryFile & {
  content: string;
};

export type CaptionPart = {
  id: string;
  text: string;
};

export type Caption = {
  parts: CaptionPart[];
  preview?: string;
};
