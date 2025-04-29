import {
  getPaginatedData,
  PaginationParams,
  withPagination,
} from "@/lib/paginationServer";
import { verifyAuth } from "@/lib/session";
import { RoleAkses } from "@/types/role";
import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

interface RoleRecord extends RowDataPacket, RoleAkses {}
export const GET = async (request: NextRequest) => {
  const authResult = await verifyAuth(request);

  if (!authResult.isAuthenticated) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  return withPagination<RoleRecord>(
    request,
    async (db: Pool, params: PaginationParams) => {
      let baseQuery = `
SELECT ra.id, r.role, mu.namamenu menuutamamenuutama FROM role_akses ra LEFT JOIN role r ON r.id = ra.role_id LEFT JOIN menuutama mu ON mu.id = ra.menu_id;
      `;

      let paramsArray: any[] = [];

      if (query) {
        baseQuery += ` WHERE (u.username LIKE ? OR u.nama LIKE ?) `;
        paramsArray.push(`%${query}%`, `%${query}%`);
      }

      baseQuery += `
        GROUP BY u.id, u.username, u.nama, u.jabatan, r.role, u.is_user_ppob, u.is_active, u.is_user_timtagih
      `;

      return await getPaginatedData<RoleRecord>(
        db,
        baseQuery,
        undefined,
        paramsArray,
        params
      );
    }
  );
};
