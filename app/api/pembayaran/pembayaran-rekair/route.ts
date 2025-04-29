import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { DataPembayaranRekAir } from "@/types/pembayran-rekair";
import { format, formatDate } from "date-fns";
import { OkPacket, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const requestData = await request.json();
    const data: DataPembayaranRekAir[] = requestData.data;
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

    for (const item of data) {
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
