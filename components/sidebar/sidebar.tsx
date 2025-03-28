import React, { useEffect } from "react";
import { Sidebar } from "./sidebar.styles";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";

import { MenuGroup } from "@/types/settings";
import { icons } from "@/lib/icons";

export const SidebarWrapper = ({
  sidebar,
  loket,
}: {
  sidebar: MenuGroup[];
  loket: string;
}) => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={() => setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <div className="flex items-center gap-2">
            {/* {company.logo} */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
                {loket}
              </h3>
              <span className="text-xs font-medium text-default-500">
                PDAM Probolinggo
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {sidebar?.map((group, i) => (
              <SidebarMenu title={group.group_name} key={i}>
                {group.menus.map((menu) => (
                  <SidebarItem
                    icon={
                      icons.find((icon) => icon.name === menu.icon)?.component
                    }
                    key={menu.link}
                    isActive={pathname === `/admin/${menu.link}`}
                    title={menu.menu_name}
                    href={`/admin/${menu.link}`}
                  />
                ))}
              </SidebarMenu>
            ))}
          </div>
          {/* <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div> */}
        </div>
      </div>
    </aside>
  );
};
