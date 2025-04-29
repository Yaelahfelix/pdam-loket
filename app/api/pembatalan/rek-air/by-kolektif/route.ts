import { NextRequest, NextResponse } from "next/server";
import { OkPacket, RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    console.log("hit");
    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const tgl = searchParams.get("tgl");
    const kolektif_id = searchParams.get("kolektif_id");

    console.log(kolektif_id);
    const [nopel] = await db.query<RowDataPacket[]>(
      "SELECT no_pelanggan FROM pelanggan WHERE kolektif_id = ?;",
      [kolektif_id]
    );
    console.log("hi");
    console.log(nopel);

    const [kolektif] = await db.query<RowDataPacket[]>(
      "SELECT no_kolektif, nama FROM sipamit_billing.kolektif WHERE id = ?; ",
      [kolektif_id]
    );

    const allData = [];

    for (let i = 0; i < nopel.length; i++) {
      const [data] = await db.query<RowDataPacket[]>(
        "CALL infobayar_desk_batal(?,?)",
        [nopel[i].no_pelanggan, tgl]
      );

      allData.push(...(data[0] as any));
    }

    return NextResponse.json({
      status: 200,
      data: allData,
      kolektif: kolektif[0],
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const requestData = await request.json();
    const { data, user_name, alasan } = requestData.data;

    for (const item of data) {
      await db.query(
        `
          INSERT INTO hisbatalair 
          SELECT 0,id,no_pelanggan,?,?,NOW(),tglbayar,nama_user,nama_loket,totalrekening 
          from drd 
          WHERE id=?

        `,
        [user_name, alasan, item.id]
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
        [item.id]
      );
    }

    return NextResponse.json({
      status: 200,
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
