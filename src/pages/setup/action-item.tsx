import { Separator } from "@/components/ui";
import clsx from "clsx";
import { LucideProps } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

type ActionItemProps = {
  href: string;
  title: string;
  description: string;
  icon: FC<LucideProps>;
  disabled?: boolean;
};

export const ActionItem = ({
  href,
  title,
  description,
  icon,
  disabled = false,
}: ActionItemProps) => {
  const Icon = icon;
  const navigate = useNavigate();
  return (
    <div
      onClick={() => !disabled && navigate(href)}
      className={clsx(
        "p-6 border rounded-md select-none cursor-pointer flex flex-col gap-4 flex-1 w-1/2",
        { "cursor-not-allowed opacity-20": disabled },
        { "hover:bg-muted": !disabled }
      )}
    >
      <div className="flex flex-col gap-4 justify-center align-middle items-center font-semibold">
        <Icon className="h-10 w-10" />
        {title}
      </div>
      <Separator />
      <div className="text-sm text-muted-foreground text-center">
        {description}
      </div>
    </div>
  );
};
