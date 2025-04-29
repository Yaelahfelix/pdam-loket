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
    const query = "SELECT * FROM sipamit_billing.loket";
    const [data] = await db.query<RowDataPacket[]>(query);

    return NextResponse.json({ status: 200, data });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const { user_id, loket_id, aktif } = body;

    if (!user_id || !loket_id || aktif === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const checkQuery = `
    SELECT COUNT(*) as count FROM user_loket WHERE user_id = ? AND loket_id = ?
  `;
    const [checkResult] = await db.query<RowDataPacket[]>(checkQuery, [
      user_id,
      loket_id,
    ]);

    if (checkResult[0].count > 0) {
      return NextResponse.json(
        { message: "User sudah terdaftar di loket ini" },
        { status: 409 }
      );
    }

    const insertQuery = `
        INSERT INTO user_loket (user_id, loket_id, aktif)
        VALUES (?, ?, ?)
      `;

    const [result] = await db.query<RowDataPacket[]>(insertQuery, [
      user_id,
      loket_id,
      aktif,
    ]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menambahkan user ke loket",
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
    const { id, user_id, loket_id, aktif } = body;

    if (!id || !user_id || !loket_id || aktif === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkUserLoketQuery = `SELECT COUNT(*) AS count FROM sipamit_billing.user_loket WHERE id = ?`;
    const [userLoketCheck] = await db.query<RowDataPacket[]>(
      checkUserLoketQuery,
      [id]
    );

    if (userLoketCheck[0].count === 0) {
      return NextResponse.json(
        { message: "User loket tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateQuery = `
        UPDATE sipamit_billing.user_loket 
        SET user_id = ?, loket_id = ?, aktif = ?
        WHERE id = ?
      `;

    await db.query(updateQuery, [user_id, loket_id, aktif, id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui user loket",
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

    const checkUserLoketQuery = `SELECT COUNT(*) AS count FROM sipamit_billing.user_loket WHERE id = ?`;
    const [userLoketCheck] = await db.query<RowDataPacket[]>(
      checkUserLoketQuery,
      [id]
    );

    if (userLoketCheck[0].count === 0) {
      return NextResponse.json(
        { message: "User loket tidak ditemukan" },
        { status: 404 }
      );
    }

    const deleteQuery = `DELETE FROM sipamit_billing.user_loket WHERE id = ?`;
    await db.query(deleteQuery, [id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus user loket",
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
