import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const db = await getConnection();
    const [settings] = await db.query<RowDataPacket[]>(
      `SELECT * FROM sipamit_billing.settingdesktop LIMIT 1`
    );

    return NextResponse.json({ status: 200, data: settings[0] });
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

export const PUT = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const {
      headerlap1,
      headerlap2,
      alamat1,
      alamat2,
      footerkota,
      stricpayment,
      information,
    } = body;

    const updateQuery = `
        UPDATE sipamit_billing.settingdesktop 
        SET  headerlap1 = ?, headerlap2 = ?, alamat1 = ?, alamat2 = ?, footerkota = ?, stricpayment = ?,
        WHERE idx = 1
      `;

    await db.query(updateQuery, [
      headerlap1,
      headerlap2,
      alamat1,
      alamat2,
      footerkota,
      stricpayment,
    ]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui pengaturan",
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
