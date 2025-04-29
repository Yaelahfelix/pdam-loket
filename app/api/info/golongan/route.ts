import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }
    const query =
      "SELECT id, kode_golongan, nama FROM sipamit_billing.golongan ORDER BY nama ASC;";
    const [data] = await db.query<RowDataPacket[]>(query);

    return NextResponse.json({ status: 200, data });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};
