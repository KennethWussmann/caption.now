import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from "rxdb";

export const imageSchemaLiteral = {
  version: 0,
  type: "object",
  primaryKey: {
    key: "id",
    fields: ["filename"],
    separator: "|",
  },
  properties: {
    id: { type: "string" },
    filename: { type: "string" },
    tags: { type: "array", default: [], items: { type: "string" } },
    captionParts: {
      type: "array",
      default: [],
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          index: { type: "number" },
        },
      },
    },
    caption: { type: "string" },
  },
  required: ["id", "filename"],
} as const;
const imageSchemaTyped = toTypedRxJsonSchema(imageSchemaLiteral);

export type ImageDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof imageSchemaTyped
>;
export type ImageDocMethods = {
  isDone: (action: "caption" | "sort") => boolean;
};
export const imageDocMethods: ImageDocMethods = {
  isDone(this: ImageDocType, action: "caption" | "sort") {
    if (action === "caption") {
      return (
        (this.captionParts && this.captionParts.length > 0) ||
        (this.caption && this.caption.length > 0) ||
        false
      );
    } else if (action === "sort") {
      return (this.tags && this.tags.length > 0) || false;
    }
    return false;
  },
};
export type ImageDocTypeUpsert = Omit<ImageDocType, "id">;
export const imageSchema: RxJsonSchema<ImageDocType> = imageSchemaTyped;

export type ImageCollection = RxCollection<ImageDocType, ImageDocMethods>;
export type ImageDocument = RxDocument<ImageDocType, ImageDocMethods>;
