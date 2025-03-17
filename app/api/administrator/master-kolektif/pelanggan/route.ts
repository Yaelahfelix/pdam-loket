import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const { no_pelanggan, kolektif_id } = body;

    if (!no_pelanggan || kolektif_id === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkQuery = `SELECT COUNT(*) AS count FROM pelanggan WHERE no_pelanggan = ? AND kolektif_id IS NOT NULL`;
    const [checkResult] = await db.query<RowDataPacket[]>(checkQuery, [
      no_pelanggan,
    ]);

    if (checkResult[0].count !== 0) {
      return NextResponse.json(
        {
          message:
            "Nomor pelanggan ini sudah di gunakan dengan kolektif yang lain!",
        },
        { status: 409 }
      );
    }

    const updateQuery = `UPDATE pelanggan SET kolektif_id = ?, updated_at = NOW() WHERE no_pelanggan = ?`;
    await db.query(updateQuery, [kolektif_id, no_pelanggan]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui kolektif",
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

export const DELETE = async (request: NextRequest) => {
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
        { message: "Missing required field: id" },
        { status: 400 }
      );
    }

    const checkQuery = `SELECT COUNT(*) AS count FROM pelanggan WHERE id = ?`;
    const [checkResult] = await db.query<RowDataPacket[]>(checkQuery, [id]);

    if (checkResult[0].count === 0) {
      return NextResponse.json(
        { message: "Pelanggan tidak ditemukan" },
        { status: 404 }
      );
    }

    const deleteQuery = `UPDATE pelanggan SET kolektif_id = NULL, updated_at = NOW() WHERE id = ?`;
    await db.query(deleteQuery, [id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus pelanggan kolektif",
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
