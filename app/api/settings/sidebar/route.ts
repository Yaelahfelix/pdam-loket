import getConnection from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const db = await getConnection();
    const aplikasiId = process.env.APLIKASI_DB_ID;

    // ! Select menu utama dari aplikasi id
    const query = `SELECT mu.namamenu as group_name, md.menu_id, md.namamenu as menu_name FROM menuutama mu LEFT JOIN menudetail md ON mu.id = md.menu_id WHERE mu.aplikasi_id = 1 ORDER BY mu.indek ASC, md.indek ASC;
`;
    const [menuUtama] = await db.query<RowDataPacket[]>(query, [aplikasiId]);

    // ! Mengelompokkan menu dari respon
    const groupedMenu = menuUtama.reduce((acc: any, row) => {
      const { group_name, menu_id, menu_name } = row;

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
          link: `${group.group_name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\s-]/g, "")}/${menu_name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\s-]/g, "")}`,
        });
      }

      return acc;
    }, []);
    return NextResponse.json({
      status: 200,
      menu: groupedMenu,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
