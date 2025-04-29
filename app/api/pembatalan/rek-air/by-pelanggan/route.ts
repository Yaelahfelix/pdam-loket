import { NextRequest, NextResponse } from "next/server";
import { OkPacket, RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const nopel = searchParams.get("nopel");
    const tgl = searchParams.get("tgl");

    const [pelangganRows] = await db.query<RowDataPacket[]>(
      `SELECT p.id,p.status,p.no_pelanggan,p.nama,p.alamat,g.kode_golongan as golongan, r.nama as rayon FROM pelanggan p 
LEFT JOIN golongan g ON g.id = p.golongan_id
LEFT JOIN rayon r ON r.id = p.rayon_id
WHERE no_pelanggan = ?`,
      [nopel]
    );

    if (pelangganRows.length === 0) {
      return NextResponse.json(
        { status: 404, message: "Nopel tidak ditemukan!" },
        { status: 404 }
      );
    }
    const [data] = await db.query<RowDataPacket[]>(
      "CALL infobayar_desk_batal(?,?)",
      [nopel, tgl]
    );

    return NextResponse.json({
      status: 200,
      data: data[0],
      pelanggan: pelangganRows[0],
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

      console.log("kop");
      console.log(item);
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
