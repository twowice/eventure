import { cn } from "@/lib/utils";
import { Icon24 } from "../icons/icon24";
import { Button } from "../ui/button";

export const RouteItem = ({
  order = 1,
  mode = "default",
  route,
  callback,
  shareCallback,
  routeCallback,
}: {
  order: number;
  mode?: "default" | "edit";
  route: Route;
  callback: (id: number) => {};
  shareCallback: (id: number) => {};
  routeCallback: (id: number) => {};
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
      <div
        className="flex flex-row gap-2 grow min-w-0 items-center"
        onClick={() => {
          callback(route.id);
        }}
      >
        <p className="font-semibold shrink-0">{orderString}</p>
        <p className="truncate h-full flex-1 min-w-0">{route.title}</p>
      </div>
      <div className="flex flex-row gap-1 shrink-0 items-center">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => {
            shareCallback(route.id);
          }}
        >
          <Icon24 name={"routesel"} className="size-6" />
        </Button>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => {
            routeCallback(route.id);
          }}
        >
          <Icon24 name="sharedef" className="size-6" />
        </Button>
      </div>
    </div>
  );
};
