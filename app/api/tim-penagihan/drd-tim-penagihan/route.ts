import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);

    // if (!authResult.isAuthenticated) {
    //   return NextResponse.json({ message: authResult.error }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const periode = searchParams.get("periode") || "";

    let tgldenda = "";
    if (periode && periode.length === 6) {
      const year = parseInt(periode.substring(0, 4));
      const month = parseInt(periode.substring(4, 6));

      let prevMonth = month - 1;
      let prevYear = year;

      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear = year - 1;
      }

      tgldenda = `'${prevYear}-${prevMonth.toString().padStart(2, "0")}-01'`;
    } else {
      return NextResponse.json(
        { status: 400, message: "Format Periode salah" },
        { status: 400 }
      );
    }

    const noSamb = searchParams.get("no_samb") || "";
    const nama = searchParams.get("nama") || "";
    const alamat = searchParams.get("alamat") || "";
    const rayon = searchParams.get("rayon") || "";
    const timTagih = searchParams.get("tim_tagih") || "";
    const jmlRekMin = searchParams.get("jml_rek_min") || "";
    const jmlRekMax = searchParams.get("jml_rek_max") || "";
    const bayar = searchParams.get("bayar") || "";
    const userLunas = searchParams.get("user_lunas") || "";
    const tglBayarStart = searchParams.get("tgl_bayar_start") || "";
    const tglBayarEnd = searchParams.get("tgl_bayar_end") || "";
    const status = searchParams.get("status") || "";

    const db = await getConnection();

    let baseQuery = `
      SELECT * FROM (
      SELECT
      f1.user_id,
      IFNULL(f1.denda,0) AS denda,
      IFNULL(f1.rekair,0) AS rekair,
      IFNULL(f1.angsuran,0) AS angsuran,
      IFNULL(f1.minper,0) AS minper,
      IFNULL(f1.maxper,0) AS maxper,
      IFNULL(f1.no_pelanggan,0) AS no_pelanggan,
      IFNULL(f1.nama,0) AS nama,
      IFNULL(f1.jmlrek,0) AS jmlrek,
      IFNULL(f1.lbrlunas,0) AS lbrlunas,
      IFNULL(f1.dendalunas,0) AS dendalunas,
      IFNULL(f1.rekairlunas,0) AS rekairlunas,
      IFNULL(f1.angsuranlunas,0) AS angsuranlunas,
      IFNULL(f1.meterailunas,0) AS meterailunas,
      IFNULL(f1.meteraitagih,0) AS meteraitagih,
      IFNULL(f1.userlunas,0) AS userlunas,
      IFNULL(f1.timtagih,0) AS timtagih,
      IFNULL(f1.tglbayar,0) AS tglbayar,
      p.alamat,p.no_hp,'' AS latitude,'' AS longitude,p.kodegol AS kode_golongan,
      IFNULL(CONCAT(f1.minper,'-',f1.maxper),f1.minper) AS periodetag,p.rayon,
      IFNULL((f1.denda+f1.rekair+f1.meteraitagih),0) AS ttltagihan,
      IFNULL((f1.dendalunas+f1.rekairlunas+f1.meterailunas),0) AS ttltagihanlunas,
      IFNULL((f1.jmlrek-f1.lbrlunas),0) AS sisarek,
      IFNULL((f1.denda+f1.rekair+f1.meteraitagih),0) - IFNULL((f1.dendalunas+f1.rekairlunas+f1.meterailunas),0) AS sisatagihan,
      p.status,p.jmlrek AS jrek
      FROM (
      SELECT user_id,SUM(denda1+denda2) AS denda,SUM(rekair) AS rekair,SUM(angsuran) AS angsuran,
      MIN(periode) AS minper,MAX(periode) AS maxper,no_pelanggan,nama,COUNT(periode) AS jmlrek,SUM(flaglunas) AS lbrlunas,
      SUM(dendalunas) AS dendalunas,SUM(IF(flaglunas=1,rekair,0)) AS rekairlunas,SUM(IF(flaglunas=1,angsuran,0)) AS angsuranlunas,SUM(meterai) AS meterailunas,SUM(meteraitagih) AS meteraitagih,
      IFNULL(GROUP_CONCAT(DISTINCT userlunas),'') AS userlunas,IFNULL(GROUP_CONCAT(DISTINCT tim_tagih),'') AS timtagih,tglbayar FROM 
      ( 
      SELECT Qsub1.*,
      IF(Qsub1.rekair+Qsub1.denda1+Qsub1.denda2 >= (SELECT min FROM materai) , (SELECT by_materai FROM materai),0 ) AS meteraitagih,
      IF(Qsub1.rekair+Qsub1.denda1+Qsub1.denda2 >= (SELECT min FROM materai) , (SELECT by_materai FROM materai),0 ) + Qsub1.rekair+Qsub1.denda1+Qsub1.denda2 AS totalrek
      FROM (
      SELECT Qsub1.*,
      IF((SELECT COUNT(kodegol) AS jml FROM gol_tanpadenda WHERE kodegol=Qsub1.kodegol) = 0 ,
        IF(${tgldenda} >= Qsub1.tgldenda1 , 
          IF( (SELECT flagpersen FROM setup_denda) = 1, ROUND(Qsub1.rekair * (SELECT denda1 FROM setup_denda) /100) ,   (SELECT denda1 FROM setup_denda)   ),
          0
        ),0) AS denda1,
      IF((SELECT COUNT(kodegol) AS jml FROM gol_tanpadenda WHERE kodegol=Qsub1.kodegol) = 0 ,  
        IF(${tgldenda} >= Qsub1.tgldenda2 , 
          (SELECT denda2 FROM setup_denda) ,
          0
        ),0) AS denda2
      FROM 
      (
      SELECT
      a.id AS rekening_id,s.no_pelanggan,a.nama,
      a.harga_air+a.airlimbah+a.administrasi+a.pemeliharaan+a.retribusi+a.pelayanan+a.angsuran AS rekair,
      a.angsuran AS angsuran,a.flaglunas,DATE(a.tglbayar) AS tglbayar,IF(a.flaglunas=1,a.meterai,0) AS meterai,
      a.gol_id AS golongan_id,a.periode,IF(a.flaglunas=1,a.denda,0) AS dendalunas,IF(flaglunas=1,u.nama,NULL) AS userlunas,t.nama AS tim_tagih,s.user_id,a.kodegol,
      STR_TO_DATE(CONCAT(periode_rek,(SELECT tgl1 FROM setup_denda)),"%Y%m%e") AS tgldenda1,
      DATE_ADD(STR_TO_DATE(CONCAT(periode_rek,(SELECT tgl2 FROM setup_denda)),"%Y%m%e"),  INTERVAL 1 MONTH) AS tgldenda2,
      ROW_NUMBER() OVER(PARTITION BY a.no_pelanggan ORDER BY a.no_pelanggan,a.periode) AS urut
      FROM tagihan_timtagih s LEFT JOIN drd a ON s.drd_id=a.id LEFT JOIN users u ON a.user_id=u.id
      LEFT JOIN users t ON s.user_id=t.id WHERE s.periode=?
      ) Qsub1 ORDER BY no_pelanggan,periode ASC
      ) Qsub1 
      ) f2 GROUP BY no_pelanggan
      ) f1 
      LEFT JOIN pelanggan_periode p ON f1.no_pelanggan=p.no_pelanggan AND p.periode=?
      ) aa`;

    const filters = [];
    const params = [periode, periode];
    let activeFiltersString: string = "";

    if (noSamb) {
      filters.push(`AND no_pelanggan = ?`);
      params.push(noSamb);
      activeFiltersString += ` | No Pelanggan: ${noSamb}`;
    }

    if (nama) {
      filters.push(`AND nama LIKE ?`);
      params.push(`%${nama}%`);
      activeFiltersString += ` | Nama: ${nama}`;
    }

    if (alamat) {
      filters.push(`AND alamat LIKE ?`);
      params.push(`%${alamat}%`);
      activeFiltersString += ` | Alamat: ${alamat}`;
    }

    if (rayon) {
      filters.push(`AND rayon = ?`);
      params.push(rayon);
      activeFiltersString += ` | Rayon: ${rayon}`;
    }

    if (timTagih) {
      filters.push(`AND timtagih = ?`);
      params.push(timTagih);
      activeFiltersString += ` | Tim Tagih: ${timTagih}`;
    }

    if (jmlRekMin && jmlRekMax) {
      filters.push(`AND jrek BETWEEN ? AND ?`);
      params.push(jmlRekMin, jmlRekMax);
      activeFiltersString += ` | Jumlah Rekening: ${jmlRekMin} - ${jmlRekMax}`;
    }

    if (bayar) {
      let statusBayarText = "";
      switch (bayar) {
        case "sebagian":
          filters.push(`AND lbrlunas > 0 AND jmlrek > lbrlunas`);
          statusBayarText = "Bayar Sebagian";
          break;
        case "lunas":
          filters.push(`AND lbrlunas = jmlrek`);
          statusBayarText = "Lunas";
          break;
        case "sudahbayar":
          filters.push(`AND lbrlunas > 0`);
          statusBayarText = "Sudah Bayar";
          break;
        case "belumbayar":
          filters.push(`AND lbrlunas = 0`);
          statusBayarText = "Belum Bayar";
          break;
      }
      activeFiltersString += ` | Status Bayar: ${statusBayarText}`;
    }

    if (userLunas) {
      filters.push(`AND userlunas LIKE ?`);
      params.push(`%${userLunas}%`);
      activeFiltersString += ` | User Lunas: ${userLunas}`;
    }

    if (tglBayarStart && tglBayarEnd) {
      filters.push(`AND tglbayar BETWEEN ? AND ?`);
      params.push(tglBayarStart, tglBayarEnd);
      activeFiltersString += ` | Tanggal Bayar: ${tglBayarStart} s/d ${tglBayarEnd}`;
    }

    if (status) {
      filters.push(`AND status = ?`);
      params.push(status);
      activeFiltersString += ` | Status: ${status}`;
    }

    if (filters.length > 0) {
      filters[0] = filters[0].replace(/^AND /, "");
      baseQuery += " WHERE " + filters.join(" ");
    }
    const [data] = await db.query<RowDataPacket[]>(baseQuery, params);

    const total = data.reduce(
      (acc, item) => {
        acc.sisarek += Number(item.sisarek) || 0;
        acc.sisatagihan += Number(item.sisatagihan) || 0;
        acc.jrek += Number(item.jrek) || 0;
        acc.ttltagihan += Number(item.ttltagihan) || 0;
        acc.ttltagihanlunas += Number(item.ttltagihanlunas) || 0;
        acc.lbrlunas += Number(item.lbrlunas) || 0;
        return acc;
      },
      {
        sisarek: 0,
        sisatagihan: 0,
        jrek: 0,
        ttltagihan: 0,
        ttltagihanlunas: 0,
        lbrlunas: 0,
      }
    );

    return NextResponse.json({
      status: 200,
      data,
      total,
      filter: activeFiltersString,
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
