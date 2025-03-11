import getConnection from "@/lib/db";
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

interface UserRecord extends RowDataPacket, User {}
export const GET = async (request: NextRequest) => {
  const authResult = await verifyAuth(request);

  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  return withPagination<UserRecord>(
    request,
    async (db: Pool, params: PaginationParams) => {
      const baseQuery = `
        SELECT u.id, u.username, u.nama, u.jabatan, r.role, u.is_user_ppob, u.is_active, u.is_user_timtagih
        FROM users u 
        LEFT JOIN role r ON r.id = u.role_id
      `;

      return await getPaginatedData<UserRecord>(
        db,
        baseQuery,
        undefined,
        [],
        params
      );
    }
  );
};
