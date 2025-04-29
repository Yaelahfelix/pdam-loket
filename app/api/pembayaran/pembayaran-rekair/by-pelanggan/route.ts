import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { formatDate } from "date-fns";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const flagIsAdmin = searchParams.get("flag-is-admin");
    const tgl = searchParams.get("tgl");
    const nopel = searchParams.get("nopel");
    const todayFormatted = formatDate(new Date(), "yyyy-MM-dd");

    if (!tgl || !nopel) {
      return NextResponse.json(
        { status: 400, message: "tgl/nopel query is required" },
        { status: 400 }
      );
    }

    if (!flagIsAdmin && tgl !== todayFormatted) {
      return NextResponse.json(
        {
          status: 403,
          message: "Ditolak di server - ERR1",
          code: "ERR1",
        },
        {
          status: 403,
        }
      );
    }

    const [pelangganRows] = await db.query<RowDataPacket[]>(
      `SELECT p.id,p.status,p.no_pelanggan,p.nama,p.alamat,g.kode_golongan as golongan, r.nama as rayon FROM pelanggan p 
LEFT JOIN golongan g ON g.id = p.golongan_id
LEFT JOIN rayon r ON r.id = p.rayon_id
WHERE no_pelanggan = ?`,
      [nopel]
    );

    const resultData = [];

    if (pelangganRows.length === 0) {
      return NextResponse.json(
        { status: 404, message: "Nopel tidak ditemukan!" },
        { status: 404 }
      );
    }
    const [infoRows] = await db.query<RowDataPacket[]>(
      `CALL infotag_desk(?, ?)`,
      [nopel, tgl]
    );

    return NextResponse.json({
      status: 200,
      data: infoRows[0],
      pelanggan: pelangganRows[0],
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};
