import { StarOnGitHubButton } from "@/components/common/star-on-github-button"
import { config } from "@/lib/config"

export const Footer = () => {
  return (
    <div className="absolute left-0 bottom-8 w-full">
      <div className="flex flex-col gap-2 justify-center items-center align-middle">
        {config.demoMode && <StarOnGitHubButton />}
        <div className="flex flex-row gap-4 justify-center text-muted-foreground text-xs">
          {config.imprintUrl && (<a href={config.imprintUrl} target="_blank" className="hover:underline">Imprint</a>)}
          {config.privacyUrl && (<a href={config.privacyUrl} target="_blank" className="hover:underline">Privacy Policy</a>)}
        </div>
        <div className="text-xs text-muted-foreground"><a href={config.githubURL} target="_blank" className="hover:underline">{config.appVersion}</a></div>
      </div>
    </div>
  )
}