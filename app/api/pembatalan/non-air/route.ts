import { NextRequest, NextResponse } from "next/server";
import { OkPacket, RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const no_pembayaran = searchParams.get("no_pembayaran");
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT a.*,b.nama AS kasir FROM penerimaan_nonair a LEFT JOIN users b ON 
      a.user_id=b.id WHERE no_pembayaran=? and flagproses=0
      `,
      [no_pembayaran]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "Data tidak ditemukan",
      });
    }

    const mappedData = rows.map((data) => ({
      jenisnonair: data.jenisnonair,
      jenisnonairid: data.jenisnonair_id,
      namajenis: data.namajenis,
      nama: data.nama,
      alamat: data.alamat,
      pasangbaru_id: data.pasangbaru_id,
      pelayananlain_id: data.pelayananlain_id,
      pendaftaranpel_id: data.pendaftaranpel_id,
      angsuran_id: data.angsuran_id,
      jumlah: data.jumlah,
      kode: data.no_pembayaran,
      keterangan: data.keterangan,
      ppn: data.ppn,
      total: data.total,
      nobayar: data.no_pembayaran,
      id: data.id,
    }));

    return NextResponse.json({
      status: 200,
      data: mappedData,
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
    const { data, user_name, alasan } = requestData;

    console.log(data);
    for (const item of data) {
      await db.query(
        `
        insert into hisbatalnonair 
        select 0,a.*,?,?,now() 
        from penerimaan_nonair a where a.id=?;
        `,
        [alasan, user_name, item]
      );

      await db.query(
        `
          DELETE FROM penerimaan_nonair where id=?;
          `,
        [item]
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Berhasil membatalkan transaksi!",
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
