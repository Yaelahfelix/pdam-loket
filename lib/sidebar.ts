"use server";

import { cookies } from "next/headers";
import { MenuGroup } from "@/types/settings";
import { SignJWT, jwtVerify } from "jose"; // Import jose instead of jsonwebtoken

const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}

const getSecretKey = () => {
  return new TextEncoder().encode(SECRET_KEY);
};

export const setSidebar = async (sidebar: MenuGroup[]) => {
  try {
    const token = await new SignJWT({ sidebar })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecretKey());

    const cookieStore = await cookies();
    cookieStore.set("settings", token);
  } catch (error: any) {
    console.error("Error setting sidebar cookie:", error);
  }
};

export const deleteSidebar = async () => {
  (await cookies()).delete("settings");
};

export const getSidebar = async (): Promise<MenuGroup[] | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("settings");

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token.value, getSecretKey());
    return payload.sidebar as MenuGroup[];
  } catch (error: any) {
    console.error("Error parsing sidebar from cookies:", error);
    return null;
  }
};
