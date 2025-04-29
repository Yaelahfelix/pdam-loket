import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { formatRupiah } from "@/lib/utils";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const no_pelanggan = searchParams.get("no-pelanggan");
    if (!no_pelanggan) {
      return NextResponse.json(
        { status: 400, message: "no pelanggan is required" },
        { status: 400 }
      );
    }

    const [blmLns] = await db.query<RowDataPacket[]>(
      "call infotag_desk(?, CURDATE())",
      [no_pelanggan]
    );
    const [sdhLns] = await db.query<RowDataPacket[]>(
      "call infobayar_deskinfo(?)",
      [no_pelanggan]
    );

    const totalBelumLunas = blmLns[0].reduce(
      (sum: any, item: any) => sum + Number(item.totalrek),
      0
    );

    const totalSudahLunas = sdhLns[0].reduce(
      (sum: any, item: any) => sum + Number(item.total),
      0
    );

    const totalKeseluruhan = totalBelumLunas + totalSudahLunas;

    return NextResponse.json({
      status: 200,
      total: {
        blmLunas: totalBelumLunas,
        sdhLunas: totalSudahLunas,
        keseluruhan: totalKeseluruhan,
      },
      tagihanBlmLunas: blmLns[0],
      tagihanSdhLunas: sdhLns[0],
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};
