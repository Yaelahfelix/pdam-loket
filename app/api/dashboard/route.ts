import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { format, subMonths } from "date-fns";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

const getCurrentPeriod = () => {
  return format(new Date(), "yyyyMM");
};

const getPreviousPeriod = () => {
  const previousMonth = subMonths(new Date(), 1);
  return format(previousMonth, "yyyyMM");
};

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }
    const [piutang] = await db.query<RowDataPacket[]>(
      "select sum(totalrekening) as total,kodegol,golongan from drd where flaglunas=0 and flagrekening > 0 group by kodegol"
    );

    const [pelBaru] = await db.query<RowDataPacket[]>(
      `select a.*,b.nama,b.alamat,concat(g.kode_golongan," - ", g.nama) as golongan,b.no_regis,g.kode_golongan from pasangbaru a left join pendaftaranpel b on a.reg_id=b.id left join golongan g on a.golongan_id=g.id
where realisasi_periode=? AND a.flagrealisasi=1 
order by no_pelanggan
`,
      [getCurrentPeriod()]
    );

    const [jumlahPenerimaanUang] = await db.query<RowDataPacket[]>(
      `select sum(totalrekening) as total from drd where date_format(tglbayar,"%Y%m")=? and flaglunas="1"`,
      [getCurrentPeriod()]
    );

    const [efesiensiPenagihan] = await db.query<RowDataPacket[]>(
      `select sum(if(flaglunas,totalrekening-denda-retribusi-admin_ppob,0)) as jumlahlunas,sum(if(flaglunas,0,totalrekening-denda-retribusi-admin_ppob)) as jumlahbelumlunas from 
drd where periode_rek between ? and ?
`,
      [getPreviousPeriod(), getCurrentPeriod()]
    );

    return NextResponse.json({
      status: 200,
      data: {
        pelBaru: pelBaru.map((data) => ({
          nopel: data.no_pelanggan,
          nama: data.nama,
          alamat: data.alamat,
          tglPasang: data.tglpasang,
          total: data.total,
        })),
        piutang,
      },
      total: {
        penerimaanUang: jumlahPenerimaanUang[0].total,
        efesiensi: {
          jumlahLunas: efesiensiPenagihan[0].jumlahlunas,
          jumlahBelumLunas: efesiensiPenagihan[0].jumlahbelumlunas,
        },
        pelangganBaru: pelBaru.length,
        piutang: piutang.reduce(
          (acc, curr) => acc + Number(curr.total || 0),
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
  }
};
