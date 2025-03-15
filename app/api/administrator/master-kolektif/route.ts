import getConnection from "@/lib/db";
import {
  getPaginatedData,
  PaginationParams,
  withPagination,
} from "@/lib/paginationServer";
import { verifyAuth } from "@/lib/session";
import { Kolektif } from "@/types/kolektif";
import { User } from "@/types/user";
import { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

interface KolektifRecord extends RowDataPacket, Kolektif {}
export const GET = async (request: NextRequest) => {
  const authResult = await verifyAuth(request);

  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
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
              'no_pelanggan', p.no_pelanggan,
              'nama_pelanggan', p.nama
            )
          ) 
        END AS pelanggan_array
      FROM kolektif k
      LEFT JOIN kolektif_pelanggan kp ON kp.kolektif_id = k.id
      LEFT JOIN pelanggan p ON p.id = kp.pelanggan_id
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
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const { kodeloket, loket, aktif } = body;

    if (!kodeloket || !loket || aktif === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkLoketQuery = `SELECT COUNT(*) AS count FROM sipamit_billing.loket WHERE kodeloket = ?`;
    const [loketCheck] = await db.query<RowDataPacket[]>(checkLoketQuery, [
      kodeloket,
    ]);

    if (loketCheck[0].count > 0) {
      return NextResponse.json(
        { error: "Kode loket sudah ada, silahkan coba yang lain!" },
        { status: 409 }
      );
    }

    const insertQuery = `
      INSERT INTO sipamit_billing.loket (kodeloket, loket, aktif)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query<RowDataPacket[]>(insertQuery, [
      kodeloket,
      loket,
      aktif,
    ]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil membuat loket",
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
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const { id, kodeloket, loket, aktif } = body;

    if (!id || !kodeloket || !loket || aktif === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkLoketQuery = `SELECT COUNT(*) AS count FROM sipamit_billing.loket WHERE id = ?`;
    const [loketCheck] = await db.query<RowDataPacket[]>(checkLoketQuery, [id]);

    if (loketCheck[0].count === 0) {
      return NextResponse.json(
        { error: "Loket tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateQuery = `
      UPDATE sipamit_billing.loket 
      SET kodeloket = ?, loket = ?, aktif = ?
      WHERE id = ?
    `;

    await db.query(updateQuery, [kodeloket, loket, aktif, id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui loket",
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
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const checkLoketQuery = `SELECT COUNT(*) AS count FROM sipamit_billing.loket WHERE id = ?`;
    const [loketCheck] = await db.query<RowDataPacket[]>(checkLoketQuery, [id]);

    if (loketCheck[0].count === 0) {
      return NextResponse.json(
        { error: "Loket tidak ditemukan" },
        { status: 404 }
      );
    }

    const deleteQuery = `DELETE FROM sipamit_billing.loket WHERE id = ?`;
    await db.query(deleteQuery, [id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus loket",
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
