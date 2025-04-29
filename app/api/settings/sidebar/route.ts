import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }
    const db = await getConnection();

    const aplikasiId = process.env.APLIKASI_DB_ID;

    // ! Select menu utama dari aplikasi id
    const query = `
    SELECT mu.namamenu as group_name, md.menu_id, md.namamenu as menu_name, mu.url as group_url, md.url as menu_url, md.icon FROM menuutama mu 
LEFT JOIN menudetail md ON mu.id = md.menu_id
LEFT JOIN role_akses ra ON ra.menu_id = md.id
 WHERE mu.aplikasi_id = ? AND ra.role_id = ? ORDER BY mu.indek ASC, md.indek ASC;
    `;
    const [menuUtama] = await db.query<RowDataPacket[]>(query, [
      aplikasiId,
      authResult.user?.role_id,
    ]);

    // ! Mengelompokkan menu dari respon
    const groupedMenu = menuUtama.reduce((acc: any, row) => {
      const { group_name, menu_id, menu_name, group_url, menu_url, icon } = row;

      let group = acc.find((item: any) => item.group_name === group_name);

      if (!group) {
        group = {
          group_name,
          menus: [],
        };
        acc.push(group);
      }

      if (menu_id && menu_name) {
        group.menus.push({
          menu_id,
          menu_name,
          link: `${group_url}/${menu_url}`,
          icon,
        });
      }

      return acc;
    }, []);
    return NextResponse.json({
      status: 200,
      menu: groupedMenu,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
