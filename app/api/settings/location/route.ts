import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const db = await getConnection();
    const [settings] = await db.query<RowDataPacket[]>(
      `SELECT latitude, longitude FROM sipamit_billing.settingdesktop LIMIT 1`
    );

    if (!settings.length) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      data: settings[0],
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

export const PUT = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const db = await getConnection();
    const body = await request.json();
    const { latitude, longitude } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { message: "Latitude dan Longitude wajib diisi" },
        { status: 400 }
      );
    }

    const updateQuery = `
          UPDATE sipamit_billing.settingdesktop 
          SET latitude = ?, longitude = ?
          WHERE idx = 1
        `;

    await db.query(updateQuery, [latitude, longitude]);

    return NextResponse.json({
      status: 200,
      message: "Latitude dan Longitude berhasil diperbarui",
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
