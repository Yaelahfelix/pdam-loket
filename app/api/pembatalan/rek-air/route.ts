import { NextRequest, NextResponse } from "next/server";
import { OkPacket, RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const requestData = await request.json();
    const { data, user_name, alasan } = requestData;

    console.log(data);
    for (const item of data) {
      await db.query(
        `
          INSERT INTO hisbatalair 
          SELECT 0,id,no_pelanggan,?,?,NOW(),tglbayar,nama_user,nama_loket,totalrekening 
          from drd 
          WHERE id=?
        `,
        [user_name, alasan, item]
      );

      await db.query(
        `
            UPDATE drd 
            SET flaglunas=0,tglbayar=null,
            user_id=null,nama_user=null,
            loket_id=null,nama_loket=null,
            denda=0,meterai=0,admin_ppob=0,
            totalrekening=0 WHERE id=?
  
          `,
        [item]
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Pembayaran behasil dibatalkan!",
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
