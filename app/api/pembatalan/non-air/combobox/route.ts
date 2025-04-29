import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyAuth } from "@/lib/session";
import getConnection from "@/lib/db";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("q") || "";

    const db = await getConnection();

    const [data] = await db.query<RowDataPacket[]>(
      `select id,no_pembayaran,nama,alamat,jenisnonair from penerimaan_nonair where
locate(?,CONCAT_WS(' ',no_pembayaran,nama)) and flagproses=0 order by no_pembayaran asc
      LIMIT 10 
      `,
      [`${searchQuery}`]
    );

    return NextResponse.json({
      status: 200,
      data,
    });
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
