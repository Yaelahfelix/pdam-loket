import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
type Params = Promise<{ id: string }>;
export const GET = async (
  request: NextRequest,
  { params }: { params: Params }
) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }
    const { id: roleId } = await params;
    const aplikasiId = process.env.APLIKASI_DB_ID;

    const [roleDetail] = await db.query<RowDataPacket[]>(
      `
        SELECT id, role FROM role WHERE id = ?;
      `,
      [roleId]
    );

    if (!roleDetail.length) {
      return NextResponse.json({ status: 404, message: "Role not found" });
    }
    const [allMenu] = await db.query<RowDataPacket[]>(
      `
    SELECT 
      mu.namamenu as group_name, 
      md.menu_id as menu_utama_id, 
      md.id as menu_id,
      md.namamenu as menu_name, 
      mu.url as group_url, 
      md.url as menu_url 
    FROM menuutama mu 
    LEFT JOIN menudetail md ON mu.id = md.menu_id 
    WHERE mu.aplikasi_id = ? 
    ORDER BY mu.indek ASC, md.indek ASC;
  `,
      [aplikasiId]
    );

    const [roleMenus] = await db.query<RowDataPacket[]>(
      `
    SELECT 
    ra.id AS role_akses_id,
      md.id AS menu_detail_id
    FROM role_akses ra 
    INNER JOIN menudetail md ON md.id = ra.menu_id
    INNER JOIN menuutama mu on md.menu_id = mu.id
    WHERE ra.role_id = ? AND mu.aplikasi_id = ?

  `,
      [roleId, aplikasiId]
    );
    const menuMap = new Map(
      roleMenus.map((row) => [row.menu_detail_id, row.role_akses_id])
    );

    const menusWithStatus = allMenu.map((menu) => ({
      id: menuMap.get(menu.menu_id) || null,
      ...menu,
      aktif: menuMap.has(menu.menu_id),
    }));
    return NextResponse.json({
      status: 200,
      data: {
        role_id: roleDetail[0].id,
        role_name: roleDetail[0].role,
        menus: menusWithStatus,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};
