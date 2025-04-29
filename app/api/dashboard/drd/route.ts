import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { format } from "date-fns";

const bacameterDbConfig = {
  host: process.env.DB_HOST_BACAMETER,
  port: parseInt(process.env.DB_PORT_BACAMETER!),
  user: process.env.DB_USER_BACAMETER,
  password: process.env.DB_PASSWORD_BACAMETER,
  database: process.env.DB_NAME_BACAMETER,
};

const getCurrentPeriod = () => {
  return format(new Date(), "yyyyMM");
};

export const GET = async (request: NextRequest) => {
  const db = await mysql.createConnection(bacameterDbConfig);
  try {
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const [drd] = await db.query<RowDataPacket[]>(
      `select sum(sudahbaca) as sudahbaca,sum(if(sudahbaca,totalrekening,0)) as jumlahdrd,sum(if(sudahbaca,0,1)) as belumbaca,petugas_plot  from hasilbaca 
where periode=? group by petugas_id_plot
`,
      [getCurrentPeriod()]
    );

    return NextResponse.json({
      status: 200,
      data: drd,
      total: {
        sudahbaca: drd.reduce(
          (acc, curr) => acc + Number(curr.sudahbaca || 0),
          0
        ),
        belumbaca: drd.reduce(
          (acc, curr) => acc + Number(curr.belumbaca || 0),
          0
        ),
        jumlahdrd: drd.reduce(
          (acc, curr) => acc + Number(curr.jumlahdrd || 0),
          0
        ),
      },
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await db.end();
  }
};
