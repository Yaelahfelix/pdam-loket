import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const aplikasiId = process.env.APLIKASI_DB_ID;

    const [result] = await db.query<RowDataPacket[]>(
      `  SELECT d.id, d.namamenu, d.icon from menudetail d left join menuutama mu on d.menu_id = mu.id where mu.aplikasi_id = ?`,
      [aplikasiId]
    );
    return NextResponse.json({
      status: 200,
      data: result,
    });
  } catch (error: any) {
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
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const { id, icon } = body;

    if (!id || !icon) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkMenuQuery = `SELECT COUNT(*) AS count FROM sipamit_billing.menudetail WHERE id = ?`;
    const [menuCheck] = await db.query<RowDataPacket[]>(checkMenuQuery, [id]);

    if (menuCheck[0].count === 0) {
      return NextResponse.json(
        { message: "Menu detail tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateQuery = `
      UPDATE sipamit_billing.menudetail 
      SET icon = ?
      WHERE id = ?
    `;

    await db.query(updateQuery, [icon, id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui icon sidebar",
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
