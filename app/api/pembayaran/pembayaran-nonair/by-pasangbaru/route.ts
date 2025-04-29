import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyAuth } from "@/lib/session";
import getConnection from "@/lib/db";
import { formatRupiah } from "@/lib/utils";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    const searchQuery = searchParams.get("q") || "";

    const db = await getConnection();

    const [pelanggan] = await db.query<RowDataPacket[]>(
      `
      SELECT a.*,b.nama,b.alamat, c.* from pasangbaru a 
left join pendaftaranpel b on a.reg_id=b.id 
join (select id as jenisnonair_id, jenis, flagpajak from jenis_nonair  where jenis = "PB") c
where a.flaglunas="0" and a.flagsetuju=1 AND nama LIKE ? LIMIT 5
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

      if (Boolean(row.flagpajak)) {
        ppn = Math.round(row.total * ppnData[0].jml);
        total = row.total + ppn;
      } else {
        ppn = 0;
        total = row.total + ppn;
      }
      return {
        jenisnonair: row.jenis,
        jenisnonairid: row.jenisnonair_id,
        namajenis: row.namajenis,
        no_rab: row.no_rab,
        nama: row.nama,
        alamat: row.alamat,
        pendaftaranpel_id: null,
        pelayananlain_id: null,
        jumlah: Boolean(row.flagangsur) ? row.uangmuka : row.total,
        ppn: ppn,
        total: total,
        pasangbaru_id: row.id,
        angsuran_id: null,
        periode: null,
        kode: `${row.jenis}${row.id}`,
        ket: Boolean(row.flagangsur)
          ? `UANG MUKA PASANG BARU ANGSURAN ${row.angsurkali}`
          : "PASANG BARU CASH",
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
