import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;
export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const db = await getConnection();
    const { id } = await segmentData.params;
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }
    const query = `
        SELECT 
        id, 
        username, 
        nama, 
        jabatan, 
        role_id,
        is_user_ppob, 
        is_active, 
        is_user_timtagih
      FROM users WHERE id = ?;
      `;
    const [result] = await db.query<RowDataPacket[]>(query, [Number(id)]);

    return NextResponse.json({ status: 200, data: result[0] });
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
}
