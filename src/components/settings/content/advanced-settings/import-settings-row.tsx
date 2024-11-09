import { DoubleConfirmationDialog } from "@/components/common/double-confirmation-dialog"
import { Button } from "@/components/ui"
import { TableCell, TableRow } from "@/components/ui/table"
import { importLocalStorageFromJSON } from "@/lib/settings"

export const ImportSettingsRow = ({ onImportCompleted }: { onImportCompleted: VoidFunction }) => {

  const selectFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async (event) => {
        const json = event.target?.result as string
        try {
          importLocalStorageFromJSON(json)
          onImportCompleted()
        } catch {
          alert("Invalid JSON file")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-2">
          <div>Import settings</div>
          <div className="text-muted-foreground">
            Warning! This cannot be undone. You can restore your settings on another device or after a reset by importing a JSON file. This will overwrite all your current settings. Make sure to save your current settings before importing. The page will reload after import.
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DoubleConfirmationDialog message="All your current settings will be overwritten and the page will reload after import.">
          <Button variant="destructive" onClick={selectFile}>
            Import from file
          </Button>
        </DoubleConfirmationDialog>
      </TableCell>
    </TableRow>
  )
}