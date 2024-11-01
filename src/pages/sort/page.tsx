import { ImageNavigationToolbar } from "@/components/toolbars/image-navigation-toolbar";
import { LensSettingsToolbar } from "@/components/toolbars/lens-settings-toolbar";
import { Button } from "@/components/ui";
import { ImageListLayout } from "@/layouts/image-list-layout";
import {
  collections,
  useDatabase,
} from "@/lib/database/database-provider";
import { uuid } from "@/lib/utils";
import { useRxCollection, useRxData } from "rxdb-hooks";

const DatabaseTest = () => {
  const { result, isFetching } = useRxData<ImageDoc>(
    collections.images,
    (collection) => collection.find()
  );

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {result.map((doc) => (
        <li key={doc.id}>
          {doc.filename} ({doc.tags?.join(", ")})
        </li>
      ))}
    </ul>
  );
};

const AddItem = () => {
  const collection = useRxCollection<ImageDocUpsert>(collections.images);

  return (
    <Button
      onClick={() => {
        collection?.insert({
          filename: `test_${uuid()}.png`,
          tags: ["test"],
        });
      }}
    >
      Add Item
    </Button>
  );
};

const SaveDatabase = () => {
  const { saveDatabaseBackup, isSaving } = useDatabase();

  return (
    <Button
      onClick={() => {
        saveDatabaseBackup();
      }}
    >
      {isSaving ? "Saving..." : "Save Database"}
    </Button>
  );
};

export default function Page() {
  return (
    <ImageListLayout toolbars={[LensSettingsToolbar, ImageNavigationToolbar]}>
      <DatabaseTest />
      <AddItem />
      <SaveDatabase />
    </ImageListLayout>
  );
}
