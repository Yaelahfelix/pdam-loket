import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }
    const db = await getConnection();

    const query = "SELECT * FROM sipamit_billing.setup_denda LIMIT 1";
    const [data] = await db.query<RowDataPacket[]>(query);

    return NextResponse.json({ status: 200, data: data[0] || {} });
  } catch (error: any) {
    console.log(error);
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
    const { tgl1, tgl2, flagpersen, denda1, denda2 } = body;

    if (
      tgl1 === undefined ||
      tgl2 === undefined ||
      flagpersen === undefined ||
      denda1 === undefined ||
      denda2 === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE sipamit_billing.setup_denda 
      SET tgl1 = ?, tgl2 = ?, flagpersen = ?, denda1 = ?, denda2 = ? 
      WHERE idx = 1
    `;

    await db.query(updateQuery, [tgl1, tgl2, flagpersen, denda1, denda2]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui setup denda",
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
