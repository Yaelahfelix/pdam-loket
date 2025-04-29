import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyAuth } from "@/lib/session";
import getConnection from "@/lib/db";
import { formatRupiah } from "@/lib/utils";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("q") || "";

    const db = await getConnection();

    const [pelanggan] = await db.query<RowDataPacket[]>(
      `
      SELECT a.*,b.namajenis from pendaftaran_lain a left join jenis_nonair b on a.jenis_nonair_id=b.id where a.flaglunas="0" AND nama LIKE ? LIMIT 5
      `,
      [`%${searchQuery}%`]
    );

    const [ppnData] = await db.query<RowDataPacket[]>(
      `
      select * from setup_ppn where mulaitgl <= CURRENT_DATE order by mulaitgl desc limit 1
      `
    );

    const formattedData = pelanggan.map((row) => {
      let ppn = 0;
      let total = 0;
      if (Boolean(row.flexiblebiaya)) {
        ppn = 0;
        total = row.biaya;
      } else {
        if (Boolean(row.flagpajak)) {
          ppn = Math.round(row.biaya * ppnData[0].jml);
          total = row.biaya + ppn;
        } else {
          ppn = 0;
          total = row.biaya + ppn;
        }
      }
      return {
        jenisnonair: row.jenis,
        jenisnonairid: row.jenis_nonair_id,
        namajenis: row.namajenis,
        nama: row.nama,
        alamat: row.alamat,
        pendaftaranpel_id: null,
        pelayananlain_id: row.id,
        jumlah: row.biaya,
        ppn: ppn,
        total: total,
        angsuran_id: null,
        pasangbaru_id: null,
        no_regis: row.no_regis,
        periode: null,
        kode: `${row.jenis}${row.id}`,
        ket: row.keterangan,
      };
    });

    return NextResponse.json({
      status: 200,
      data: formattedData,
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
