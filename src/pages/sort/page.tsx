import { ImageNavigationToolbar } from "@/components/toolbars/image-navigation-toolbar";
import { LensSettingsToolbar } from "@/components/toolbars/lens-settings-toolbar";
import { Button } from "@/components/ui";
import { ImageListLayout } from "@/layouts/image-list-layout";
import {
  collections,
  DatabaseProvider,
  ImageDoc,
  ImageDocUpsert,
  useDatabase,
} from "@/lib/database-provider";
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
          {doc.filename} ({doc.tags.join(", ")})
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
          filename: `test.png${Math.random()}`,
          tags: ["test"],
        });
      }}
    >
      Add Item
    </Button>
  );
};

const SaveDatabase = () => {
  const { saveDatabaseBackup } = useDatabase();

  return (
    <Button
      onClick={() => {
        saveDatabaseBackup();
      }}
    >
      Save Database
    </Button>
  );
};

export default function Page() {
  return (
    <DatabaseProvider>
      <ImageListLayout toolbars={[LensSettingsToolbar, ImageNavigationToolbar]}>
        <DatabaseTest />
        <AddItem />
        <SaveDatabase />
      </ImageListLayout>
    </DatabaseProvider>
  );
}
