import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const db = await getConnection();
    const [ttd] = await db.query<RowDataPacket[]>(
      `SELECT ttd.*, 
up1.nama as nama1, up1.jabatan as jabatan1,
up2.nama as nama2, up2.jabatan as jabatan2,
up3.nama as nama3, up3.jabatan as jabatan3,
up4.nama as nama4, up4.jabatan as jabatan4
FROM ttdlap ttd 
LEFT JOIN userparaf up1 ON up1.id = ttd.id1
LEFT JOIN userparaf up2 ON up2.id = ttd.id2
LEFT JOIN userparaf up3 ON up3.id = ttd.id3
LEFT JOIN userparaf up4 ON up4.id = ttd.id4
;`
    );

    return NextResponse.json({ status: 200, data: ttd });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        status: error.status || 500,
        message: error.message || "Internal server error",
      },
      { status: error.status || 500 }
    );
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const db = await getConnection();
    const body = await request.json();

    const { kode, id1, id2, id3, id4, is_id_1, is_id_2, is_id_3, is_id_4 } =
      body;

    if (!kode) {
      return NextResponse.json(
        { message: "Kode is required" },
        { status: 400 }
      );
    }

    console.log(body);

    await db.query(
      `UPDATE ttdlap
       SET 
         id1 = ?, is_id_1 = ?,
         id2 = ?, is_id_2 = ?,
         id3 = ?, is_id_3 = ?,
         id4 = ?, is_id_4 = ?
       WHERE kode = ?`,
      [
        id1 || null,
        is_id_1 || null,
        id2 || null,
        is_id_2 || null,
        id3 || null,
        is_id_3 || null,
        id4 || null,
        is_id_4 || null,
        kode,
      ]
    );

    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui data",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        status: error.status || 500,
        message: error.message || "Internal server error",
      },
      { status: error.status || 500 }
    );
  }
};
