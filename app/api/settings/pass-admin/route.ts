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
    const query = `select SUBSTR(MD5(date_format(current_date,"%m%Y%d")), 4, 4) AS passadmin`;
    const [data] = await db.query<RowDataPacket[]>(query);

    return NextResponse.json({ status: 200, data: data[0] });
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
    const { password } = body;

    const query = `select SUBSTR(MD5(date_format(current_date,"%m%Y%d")), 4, 4) AS passadmin`;
    const [data] = await db.query<RowDataPacket[]>(query);
    const serverPassword = data[0].passadmin;

    const passwordMatches = password === serverPassword;

    return NextResponse.json({
      status: 200,
      isValid: passwordMatches,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};
