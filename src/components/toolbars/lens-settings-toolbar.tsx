import { Badge, Button, Switch } from "@/components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { settings } from "@/lib/settings";
import clsx from "clsx";
import { useAtom } from "jotai/react";
import { ZoomIn } from "lucide-react";

export const LensSettingsToolbar = () => {
  const [lensEnabled, setLensEnabled] = useAtom(settings.tools.lens.enabled);
  const [zoomFactor, setZoomFactor] = useAtom(settings.tools.lens.zoomFactor);
  const [size, setSize] = useAtom(settings.tools.lens.size);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]" align="end">
        <Table>
          <TableCaption>
            Hover over the image to see a magnified view
          </TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Enabled</TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={lensEnabled}
                  onCheckedChange={setLensEnabled}
                />
              </TableCell>
            </TableRow>
            <TableRow
              className={clsx({
                "opacity-20 pointer-events-none select-none": !lensEnabled,
              })}
            >
              <TableCell>
                <div className="flex justify-between">
                  Size <Badge>{size}</Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Slider
                  disabled={!lensEnabled}
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  max={500}
                  min={50}
                  step={10}
                />
              </TableCell>
            </TableRow>
            <TableRow
              className={clsx({
                "opacity-20 pointer-events-none select-none": !lensEnabled,
              })}
            >
              <TableCell>
                <div className="flex justify-between">
                  Zoom <Badge>{zoomFactor}</Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Slider
                  disabled={!lensEnabled}
                  value={[zoomFactor]}
                  onValueChange={(value) => setZoomFactor(value[0])}
                  max={10}
                  min={1.1}
                  step={0.1}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};
