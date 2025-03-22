import getConnection from "@/lib/db";
import {
  getPaginatedData,
  PaginationParams,
  withPagination,
} from "@/lib/paginationServer";
import { verifyAuth } from "@/lib/session";
import { User } from "@/types/user";
import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface UserRecord extends RowDataPacket, User {}
export const GET = async (request: NextRequest) => {
  const authResult = await verifyAuth(request);

  if (!authResult.isAuthenticated) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const is_user_active = searchParams.get("is_user_active");
  const is_user_ppob = searchParams.get("is_user_ppob");
  const is_user_timtagih = searchParams.get("is_user_timtagih");
  return withPagination<UserRecord>(
    request,
    async (db: Pool, params: PaginationParams) => {
      let baseQuery = `
SELECT 
  u.id, 
  u.username, 
  u.nama, 
  u.jabatan, 
  r.role, 
  u.role_id,
  u.is_user_ppob, 
  u.is_active, 
  u.is_user_timtagih,
  ptt.min_l,
  ptt.max_l,
  CASE 
    WHEN COUNT(l.id) = 0 THEN NULL 
    ELSE JSON_ARRAYAGG(
      JSON_OBJECT( 
        'id', ul.id,
        'loket_id', l.id,
        'kodeloket', l.kodeloket,
        'loket', l.loket,
        'user_id', u.id,
        'aktif', ul.aktif,
        'is_loket_aktif', l.aktif
      )
    ) 
  END as loket_array
FROM users u 
LEFT JOIN role r ON r.id = u.role_id
LEFT JOIN user_loket ul ON ul.user_id = u.id
LEFT JOIN loket l ON l.id = ul.loket_id 
LEFT JOIN plot_tim_tagih ptt on ptt.user_id = u.id
      `;

      let paramsArray: any[] = [];
      let conditions: string[] = [];

      if (query) {
        conditions.push(`(u.username LIKE ? OR u.nama LIKE ?)`);
        paramsArray.push(`%${query}%`, `%${query}%`);
      }

      if (is_user_active !== null) {
        conditions.push(`u.is_active = ?`);
        paramsArray.push(is_user_active);
      }

      if (is_user_ppob !== null) {
        conditions.push(`u.is_user_ppob = ?`);
        paramsArray.push(is_user_ppob);
      }

      if (is_user_timtagih !== null) {
        conditions.push(`u.is_user_timtagih = ?`);
        paramsArray.push(is_user_timtagih);
      }

      if (conditions.length > 0) {
        baseQuery += ` WHERE ` + conditions.join(" AND ");
      }

      baseQuery += `
        GROUP BY u.id, u.username, u.nama, u.jabatan, r.role, u.is_user_ppob, u.is_active, u.is_user_timtagih
    `;

      return await getPaginatedData<UserRecord>(
        db,
        baseQuery,
        undefined,
        paramsArray,
        params
      );
    }
  );
};

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const {
      username,
      password,
      nama,
      jabatan,
      role_id,
      is_user_ppob,
      is_active,
      is_user_timtagih,
    } = body;

    if (
      !username ||
      !password ||
      !nama ||
      !jabatan ||
      role_id === undefined ||
      is_user_ppob === undefined ||
      is_active === undefined ||
      is_user_timtagih === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkUserQuery = `SELECT COUNT(*) AS count FROM users WHERE username = ?`;
    const [userCheck] = await db.query<RowDataPacket[]>(checkUserQuery, [
      username,
    ]);

    if (userCheck[0].count > 0) {
      return NextResponse.json(
        {
          status: 409,
          message: "Username sudah ada, silahkan coba yang lain!",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (username, password, nama, jabatan, role_id, is_user_ppob, is_active, is_user_timtagih)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query<RowDataPacket[]>(query, [
      username,
      hashedPassword,
      nama,
      jabatan,
      role_id,
      is_user_ppob,
      is_active,
      is_user_timtagih,
    ]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil membuat user",
      result,
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
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      nama,
      jabatan,
      role_id,
      is_user_ppob,
      is_active,
      is_user_timtagih,
    } = body;

    if (
      !id ||
      !nama ||
      !jabatan ||
      role_id === undefined ||
      is_user_ppob === undefined ||
      is_active === undefined ||
      is_user_timtagih === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkUserQuery = `SELECT COUNT(*) AS count FROM users WHERE id = ?`;
    const [userCheck] = await db.query<RowDataPacket[]>(checkUserQuery, [id]);

    if (userCheck[0].count === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateQuery = `
      UPDATE users 
      SET nama = ?, jabatan = ?, role_id = ?, is_user_ppob = ?, is_active = ?, is_user_timtagih = ?
      WHERE id = ?
    `;

    await db.query(updateQuery, [
      nama,
      jabatan,
      role_id,
      is_user_ppob,
      is_active,
      is_user_timtagih,
      id,
    ]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengupdate user",
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
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const checkUserQuery = `SELECT COUNT(*) AS count FROM users WHERE id = ?`;
    const [userCheck] = await db.query<RowDataPacket[]>(checkUserQuery, [id]);

    if (userCheck[0].count === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const deleteQuery = `DELETE FROM users WHERE id = ?`;
    await db.query(deleteQuery, [id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus user",
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
