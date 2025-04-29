import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { formatRupiah } from "@/lib/utils";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const tgl1 = searchParams.get("tgl1");
    const tgl2 = searchParams.get("tgl2");
    const userId = searchParams.get("user_id");
    const loketId = searchParams.get("loket_id");
    const hasMeterai = searchParams.get("has_meterai");
    const golId = searchParams.get("gol_id");
    const kecId = searchParams.get("kec_id");

    if (!tgl1 || !tgl2) {
      return NextResponse.json(
        { status: 400, message: "tgl1 and 2 query is required" },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        a.no_pelanggan, a.nama, a.golongan, a.kodegol,  a.meterai, a.denda, a.admin_ppob, a.totalrekening,
        convertperiode(a.periode_rek) as periodestr,
        a.harga_air+a.airlimbah+a.administrasi+a.pemeliharaan+a.retribusi+a.pelayanan+a.angsuran as rekair, a.tglbayar
      FROM drd a 
      WHERE date(tglbayar) BETWEEN ? AND ?
    `;

    const params: any[] = [tgl1, tgl2];

    if (userId) {
      query += " AND a.user_id = ?";
      params.push(userId);
    }

    if (loketId) {
      query += " AND a.loket_id = ?";
      params.push(loketId);
    }

    if (hasMeterai === "true") {
      query += " AND a.meterai > 0";
    }

    if (golId) {
      query += " AND a.gol_id = ?";
      params.push(golId);
    }

    if (kecId) {
      query += " AND a.kec_id = ?";
      params.push(kecId);
    }

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    let totalMeterai = 0;
    let totalDenda = 0;
    let totalRekair = 0;
    let totalAdminPPOB = 0;
    let totalKeseluruhan = 0;
    const dataWithIndex = rows.map((row, index) => {
      totalMeterai += row.meterai;
      totalDenda += row.denda;
      totalRekair += row.rekair;
      totalAdminPPOB += row.admin_ppob;
      totalKeseluruhan += row.totalrekening;

      return {
        no: index + 1,
        ...row,
        meterai: formatRupiah(row.meterai),
        denda: formatRupiah(row.denda),
        rekair: formatRupiah(row.rekair),
        total: formatRupiah(row.totalrekening),
      };
    });

    return NextResponse.json({
      status: 200,
      total: {
        meterai: formatRupiah(totalMeterai),
        admin_ppob: formatRupiah(totalAdminPPOB),
        denda: formatRupiah(totalDenda),
        rekair: formatRupiah(totalRekair),
        keseluruhan: formatRupiah(totalKeseluruhan),
      },
      filter: buildFilterString(
        userId,
        loketId,
        hasMeterai === "true",
        golId,
        kecId,
        searchParams
      ),
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

function buildFilterString(
  userId: string | null,
  loketId: string | null,
  hasMeterai: boolean,
  golId: string | null,
  kecId: string | null,
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

  if (hasMeterai) {
    filter += `|TERDAPAT METERAI`;
  }

  if (golId) {
    const golName = searchParams.get("gol_name") || golId;
    filter += `|GOL : ${golName}`;
  }

  if (kecId) {
    const kecName = searchParams.get("kec_name") || kecId;
    filter += `|KEC : ${kecName}`;
  }

  return filter;
}
