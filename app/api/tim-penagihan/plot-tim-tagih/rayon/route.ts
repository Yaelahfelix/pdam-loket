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
      SELECT a.*,IFNULL(b.jml,0) AS jumlah FROM rayon a LEFT JOIN (SELECT COUNT(id) AS jml,rayon_id FROM pelanggan WHERE STATUS=1 GROUP BY rayon_id) b ON a.id=b.rayon_id
      `
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
