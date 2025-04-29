import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { DataNonair } from "@/types/pembayaran-nonair";
import { format } from "date-fns";
import { OkPacket, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const requestData = await request.json();
    const data: DataNonair[] = requestData.data;
    const detail = requestData.detail;

    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");
    const formattedDateTime = format(today, "yyyy-MM-dd HH:mm:ss");

    const successfulUpdates: number[] = [];

    for (const item of data) {
      let query = "";
      let queryParams: string | number[] = [];
      if (item.pendaftaranpel_id) {
        let updateQuery = `UPDATE pendaftaranpel SET flaglunas = 1, updated_at = ? WHERE id = ?`;
        await db.query(updateQuery, [
          formattedDateTime,
          item.pendaftaranpel_id,
        ]);
        query = `
        INSERT INTO penerimaan_nonair (
                  no_pembayaran, tglbayar, jenisnonair_id, jenisnonair, namajenis, 
                  nama, alamat, user_id, pendaftaranpel_id, jumlah, ppn, total, 
                  loket_id, kode_loket, nama_loket, keterangan, nama_user
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        
                `;
        queryParams = [
          item.kode,
          formattedDate,
          item.jenisnonairid,
          item.jenisnonair,
          item.namajenis,
          item.nama,
          item.alamat,
          detail.user_id,
          item.pendaftaranpel_id,
          item.jumlah,
          item.ppn,
          item.total,
          detail.loket_id,
          detail.kode_loket,
          detail.nama_loket,
          item.ket,
          detail.nama_user,
        ];
      } else if (item.pasangbaru_id) {
        let updateQuery = `UPDATE pasangbaru SET flaglunas = 1, updated_at = ? WHERE id = ?`;

        await db.query(updateQuery, [formattedDateTime, item.pasangbaru_id]);
        query = `
        INSERT INTO penerimaan_nonair (
                  no_pembayaran, tglbayar, jenisnonair_id, jenisnonair, namajenis, 
                  nama, alamat, user_id, pasangbaru_id, jumlah, ppn, total, 
                  loket_id, kode_loket, nama_loket, keterangan, nama_user
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        
                `;
        queryParams = [
          item.kode,
          formattedDate,
          item.jenisnonairid,
          item.jenisnonair,
          item.namajenis,
          item.nama,
          item.alamat,
          detail.user_id,
          item.pasangbaru_id,
          item.jumlah,
          item.ppn,
          item.total,
          detail.loket_id,
          detail.kode_loket,
          detail.nama_loket,
          item.ket,
          detail.nama_user,
        ];
      } else if (item.pelayananlain_id) {
        const [jenisNonair] = await db.query<RowDataPacket[]>(
          `SELECT * FROM jenis_nonair WHERE id = ?`,
          [item.jenisnonairid]
        );

        let flagproses = 0;
        let flagrealisasi = 0;

        if (jenisNonair.length > 0) {
          flagproses = jenisNonair[0].flagproses ? 1 : 0;
          flagrealisasi = jenisNonair[0].flagrealisasi ? 1 : 0;
        }

        const updateQuery = `
        UPDATE pendaftaran_lain 
        SET flaglunas = 1, flagproses = ?, flagrealisasi = ?, updated_at = ? 
        WHERE id = ?
      `;
        await db.query(updateQuery, [
          flagproses,
          flagrealisasi,
          formattedDateTime,
          item.pelayananlain_id,
        ]);

        query = `
        INSERT INTO penerimaan_nonair (
                  no_pembayaran, tglbayar, jenisnonair_id, jenisnonair, namajenis, 
                  nama, alamat, user_id, pelayananlain_id, jumlah, ppn, total, 
                  loket_id, kode_loket, nama_loket, keterangan, nama_user
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        
                `;
        queryParams = [
          item.kode,
          formattedDate,
          item.jenisnonairid,
          item.jenisnonair,
          item.namajenis,
          item.nama,
          item.alamat,
          detail.user_id,
          item.pelayananlain_id,
          item.jumlah,
          item.ppn,
          item.total,
          detail.loket_id,
          detail.kode_loket,
          detail.nama_loket,
          item.ket,
          detail.nama_user,
        ];
      }

      const [result] = await db.query<OkPacket>(query, queryParams);

      if (result.insertId) {
        successfulUpdates.push(result.insertId);
      }
    }

    if (successfulUpdates.length > 0) {
      const placeholders = successfulUpdates.map(() => "?").join(",");
      const query = `
            SELECT
          a.*,
          CONCAT(
              IFNULL(b.no_regis, ''),
              IFNULL(c.no_rab, ''),
              IFNULL(d.no_regis, ''),
              IFNULL(a.angsuran_id, '')
          ) AS nohublang,
          f.loket AS loketbayar,
          g.nama AS namauser,
          IFNULL(c.no_pelanggan, d.no_pelanggan) AS no_pelanggan
      FROM penerimaan_nonair a
      LEFT JOIN pendaftaranpel b ON a.pendaftaranpel_id = b.id
      LEFT JOIN pasangbaru c ON a.pasangbaru_id = c.id
      LEFT JOIN pendaftaran_lain d ON a.pelayananlain_id = d.id
      LEFT JOIN angsuran e ON a.angsuran_id = e.id
      LEFT JOIN loket f ON a.loket_id = f.id
      LEFT JOIN users g ON a.user_id = g.id
      WHERE a.id IN (${placeholders});
            `;

      const [updatedData] = await db.query<RowDataPacket[]>(
        query,
        successfulUpdates
      );

      return NextResponse.json({
        status: 200,
        data: updatedData,
      });
    }

    return NextResponse.json({
      status: 200,
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
