import clsx from "clsx";
import { Check, LoaderCircle, LucideProps, X } from "lucide-react";
import { FC } from "react";
import { Badge } from "../ui";

type Status = "online" | "offline" | "checking";

type Variant = {
  className: string;
  text: string;
  icon: FC<LucideProps>;
  spinningIcon?: boolean;
};

type ServiceStatusBadgeProps = {
  status: Status;
  onClick?: VoidFunction;
};

const variants: Record<Status, Variant> = {
  online: {
    className:
      "bg-green-200 dark:bg-green-600 hover:bg-green-300 hover:dark:bg-green-400",
    icon: Check,
    text: "Online",
  },
  offline: {
    className:
      "bg-red-200 dark:bg-red-600 hover:bg-red-300 hover:dark:bg-red-400",
    icon: X,
    text: "Offline",
  },
  checking: {
    className:
      "bg-yellow-200 dark:bg-yellow-600 hover:bg-yellow-300 hover:dark:bg-yellow-400",
    icon: LoaderCircle,
    text: "Checking",
    spinningIcon: true,
  },
};

export const ServiceStatusBadge = ({
  status,
  onClick,
}: ServiceStatusBadgeProps) => {
  const variant = variants[status];
  const Icon = variant.icon;

  return (
    <Badge
      className={clsx(
        variant.className,
        "gap-1 text-black dark:text-white pl-1 pr-2 select-none"
      )}
      onClick={onClick}
    >
      {/* Here it should use variant.icon */}
      <Icon
        className={clsx("h-4 w-4", {
          "animate-spin": variant.spinningIcon ?? false,
        })}
      />
      {variant.text}
    </Badge>
  );
};
