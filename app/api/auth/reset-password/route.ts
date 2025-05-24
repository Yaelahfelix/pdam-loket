import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const db = await getConnection();
    const body = await req.json();
    const { username, oldPassword, newPassword } = body;

    if (!username || !oldPassword || !newPassword) {
      return NextResponse.json(
        { status: 400, message: "field ga lengkap" },
        { status: 400 }
      );
    }

    const queryUser = `SELECT id, password, is_active FROM users WHERE username = ?`;
    const [users] = await db.query<RowDataPacket[]>(queryUser, [username]);

    if (users.length === 0) {
      return NextResponse.json(
        { status: 404, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const user = users[0];

    if (!user.is_active) {
      return NextResponse.json(
        { status: 403, message: "User tidak aktif" },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { status: 401, message: "Password lama tidak cocok" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = `UPDATE users SET password = ? WHERE username = ?`;
    await db.query(updateQuery, [hashedPassword, username]);

    return NextResponse.json({
      status: 200,
      message: "Password berhasil diubah",
    });
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
