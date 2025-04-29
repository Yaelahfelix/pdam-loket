import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const periode = searchParams.get("periode");

    const db = await getConnection();

    const [data] = await db.query<RowDataPacket[]>(
      `
        select * from tagihan_timtagih where periode=? limit 1
        `,
      [`${periode}`]
    );

    console.log(data.length);
    if (data.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          message: "Periode ini belum diposting!",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({
      status: 200,
      message: "Berhasil memilih periode",
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
