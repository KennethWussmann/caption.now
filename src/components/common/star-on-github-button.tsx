import { Github } from "lucide-react"
import { Button } from "../ui"
import { config } from "@/lib/config";

export const StarOnGitHubButton = () => {
  const openGitHub = () => {
    window.open(config.githubURL, "_blank", "noopener,noreferrer");
  };
  return <Button size={"lg"} variant={"ghost"} onClick={openGitHub}><Github /> Star on GitHub</Button>
}