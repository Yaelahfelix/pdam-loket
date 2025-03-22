import getConnection from "@/lib/db";
import { GET_ALL_ROLE } from "@/lib/dbQuery/role";
import {
  getPaginatedData,
  PaginationParams,
  withPagination,
} from "@/lib/paginationServer";
import { verifyAuth } from "@/lib/session";
import { User } from "@/types/user";
import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const [result] = await db.query<RowDataPacket[]>(GET_ALL_ROLE);
    return NextResponse.json({
      status: 200,
      roles: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: error.status || 500,
        message: error.message || "Internal server error",
      },
      { status: error.status || 500 }
    );
  }
};
