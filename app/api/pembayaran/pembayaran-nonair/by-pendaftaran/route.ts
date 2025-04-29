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

    const db = await getConnection();
    const searchQuery = searchParams.get("q") || "";
    const [pelanggan] = await db.query<RowDataPacket[]>(
      `
       SELECT * from pendaftaranpel where flaglunas="0" and datediff(CURRENT_DATE,tanggal) < 20 AND nama LIKE ? LIMIT 5
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
        no_regis: row.no_regis,
        namajenis: "Pendaftaran",
        nama: row.nama,
        alamat: row.alamat,
        pendaftaranpel_id: row.id,
        pelayananlain_id: null,
        jumlah: row.biaya,
        ppn: ppn,
        total: total,
        angsuran_id: null,
        periode: null,
        pasangbaru_id: null,
        kode: `REG${row.id}`,
        ket: "Pendaftaran Pasang Baru",
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
