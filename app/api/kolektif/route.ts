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

    const [kolektif] = await db.query<RowDataPacket[]>(
      `SELECT 
        id, 
        no_kolektif, 
        nama, 
        telp 
      FROM 
        sipamit_billing.kolektif 
      WHERE 
        nama LIKE ? OR 
        no_kolektif LIKE ? 
      ORDER BY 
        nama ASC 
      LIMIT 10`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );

    const formattedData = kolektif.map((row) => ({
      id: row.id,
      no_kolektif: row.no_kolektif,
      nama: row.nama,
      telp: row.telp || "",
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
