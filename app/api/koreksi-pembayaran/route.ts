import { NextRequest, NextResponse } from "next/server";
import { OkPacket, RowDataPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { KoreksiPembayaran } from "@/types/koreksi-pembayaran";

export const GET = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const tglbayar = searchParams.get("tglbayar");
    const filter = searchParams.get("filter");

    const nopel = searchParams.get("nopel");
    const kasir_id = searchParams.get("kasir_id");
    const loket_id = searchParams.get("loket_id");

    let query = `
        SELECT a.id,a.no_pelanggan,a.periode_rek,CAST(RIGHT(periode_rek,2) AS UNSIGNED)-1 AS bln ,a.nama,a.alamat,a.rayon,a.stanangkat,
a.kodegol,a.golongan,a.stanlalu,a.stanskrg,a.pakaiskrg,a.harga_air,a.airlimbah,a.administrasi,a.pemeliharaan,a.retribusi,a.pelayanan,a.angsuran,
a.harga_air+a.airlimbah+a.administrasi+a.pemeliharaan+a.retribusi+a.pelayanan+a.angsuran AS rekair,a.meterai,a.denda,a.totalrekening AS total, a.nama_user AS kasir,a.nama_loket AS loket,
a.tglbayar,a.loket_id,a.user_id
 FROM drd a WHERE a.flaglunas="1" AND DATE(a.tglbayar) = ?
      `;

    let params = [tglbayar];

    if (filter === "nopel") {
      query += " AND a.no_pelanggan = ?";
      params.push(nopel);
    }
    if (filter === "kasir") {
      query += " AND a.user_id = ?";
      params.push(kasir_id);
    }
    if (filter === "loket") {
      query += " AND a.loket_id = ?";
      params.push(loket_id);
    }
    const [rows] = await db.query<RowDataPacket[]>(query, params);

    return NextResponse.json({
      status: 200,
      data: rows,
      tipeFilter: filter,
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

    console.log("hit");
    const requestData = await request.json();
    const {
      filter,
      loket_id,
      nama_loket,
      user_id,
      nama_user,
      userkor,
      tglbayar,
    } = requestData;
    const { data }: { data: KoreksiPembayaran[] } = requestData;

    for (const item of data) {
      let query = "UPDATE drd set tglbayar=?";
      let params = [tglbayar];
      let query2 =
        "INSERT INTO hiskorrekening SET drd_id=?, no_pelanggan=?, user_koreksi=?, waktu=NOW(), tglbayar=?";
      let params2 = [item.id, item.no_pelanggan, userkor, tglbayar];

      if (filter === "nopel") {
        query += `, loket_id=?,nama_loket=?, user_id=?,nama_user=?`;
        params.push(loket_id, nama_loket, user_id, nama_user);

        query2 += ", nama_user=?, nama_loket=?";
        params2.push(nama_user, nama_loket);
      } else if (filter === "kasir") {
        query += `, user_id=?,nama_user=?`;
        params.push(user_id, nama_user);

        query2 += ", nama_user=?";
        params2.push(nama_user);
      } else if (filter === "loket") {
        query += `, loket_id=?,nama_loket=?`;
        params.push(loket_id, nama_loket);
        query2 += ", nama_loket=?";
        params2.push(nama_loket);
      }

      query += ` where id = ?`;
      params.push(item.id);

      await db.query(query, params);
      await db.query(query2, params2);
    }

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengoreksi rekening",
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
