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

    const db = await getConnection();
    const [data] = await db.query<RowDataPacket[]>(
      `
     SELECT * FROM users WHERE is_user_ppob=0 and is_user_timtagih=1 ORDER BY nama 
      `
    );

    const resData = data.map((data) => ({
      id: data.id,
      nama: data.nama,
      jabatan: data.jabatan,
    }));

    return NextResponse.json({
      status: 200,
      data: resData,
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
