import getConnection from "@/lib/db";
import {
  getPaginatedData,
  PaginationParams,
  withPagination,
} from "@/lib/paginationServer";
import { verifyAuth } from "@/lib/session";
import { Kolektif } from "@/types/kolektif";
import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

interface KolektifRecord extends RowDataPacket, Kolektif {}
export const GET = async (request: NextRequest) => {
  const authResult = await verifyAuth(request);

  if (!authResult.isAuthenticated) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  return withPagination<KolektifRecord>(
    request,
    async (db: Pool, params: PaginationParams) => {
      let baseQuery = `
      SELECT 
        k.id, 
        k.no_kolektif, 
        k.nama, 
        k.telp,
        CASE 
          WHEN COUNT(p.id) = 0 THEN NULL 
          ELSE JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', p.id,
              'no_pelanggan', p.no_pelanggan,
              'kolektif_id', k.id,
              'nama_pelanggan', p.nama
            )
          ) 
        END AS pelanggan_array
      FROM kolektif k
      LEFT JOIN pelanggan p ON p.kolektif_id = k.id
      `;

      let paramsArray: any[] = [];

      if (query) {
        baseQuery += ` WHERE (k.no_kolektif LIKE ? OR k.nama LIKE ?) `;
        paramsArray.push(`%${query}%`, `%${query}%`);
      }

      baseQuery += `
        GROUP BY k.id, k.no_kolektif, k.nama, k.telp
      `;

      return await getPaginatedData<KolektifRecord>(
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
    const { no_kolektif, nama, telp } = body;

    if (!no_kolektif || !nama || !telp) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkQuery = `SELECT COUNT(*) AS count FROM kolektif WHERE no_kolektif = ?`;
    const [checkResult] = await db.query<RowDataPacket[]>(checkQuery, [
      no_kolektif,
    ]);

    if (checkResult[0].count > 0) {
      return NextResponse.json(
        { message: "No kolektif sudah ada, silakan coba yang lain!" },
        { status: 409 }
      );
    }

    const insertQuery = `INSERT INTO kolektif (no_kolektif, nama, telp, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`;
    await db.query(insertQuery, [no_kolektif, nama, telp]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menambahkan kolektif",
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
    const { id, no_kolektif, nama, telp } = body;

    if (!id || !no_kolektif || !nama || !telp) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkQuery = `SELECT COUNT(*) AS count FROM kolektif WHERE id = ?`;
    const [checkResult] = await db.query<RowDataPacket[]>(checkQuery, [id]);

    if (checkResult[0].count === 0) {
      return NextResponse.json(
        { message: "Kolektif tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateQuery = `UPDATE kolektif SET no_kolektif = ?, nama = ?, telp = ?, updated_at = NOW() WHERE id = ?`;
    await db.query(updateQuery, [no_kolektif, nama, telp, id]);

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

    const checkQuery = `SELECT COUNT(*) AS count FROM kolektif WHERE id = ?`;
    const [checkResult] = await db.query<RowDataPacket[]>(checkQuery, [id]);

    if (checkResult[0].count === 0) {
      return NextResponse.json(
        { message: "Kolektif tidak ditemukan" },
        { status: 404 }
      );
    }

    const deleteQuery = `DELETE FROM kolektif WHERE id = ?`;
    await db.query(deleteQuery, [id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus kolektif",
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
