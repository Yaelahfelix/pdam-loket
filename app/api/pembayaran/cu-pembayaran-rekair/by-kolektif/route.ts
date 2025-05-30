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
    const tgl1 = searchParams.get("tgl1");
    const tgl2 = searchParams.get("tgl2");
    const kolektif = searchParams.get("kolektif");

    if (!tgl1 || !tgl2 || !kolektif) {
      return NextResponse.json(
        { status: 400, message: "tgl/kolektif query is required" },
        { status: 400 }
      );
    }

    const [nopels] = await db.query<RowDataPacket[]>(
      "SELECT no_pelanggan FROM pelanggan WHERE kolektif_id = ?;",
      [kolektif]
    );

    const [kolektifData] = await db.query<RowDataPacket[]>(
      `select id,no_kolektif,nama from kolektif where id = ?`,
      [kolektif]
    );

    const resultData = [];
    for (let i = 0; i < nopels.length; i++) {
      const [infoRows] = await db.query<RowDataPacket[]>(
        `CALL infobayar_desk(?,?,?)`,
        [nopels[i].no_pelanggan, tgl1, tgl2]
      );
      resultData.push(infoRows[0]);
    }

    return NextResponse.json({
      status: 200,
      data: resultData,
      kolektif: kolektifData[0],
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};
