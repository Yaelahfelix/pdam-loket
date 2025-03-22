import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const db = await getConnection();
  const authResult = await verifyAuth(request);

  if (!authResult.isAuthenticated) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }

  const query = "SELECT noautokol();";

  const [result] = await db.query<RowDataPacket[]>(query);

  return NextResponse.json({
    status: 200,
    data: { nomor_kolektif: result[0]["noautokol()"] },
  });
};
