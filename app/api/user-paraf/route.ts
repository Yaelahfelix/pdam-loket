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

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("q") || "";

    const db = await getConnection();
    const [ttd] = await db.query<RowDataPacket[]>(
      `SELECT * FROM sipamit_billing.userparaf 
       WHERE nama LIKE ? OR jabatan LIKE ? 
       ORDER BY nama ASC;`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
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
