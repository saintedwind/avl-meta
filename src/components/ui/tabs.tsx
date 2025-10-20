import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("inline-grid rounded-xl bg-gray-100 p-1 text-sm", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "px-3 py-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow hover:opacity-100 opacity-75",
        className
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
