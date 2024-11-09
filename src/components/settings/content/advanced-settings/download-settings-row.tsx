import { Button } from "@/components/ui"
import { TableCell, TableRow } from "@/components/ui/table"
import { productName } from "@/lib/constants"
import { exportLocalStorageToJSON } from "@/lib/settings"

export const DownloadSettingsRow = () => {

  const startDownload = () => {
    const json = exportLocalStorageToJSON()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${productName}-settings_${new Date().toISOString()}.json`
    a.click()
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-2">
          <div>Download settings</div>
          <div className="text-muted-foreground">
            This will download your {productName} settings as a JSON file. You can use this file to restore your settings on another device or after a reset.
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="secondary" onClick={startDownload}>
          Download
        </Button>
      </TableCell>
    </TableRow>
  )
}