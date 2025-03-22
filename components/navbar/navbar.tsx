import { Button, Input, Link, Navbar, NavbarContent } from "@heroui/react";
import React, { useContext } from "react";
import { FeedbackIcon } from "../icons/navbar/feedback-icon";
import { GithubIcon } from "../icons/navbar/github-icon";
import { SupportIcon } from "../icons/navbar/support-icon";
import { SearchIcon } from "../icons/searchicon";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import { User } from "@/types/user";
import { DarkMode } from "./darkmodeswitch";
import { SidebarContext } from "../layout/layout-context";
import { Sidebar } from "lucide-react";

interface Props {
  children: React.ReactNode;
  user: User;
}

export const NavbarWrapper = ({ children, user }: Props) => {
  const { setCollapsed } = useContext(SidebarContext);
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden max-h-screen">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="w-full">
          <div className="flex justify-between w-full items-center">
            <Button onPress={() => setCollapsed((prev) => !prev)}>
              <Sidebar />
            </Button>
            <div className="flex items-center gap-3">
              <DarkMode />
              <UserDropdown user={user} />
            </div>
          </div>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
