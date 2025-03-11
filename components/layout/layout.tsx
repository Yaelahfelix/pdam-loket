"use client";

import React, { useEffect, useState } from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { getSidebar, setSidebar } from "@/lib/settings";
import axios from "axios";
import { Spinner } from "@heroui/spinner";
import { getSession } from "@/lib/session";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };
  const router = useRouter();
  const sidebar = getSidebar();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (!sidebar) {
          const res = await axios.get("/api/settings/sidebar");
          setSidebar(res.data.menu);
        }

        const session = await getSession();
        if (!session) {
          router.replace("/login");
        } else {
          setUser(session.session as User);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
            collapsed: sidebarOpen,
            setCollapsed: handleToggleSidebar,
          }}
        >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="min-w-[365px]" defaultSize={1}>
              <SidebarWrapper sidebar={sidebar} loket={user.kodeloket} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <NavbarWrapper user={user}>{children}</NavbarWrapper>
            </ResizablePanel>
          </ResizablePanelGroup>
        </SidebarContext.Provider>
      ) : (
        <div className="w-full h-screen grid place-content-center">
          <Spinner color="primary" size="lg"></Spinner>
        </div>
      )}
    </>
  );
};
