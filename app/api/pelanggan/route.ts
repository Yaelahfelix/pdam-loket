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
      `SELECT 
        id, 
        nama, 
        alamat, 
        no_pelanggan, 
        status 
      FROM 
        sipamit_billing.pelanggan 
      WHERE 
        nama LIKE ? OR 
        no_pelanggan LIKE ? 
      ORDER BY 
        nama ASC 
      LIMIT 10`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );

    // Transform data sesuai dengan tipe yang dibutuhkan
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
