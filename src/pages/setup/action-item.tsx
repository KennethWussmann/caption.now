import { Badge, Separator } from "@/components/ui";
import clsx from "clsx";
import { LucideProps } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

type ActionItemProps = {
  title: string;
  description: string;
  icon: FC<LucideProps>;
  soon?: boolean;
} & (
    | { href: string; onClick?: never }
    | { onClick: () => void; href?: never }
  );


export const ActionItem = ({
  href,
  onClick,
  title,
  description,
  icon,
  soon = false,
}: ActionItemProps) => {
  const Icon = icon;
  const navigate = useNavigate();
  return (
    <div
      onClick={() => !soon && (href ? navigate(href) : onClick?.())}
      className={clsx(
        "p-6 border rounded-md select-none flex flex-col gap-4 flex-1 w-1/2 ",
        { "cursor-not-allowed opacity-50": soon },
        { "cursor-pointer hover:bg-muted": !soon }
      )}
    >
      <div className="flex flex-col gap-4 justify-center align-middle items-center font-semibold">
        <Icon className="h-10 w-10" />
        <div className="flex flex-row gap-2">
          {title}

          {soon && (
            <Badge className="w-14 bg-yellow-500">Soon!</Badge>
          )}</div>
      </div>
      <Separator />
      <div className="text-sm text-muted-foreground text-center">
        {description}
      </div>
    </div>
  );
};
