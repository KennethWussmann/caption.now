import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Button,
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui";
import { Cog, X } from "lucide-react";
import { useState } from "react";
import { navbarItems } from "./content";
import { useShortcut } from "@/hooks/use-shortcut";

export const SettingsDialog = () => {
  const [open, setOpen] = useState(false);
  const [activeNavbarItem, setActiveNavbarItem] = useState(navbarItems[0]);
  useShortcut("openSettings", () => setOpen(open => !open));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Cog />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[1300px] lg:max-h-[1000px]"
        hideClose
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarHeader>
              <div className="text-lg font-bold p-2 px-4">Settings</div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navbarItems.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          className="h-12 px-4"
                          isActive={item.name === activeNavbarItem.name}
                          onClick={() => setActiveNavbarItem(item)}
                        >
                          <div>
                            <item.icon />
                            <span>{item.name}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex flex-1 flex-col">
            <header className="flex py-2 pl-4 pr-2 items-center justify-between border-b">
              <div className="flex gap-2 font-bold">
                <activeNavbarItem.icon />
                <span className="">{activeNavbarItem.name}</span>
              </div>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setOpen(false)}
              >
                <X className="h-20 w-20" />
              </Button>
            </header>
            {activeNavbarItem.content}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
};
