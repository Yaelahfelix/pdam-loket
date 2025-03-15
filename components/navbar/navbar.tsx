import { Input, Link, Navbar, NavbarContent } from "@heroui/react";
import React from "react";
import { FeedbackIcon } from "../icons/navbar/feedback-icon";
import { GithubIcon } from "../icons/navbar/github-icon";
import { SupportIcon } from "../icons/navbar/support-icon";
import { SearchIcon } from "../icons/searchicon";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import { User } from "@/types/user";
import { DarkMode } from "./darkmodeswitch";

interface Props {
  children: React.ReactNode;
  user: User;
}

export const NavbarWrapper = ({ children, user }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden max-h-screen">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="flex flex-row-reverse w-full ">
          <UserDropdown user={user} />
          <DarkMode />
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
