import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyAuth } from "@/lib/session";
import getConnection from "@/lib/db";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id") || "";

    const db = await getConnection();

    const [data] = await db.query<RowDataPacket[]>(
      `
      select a.id,a.rayon_id,b.kode_rayon,b.nama,IFNULL(c.jml,0) as jumlah from plot_rute_tim_tagih a left join rayon b on a.rayon_id=b.id 
left join (select count(id) as jml,rayon_id from pelanggan where status=1 group by rayon_id) c on a.rayon_id=c.rayon_id where a.user_id=?
      `,
      [`${id}`]
    );

    return NextResponse.json({
      status: 200,
      data,
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

export const POST = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const db = await getConnection();
    const body = await request.json();

    const { petugasId, rayonIds } = body;

    if (!petugasId || !rayonIds || !Array.isArray(rayonIds)) {
      console.log(body);
      return NextResponse.json(
        { message: "petugasId and rayonIds array are required" },
        { status: 400 }
      );
    }

    const results = [];

    for (const rayonId of rayonIds) {
      const [existingRecords] = await db.query(
        `SELECT * FROM plot_rute_tim_tagih 
         WHERE user_id = ? AND rayon_id = ?`,
        [petugasId, rayonId]
      );

      if (
        !existingRecords ||
        (Array.isArray(existingRecords) && existingRecords.length === 0)
      ) {
        await db.query(
          `INSERT INTO plot_rute_tim_tagih 
           VALUES (0, ?, ?)`,
          [petugasId, rayonId]
        );

        results.push({
          rayonId,
          status: "created",
          message: "Berhasil menjadwalkan petugas",
        });
      } else {
        results.push({
          rayonId,
          status: "exists",
          message: "Petugas sudah terjadwal pada rayon ini",
        });
      }
    }

    return NextResponse.json({
      status: 200,
      message: "Proses penjadwalan selesai",
      results: results,
    });
  } catch (error: any) {
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

export const DELETE = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Missing required field: id" },
        { status: 400 }
      );
    }

    const deleteQuery = `delete from plot_rute_tim_tagih where id=?`;
    await db.query(deleteQuery, [id]);

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus rayon petugas",
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
