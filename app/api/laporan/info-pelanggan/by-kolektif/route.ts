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
    const kolektif_id = searchParams.get("kolektif_id");
    if (!kolektif_id) {
      return NextResponse.json(
        { status: 400, message: "no pelanggan is required" },
        { status: 400 }
      );
    }

    const [noPelBlmLunas] = await db.query<RowDataPacket[]>(
      "SELECT no_pelanggan FROM pelanggan WHERE kolektif_id = ?;",
      [kolektif_id]
    );

    const allBlmLunas = [];
    for (let i = 0; i < noPelBlmLunas.length; i++) {
      const [blmLns] = await db.query<RowDataPacket[]>(
        "call infotag_desk(?, CURDATE())",
        [noPelBlmLunas[i].no_pelanggan]
      );

      allBlmLunas.push({
        noPelanggan: noPelBlmLunas[i].no_pelanggan,
        tagihanBlmLunas: blmLns[0],
      });
    }

    const totalBelumLunas = allBlmLunas.reduce((sum, pelanggan) => {
      const totalPelanggan = pelanggan.tagihanBlmLunas.reduce(
        (subtotal, tagihan) => {
          return subtotal + Number(tagihan.totalrek);
        },
        0
      );
      return sum + totalPelanggan;
    }, 0);

    console.log(totalBelumLunas);
    return NextResponse.json({
      status: 200,
      kolektifBlmLunas: allBlmLunas,
      totalBlmLunas: formatRupiah(totalBelumLunas),
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};
