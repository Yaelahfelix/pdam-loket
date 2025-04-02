"use client";

import React, { useEffect, useState } from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext, useSidebarContext } from "./layout-context";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import axios from "axios";
import { Spinner } from "@heroui/spinner";
import { getSession } from "@/lib/session";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { getSidebar, setSidebar } from "@/lib/sidebar";
import { MenuGroup } from "@/types/settings";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocked] = useLockedBody(false);
  const [sidebar, setSidebarState] = useState<MenuGroup[]>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sidebarData = await getSidebar();
        const session = await getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        setUser(session.session);

        if (!sidebarData) {
          try {
            const res = await axios.get("/api/settings/sidebar", {
              headers: {
                Authorization: `Bearer ${session?.token.value}`,
              },
            });

            if (res.data && res.data.menu) {
              await setSidebar(res.data.menu);

              setSidebarState(res.data.menu);
            }
          } catch (apiError) {
            console.error("Error fetching sidebar data:", apiError);
          }
        } else {
          setSidebarState(sidebarData);
        }
      } catch (error) {
        console.error("Error in data fetching process:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {sidebar && !isLoading && user ? (
        <SidebarContext.Provider
          value={{
            collapsed,
            setCollapsed,
          }}
        >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              className="min-w-[365px]"
              defaultSize={1}
              style={{ display: collapsed ? "none" : "block" }}
            >
              <SidebarWrapper sidebar={sidebar} loket={user.kodeloket} />
            </ResizablePanel>

            <ResizableHandle
              style={{ display: collapsed ? "none" : "block" }}
            />

            <ResizablePanel className="min-h-screen">
              <NavbarWrapper user={user} loket={user.kodeloket}>
                {children}
              </NavbarWrapper>
            </ResizablePanel>
          </ResizablePanelGroup>
        </SidebarContext.Provider>
      ) : (
        <div className="w-full h-screen grid place-content-center gap-5">
          <Image
            src="/logo/loket.png"
            width={70}
            height={70}
            alt=""
            className="animate-pulse"
          />
        </div>
      )}
    </>
  );
};
