import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyAuth } from "@/lib/session";
import getConnection from "@/lib/db";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("q") || "";

    const db = await getConnection();

    const [pelanggan] = await db.query<RowDataPacket[]>(
      `select id,no_pelanggan,nama,alamat, status from pelanggan where
locate(?,CONCAT_WS(' ',no_pelanggan,nama,alamat))
ORDER BY nama asc
      LIMIT 10 
      `,
      [`${searchQuery}`]
    );

    const formattedData = pelanggan.map((row) => ({
      id: row.id,
      nama: row.nama,
      alamat: row.alamat || "",
      no_pelanggan: row.no_pelanggan,
      status: Boolean(row.status),
    }));

    return NextResponse.json({
      status: 200,
      data: formattedData,
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
