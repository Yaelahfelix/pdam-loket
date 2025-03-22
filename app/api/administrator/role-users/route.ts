import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const [roles] = await db.query<RowDataPacket[]>(`
        SELECT id, role FROM role;
      `);

    return NextResponse.json({
      status: 200,
      data: roles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
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
    const { id, role_id, menu_id } = body;

    if (!role_id) {
      return NextResponse.json(
        { error: "Field role_id diperlukan" },
        { status: 400 }
      );
    }

    // Jika menu_id undefined tapi ada id dan role_id, lakukan delete
    if (id && role_id && menu_id === undefined) {
      const deleteQuery = "DELETE FROM role_akses WHERE id = ?";
      await db.query(deleteQuery, [id]);
      return NextResponse.json({
        status: 200,
        message: "Berhasil menghapus role akses",
      });
    }

    // Jika ada role_id dan menu_id tanpa id, lakukan insert
    if (!id && role_id && menu_id !== undefined) {
      const insertQuery =
        "INSERT INTO role_akses (role_id, menu_id) VALUES (?, ?)";
      await db.query(insertQuery, [role_id, menu_id]);
      return NextResponse.json({
        status: 200,
        message: "Berhasil menambahkan role akses",
      });
    }

    // Jika ada id, role_id, dan menu_id, lakukan update
    if (id && role_id && menu_id !== undefined) {
      const updateQuery =
        "UPDATE role_akses SET role_id = ?, menu_id = ? WHERE id = ?";
      await db.query(updateQuery, [role_id, menu_id, id]);
      return NextResponse.json({
        status: 200,
        message: "Berhasil memperbarui role akses",
      });
    }

    return NextResponse.json(
      { error: "Permintaan tidak valid" },
      { status: 400 }
    );
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
