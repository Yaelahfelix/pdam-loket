"use server";

import { User } from "@/types/user";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}

// Convert string to Uint8Array for jose
const getSecretKey = () => {
  return new TextEncoder().encode(SECRET_KEY);
};

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
    const { payload } = await jwtVerify(token, getSecretKey());
    const user = payload as unknown as User;
    return {
      isAuthenticated: true,
      user,
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
  is_user_timtagih: boolean,
  role_id: number
) => {
  try {
    const token = await new SignJWT({
      username,
      nama,
      jabatan,
      role,
      role_id,
      kodeloket,
      is_user_ppob,
      is_active,
      is_user_timtagih,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      // Not setting expiration as it wasn't in the original code
      .sign(getSecretKey());

    const cookieStore = await cookies();
    cookieStore.set("token", token);

    return {
      status: 200,
      message: "Session created successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

export const getSession = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");
  if (!token) {
    return null;
  }

  try {
    const { payload }: { payload: User } = await jwtVerify(
      token.value,
      getSecretKey()
    );
    return {
      session: payload,
      token,
    };
  } catch (error) {
    return null;
  }
};
