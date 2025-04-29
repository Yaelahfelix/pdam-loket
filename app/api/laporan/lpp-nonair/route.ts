import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { formatRupiah } from "@/lib/utils";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tgl1 = searchParams.get("tgl1");
    const tgl2 = searchParams.get("tgl2");
    const userId = searchParams.get("user_id");
    const loketId = searchParams.get("loket_id");
    const jenisId = searchParams.get("jenis_id");

    if (!tgl1 || !tgl2) {
      return NextResponse.json(
        { status: 400, message: "tgl1 and 2 query is required" },
        { status: 400 }
      );
    }

    let query = `
   SELECT id, no_pembayaran, tglbayar, jenisnonair, nama, alamat, jumlah, ppn, total, nama_user as kasir, nama_loket FROM sipamit_billing.penerimaan_nonair 
      WHERE date(tglbayar) BETWEEN ? AND ?
    `;

    const params: any[] = [tgl1, tgl2];

    if (userId) {
      query += " AND user_id = ?";
      params.push(userId);
    }

    if (loketId) {
      query += " AND loket_id = ?";
      params.push(loketId);
    }

    if (jenisId) {
      query += " AND jenisnonair_id = ?";
      params.push(jenisId);
    }

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    let totalTagihan = 0;
    let totalKeseluruhan = 0;
    let totalPPN = 0;
    const dataWithIndex = rows.map((row, index) => {
      totalTagihan += row.jumlah;
      totalKeseluruhan += row.total;
      totalPPN += row.ppn;

      return {
        no: index + 1,
        ...row,
        jumlah: formatRupiah(row.jumlah),
        ppn: formatRupiah(row.ppn),
        total: formatRupiah(row.total),
      };
    });

    return NextResponse.json({
      status: 200,
      total: {
        tagihan: formatRupiah(totalTagihan),
        ppn: formatRupiah(totalPPN),
        keseluruhan: formatRupiah(totalKeseluruhan),
      },
      filter: buildFilterStringNonAir(userId, loketId, jenisId, searchParams),

      data: dataWithIndex,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
};

function buildFilterStringNonAir(
  userId: string | null,
  loketId: string | null,
  jenisId: string | null,
  searchParams: URLSearchParams
): string {
  let filter = "";

  if (userId) {
    const userName = searchParams.get("user_name") || userId;
    filter += `|KASIR : ${userName}`;
  }

  if (loketId) {
    const loketName = searchParams.get("loket_name") || loketId;
    filter += `|LOKET : ${loketName}`;
  }

  if (jenisId) {
    const jenisName = searchParams.get("jenis_name") || jenisId;
    filter += `|JENIS : ${jenisName}`;
  }

  return filter;
}
