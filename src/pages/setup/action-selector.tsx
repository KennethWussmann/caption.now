import { ReactNode } from "react";

export const ActionSelector = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-row gap-2 w-full">{children}</div>;
};
