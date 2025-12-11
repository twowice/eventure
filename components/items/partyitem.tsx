import { cn } from "@/lib/utils";
import { Icon24 } from "../icons/icon24";

export const PartyItem = ({
  order = 1,
  mode = "default",
  callback,
}: {
  order: number;
  mode?: "default" | "edit";
  callback?: () => {};
}) => {
  let orderString = String(order);
  if (order < 10) orderString = "0" + orderString;
  return (
    <div
      className={cn(
        "flex flex-row",
        "w-full",
        "h-10",
        "bg-secondary-background",
        "rounded-lg",
        "p-2",
        "justify-between items-center gap-2"
      )}
    >
      <div className="flex flex-row gap-2" onClick={callback}>
        <p className="font-semibold">{orderString}</p>
        <p className="w-full">파티명</p>
      </div>
      <div className="flex flex-row gap-1">
        <Icon24 name={"routesel"} />
        <Icon24 name="sharedef" />
      </div>
    </div>
  );
};
