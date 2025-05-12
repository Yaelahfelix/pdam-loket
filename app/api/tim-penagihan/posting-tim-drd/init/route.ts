import getConnection from "@/lib/db";
import { formatPeriode } from "@/lib/formatPeriode";
import { verifyAuth } from "@/lib/session";
import { format } from "date-fns";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { blockPpobUsers } from "../blockUserPPOB";

export const POST = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const db = await getConnection();
    const body = await request.json();

    const { periode: selectedPeriod } = body;
    const currentPeriod = format(new Date(), "yyyyMM");

    if (!selectedPeriod) {
      return NextResponse.json(
        { message: "Periode is required" },
        { status: 400 }
      );
    }

    const [periodCheck] = await db.query<RowDataPacket[]>(
      `SELECT * FROM pelanggan_periode WHERE periode = ? LIMIT 1`,
      [selectedPeriod]
    );

    if (!periodCheck || periodCheck.length === 0) {
      return NextResponse.json(
        {
          status: 400,
          message: `Periode ${formatPeriode(
            selectedPeriod
          )} Belum di posting Pelanggan..! Harap Hubungi Operator Jika ingin ada perubahan..!`,
        },
        { status: 400 }
      );
    }

    const [tagihCheck] = await db.query<RowDataPacket[]>(
      `SELECT * FROM tagihan_timtagih WHERE periode = ? LIMIT 1`,
      [selectedPeriod]
    );

    let flagPostUlang = 0;

    if (tagihCheck && tagihCheck.length > 0) {
      if (selectedPeriod !== currentPeriod) {
        return NextResponse.json(
          {
            status: 400,
            message: `Periode ${formatPeriode(
              selectedPeriod
            )} Sudah di Posting..! Harap Hubungi Operator Jika ingin ada perubahan..!`,
          },
          { status: 400 }
        );
      } else {
        flagPostUlang = 1;
      }
    }

    await blockPpobUsers(false);

    if (flagPostUlang === 1) {
      await db.query("START TRANSACTION");
      try {
        await db.query(
          `UPDATE pelanggan_periode SET jmlrek = 0, flagposttimtagih = 0 WHERE periode = ?`,
          [selectedPeriod]
        );

        await db.query(`DELETE FROM tagihan_timtagih WHERE periode = ?`, [
          selectedPeriod,
        ]);
        await db.query("COMMIT");
      } catch (error) {
        await db.query("ROLLBACK");
        throw error;
      }
    }

    const [countResult] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM pelanggan_periode WHERE periode = ? AND status = 1`,
      [selectedPeriod]
    );

    const totalPelanggan = countResult[0].total;
    const batchSize = parseInt(process.env.NUMBER_BATCH_POSTING || "100");
    const totalBatches = Math.ceil(totalPelanggan / batchSize);

    return NextResponse.json({
      status: 200,
      message: "Processing initiated successfully",
      data: {
        selectedPeriod,
        totalPelanggan,
        totalBatches,
        batchSize,
        flagPostUlang,
      },
    });
  } catch (error: any) {
    try {
      await blockPpobUsers(true);
    } catch {}

    console.error(error);
    return NextResponse.json(
      {
        status: error.status || 500,
        message: error.message || "Internal server error",
      },
      { status: error.status || 500 }
    );
  }
};
