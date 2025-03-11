"use server";

import { User } from "@/types/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}
export const verifyAuth = async (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      isAuthenticated: false,
      error: "Unauthorized: No token provided",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    return {
      isAuthenticated: true,
      user: decodedToken,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: "Unauthorized: Invalid token",
    };
  }
};

export const setSession = async (
  username: string,
  nama: string,
  jabatan: string,
  role: string,
  kodeloket: string,
  is_user_ppob: boolean,
  is_active: boolean,
  is_user_timtagih: boolean
) => {
  try {
    const token = jwt.sign(
      {
        username,
        nama,
        jabatan,
        role,
        kodeloket,
        is_user_ppob,
        is_active,
        is_user_timtagih,
      },
      SECRET_KEY
    );

    const cookieStore = cookies();
    cookieStore.set("token", token);
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

export const getSession = async () => {
  const cookieStore = cookies();

  const token = cookieStore.get("token");
  if (!token) {
    return null;
  }
  const session = jwt.verify(token.value, SECRET_KEY);
  return {
    session,
    token,
  };
};
