import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { User } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    const db = await getConnection();
    const body = await req.json();

    // ! Query ke db
    const query = `SELECT u.id, u.username, u.password, u.nama, u.jabatan, u.role_id, r.role, u.is_user_ppob, u.is_active, u.is_user_timtagih
  FROM users u 
  LEFT JOIN role r ON r.id = u.role_id WHERE u.username = ?;
  `;
    const [result] = await db.query<RowDataPacket[]>(query, [body.username]);

    // ? Pengecekan Username
    if (result.length === 0) {
      return NextResponse.json(
        {
          status: 401,
          message: "User tidak ditemukan",
        },
        { status: 401 }
      );
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(body.password, user.password);

    // ? Pengecekan password
    if (!isMatch) {
      return NextResponse.json(
        {
          status: 401,
          message: "Password tidak cocok",
        },
        { status: 401 }
      );
    }

    // ? Pengecekan user aktif
    if (!user.is_active) {
      return NextResponse.json(
        {
          status: 401,
          message: "User tidak aktif, silahkan hubungi admin",
        },
        { status: 401 }
      );
    }

    // ? Cek is user ppod
    if (user.is_user_ppod) {
      return NextResponse.json(
        {
          status: 401,
          message: "Akses user ditolak!",
        },
        { status: 401 }
      );
    }

    // ! Cek loket user
    const queryLoket = `
    SELECT l.id,  l.kodeloket, l.loket, l.aktif as is_loket_aktif, ul.aktif
  FROM user_loket ul 
  LEFT JOIN loket l 
  ON ul.loket_id = l.id WHERE ul.user_id = ? AND l.aktif = 1;
  `;

    const [loketResult] = await db.query<RowDataPacket[]>(queryLoket, [
      user.id,
    ]);

    return NextResponse.json({
      status: 200,
      user,
      loket: loketResult,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
