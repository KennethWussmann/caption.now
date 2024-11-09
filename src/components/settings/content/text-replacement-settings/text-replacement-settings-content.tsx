import { Pencil, Plus, Replace, Trash } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Button,
  Dialog,
  DialogContent,
  Input,
} from "@/components/ui";
import { useTextReplacements } from "@/hooks/use-text-replacements";
import { useState } from "react";


const TextReplacementSettingsContent = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { replacements, upsertReplacement, removeReplacement } = useTextReplacements();

  const handleAdd = () => {
    setFrom("");
    setTo("");
    setDialogOpen(true);
  }

  const handleSave = () => {
    if (from.trim().length === 0 || to.trim().length === 0) {
      return;
    }
    upsertReplacement(from, to);
    setDialogOpen(false);
    setFrom("");
    setTo("");
  }

  const handleEdit = (replacement: { from: string, to: string }) => {
    setFrom(replacement.from);
    setTo(replacement.to);
    setDialogOpen(true);
  }

  const handleDelete = (replacement: { from: string, to: string }) => {
    removeReplacement(replacement.from);
  }

  const handleCancel = () => {
    setDialogOpen(false);
    setFrom("");
    setTo("");
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="px-4 py-2 flex flex-row gap-4 justify-between items-center">
        <span className="text-muted-foreground">Text replacements allow you to write captions quicker. Sometimes you find yourself typing the same words over and over again. Here text replacements come in handy, just type a shortcut and it will automatically expand into your predefined phrase. Text replacements are only applied while typing, you need to confirm them with a space at the end. This is to avoid accidential overwrites.</span>
        <Button onClick={handleAdd}><Plus /> Add</Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleCancel}>
        <DialogContent>
          <div className="flex flex-col gap-2">
            <div>
              <label>Text</label>
              <Input value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label>Replacement</label>
              <Input value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button variant={"ghost"} onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {replacements.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Text</TableHead>
              <TableHead className="text-right">Replacement</TableHead>
              <TableHead className="text-right w-[50px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {replacements.map((replacement) => (
              <TableRow key={replacement.from}>
                <TableCell>{replacement.from}</TableCell>
                <TableCell className="text-right">{replacement.to}</TableCell>
                <TableCell className="text-right flex flex-row gap-1">
                  <Button onClick={() => handleEdit(replacement)} variant="ghost" size="icon"><Pencil /></Button>
                  <Button onClick={() => handleDelete(replacement)} variant="ghost" size="icon"><Trash /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

const navbarItem: SettingsNavbarItem = {
  name: "Text Replacement",
  icon: Replace,
  content: <TextReplacementSettingsContent />,
};

export default navbarItem;
