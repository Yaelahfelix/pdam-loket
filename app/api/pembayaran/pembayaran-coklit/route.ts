import { NextRequest, NextResponse } from "next/server";
import { OkPacket, RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { formatRupiah } from "@/lib/utils";
import { format, formatDate } from "date-fns";
import { TagihanPelcoklit } from "@/types/pelCoklit";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const periode = searchParams.get("periode");
    const isAdmin = searchParams.get("isAdmin");
    const tglAdmin = searchParams.get("tglAdmin");
    const [pelCoklit] = await db.query<RowDataPacket[]>(
      "SELECT * FROM sipamit_billing.pel_coklit;"
    );

    let data = [];
    for (let i = 0; i < pelCoklit.length; i++) {
      let query;
      let params;
      if (isAdmin) {
        query = `CALL infotag_desk_coklit(?,?,?)`;
        params = [pelCoklit[i].no_pelanggan, tglAdmin, periode];
      } else {
        query = `CALL infotag_desk_coklit(?,CURRENT_DATE,?)`;
        params = [pelCoklit[i].no_pelanggan, periode];
      }

      const [tagihan] = await db.query<RowDataPacket[]>(query, params);

      data.push({
        no_pelanggan: pelCoklit[i].no_pelanggan,
        tagihan: tagihan[0],
      });
    }

    return NextResponse.json({
      status: 200,
      data,
    });
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

    const requestData = await request.json();
    const data: TagihanPelcoklit[] = requestData.data;
    const filterData = data.filter((item) => item.tagihan.length > 0);
    const detail = requestData.detail;

    const successfulUpdates: number[] = [];

    const todayFormatted = formatDate(new Date(), "yyyy-MM-dd");
    const todayHourFormatted = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    if (!detail.isAdmin && detail.tglbayar !== todayFormatted) {
      return NextResponse.json(
        {
          status: 403,
          message: "Ditolak di server - ERR1",
          code: "ERR1",
        },
        {
          status: 403,
        }
      );
    }

    for (const items of data) {
      for (const item of items.tagihan) {
        const updateQuery = `
          UPDATE sipamit_billing.drd 
          SET 
            flaglunas = 1,
            tglbayar = ?,
            user_id = ?,
            nama_user = ?,
            loket_id = ?,
            nama_loket = ?,
            denda = ?,
            meterai = ?,
            totalrekening = ?
          WHERE id = ? AND flaglunas = "0"
        `;

        console.log(detail);
        const [result] = await db.query<OkPacket>(updateQuery, [
          detail.isAdmin ? detail.tglbayar : todayHourFormatted,
          detail.user_id,
          detail.user_name,
          detail.loket_id,
          detail.loket_name,
          Number(item.denda1) + Number(item.denda2),
          item.materai,
          item.totalrek,
          item.id,
        ]);

        if (result.affectedRows > 0) {
          successfulUpdates.push(item.id);
        }
      }
    }

    if (successfulUpdates.length > 0) {
      const placeholders = successfulUpdates.map(() => "?").join(",");
      const query = `
        SELECT 
          id, no_pelanggan, periode_rek, nama, alamat, rayon, kodegol, 
          harga_air, pemeliharaan, administrasi, stanskrg, stanlalu, 
          pakaiskrg, meterai, angsuran, angsuranke, denda, 
          totalrekening, tglbayar, nama_user, nama_loket
        FROM sipamit_billing.drd
        WHERE id IN (${placeholders})
      `;

      const [updatedData] = await db.query<RowDataPacket[]>(
        query,
        successfulUpdates
      );

      if (detail.isAdmin) {
        const query2 = `insert into hisbayaradmin (userbayar,tglbayarset) value (?,?)`;
        await db.query<RowDataPacket[]>(query2, [
          detail.user_name,
          detail.tglbayar,
        ]);
      }

      return NextResponse.json({
        status: 200,
        data: updatedData,
      });
    } else {
      return NextResponse.json({
        status: 200,
        message: "No records were updated",
        updated: 0,
        totalRecords: data.length,
      });
    }
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
