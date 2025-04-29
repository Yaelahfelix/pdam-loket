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
    const id = searchParams.get("id") || "";

    const db = await getConnection();
    
    const [data] = await db.query<RowDataPacket[]>(
      `
     SELECT GROUP_CONCAT(b.nama) AS nama FROM plot_rute_tim_tagih a LEFT JOIN users  b ON a.user_id=b.id and b.is_user_ppob=0 and b.is_user_timtagih=1 WHERE a.rayon_id=? 
      `,
      [`${id}`]
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
