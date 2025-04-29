import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const { user_id, min_l, max_l } = body;

    if (!user_id || min_l === undefined || max_l === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkQuery = `
        SELECT COUNT(*) as count FROM plot_tim_tagih WHERE user_id = ?
      `;
    const [checkResult] = await db.query<RowDataPacket[]>(checkQuery, [
      user_id,
    ]);

    if (checkResult[0].count > 0) {
      const updateQuery = `
          UPDATE plot_tim_tagih 
          SET min_l = ?, max_l = ?
          WHERE user_id = ?
        `;

      const [result] = await db.query<RowDataPacket[]>(updateQuery, [
        min_l,
        max_l,
        user_id,
      ]);

      return NextResponse.json({
        status: 200,
        message: "Berhasil mengupdate plot tim tagih",
        result,
      });
    } else {
      const insertQuery = `
          INSERT INTO plot_tim_tagih (user_id, min_l, max_l)
          VALUES (?, ?, ?)
        `;

      const [result] = await db.query<RowDataPacket[]>(insertQuery, [
        user_id,
        min_l,
        max_l,
      ]);

      return NextResponse.json({
        status: 200,
        message: "Berhasil mengupdate plot tim tagih",
        result,
      });
    }
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
