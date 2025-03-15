"use server";

import { cookies } from "next/headers";
import { MenuGroup } from "@/types/settings";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "settings";
const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}

export const setSidebar = async (sidebar: MenuGroup[]) => {
  try {
    const token = jwt.sign({ sidebar }, SECRET_KEY, { expiresIn: "7d" });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token);
  } catch (error: any) {
    console.error("Error setting sidebar cookie:", error);
  }
};

export const deleteSidebar = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch (error: any) {
    console.error("Error deleting sidebar cookie:", error);
  }
};

export const getSidebar = async (): Promise<MenuGroup[] | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, SECRET_KEY) as {
      sidebar: MenuGroup[];
    };
    return decoded.sidebar;
  } catch (error: any) {
    console.error("Error parsing sidebar from cookies:", error);
    return null;
  }
};
