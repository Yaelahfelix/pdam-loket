import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const query = "SELECT * FROM pel_coklit";
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
    const { no_pelanggan } = body;

    if (!no_pelanggan) {
      return NextResponse.json(
        { error: "Missing required field: no_pelanggan" },
        { status: 400 }
      );
    }

    const insertQuery = "INSERT INTO pel_coklit (no_pelanggan) VALUES (?)";
    await db.query(insertQuery, [no_pelanggan]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menambahkan data pelanggan",
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
    const { id, no_pelanggan } = body;

    if (!id || !no_pelanggan) {
      return NextResponse.json(
        { error: "Missing required fields: id, no_pelanggan" },
        { status: 400 }
      );
    }

    const updateQuery = "UPDATE pel_coklit SET no_pelanggan = ? WHERE id = ?";
    await db.query(updateQuery, [no_pelanggan, id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui data pelanggan",
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

    const deleteQuery = "DELETE FROM pel_coklit WHERE id = ?";
    await db.query(deleteQuery, [id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus data pelanggan",
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
