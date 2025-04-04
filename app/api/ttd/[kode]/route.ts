import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ kode: string }>;

export const GET = async (
  request: NextRequest,
  { params }: { params: Params }
) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const { kode } = await params;

    const [ttd] = await db.query<RowDataPacket[]>(
      `
        SELECT ttd.*, 
          up1.nama as nama1, up1.jabatan as jabatan1,
          up2.nama as nama2, up2.jabatan as jabatan2,
          up3.nama as nama3, up3.jabatan as jabatan3,
          up4.nama as nama4, up4.jabatan as jabatan4
        FROM ttdlap ttd 
        LEFT JOIN userparaf up1 ON up1.id = ttd.id1
        LEFT JOIN userparaf up2 ON up2.id = ttd.id2
        LEFT JOIN userparaf up3 ON up3.id = ttd.id3
        LEFT JOIN userparaf up4 ON up4.id = ttd.id4
        WHERE ttd.kode = ?;
      `,
      [kode]
    );

    if (!ttd.length) {
      return NextResponse.json({ status: 404, message: "Data not found" });
    }

    return NextResponse.json({ status: 200, data: ttd[0] });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};
