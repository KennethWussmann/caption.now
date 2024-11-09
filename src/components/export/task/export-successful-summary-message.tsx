import { StarOnGitHubButton } from "@/components/common/star-on-github-button"
import { Separator } from "@/components/ui"
import { config } from "@/lib/config"
import { productName } from "@/lib/constants"
import { Check } from "lucide-react"

export const ExportSuccessfulSummaryMessage = () => {

  return (
    <>
      <Separator />
      <div className="flex gap-4 items-center">
        <Check className="h-8 w-8" />
        Export successful
      </div>
      {config.demoMode && (
        <>
          <Separator />
          <div className="flex flex-row gap-2 items-center">
            <div>
              Do you like {productName}?
              Please consider starring the project on GitHub!
            </div>
            <StarOnGitHubButton />
          </div>
        </>
      )}
    </>
  )
}