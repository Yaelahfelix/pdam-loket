import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "Parameter 'id' wajib diisi" },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE sipamit_billing.postingbatch_backup
      SET status = 'SUCCESS'
      WHERE id = ?
    `;

    const [result] = await db.query(updateQuery, [id]);
    await db.query("DELETE FROM temp_posting_log;");

    if ((result as any).affectedRows > 0) {
      return NextResponse.json({
        status: 200,
        message: `Status backup ID ${id} berhasil diupdate menjadi SUCCESS`,
      });
    } else {
      return NextResponse.json({
        status: 404,
        message: `Data dengan ID ${id} tidak ditemukan`,
      });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        status: error.status || 500,
        message: error.message || "Internal server error",
      },
      { status: error.status || 500 }
    );
  }
};
