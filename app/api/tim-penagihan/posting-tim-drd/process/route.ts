import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { OkPacket, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { updateProcessBatchLog } from "../logHandler";

export const POST = async (request: NextRequest) => {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const db = await getConnection();
    const body = await request.json();

    const { periode: selectedPeriod, batchNumber, batchSize, backupId } = body;

    if (
      !selectedPeriod ||
      batchNumber === undefined ||
      batchSize === undefined ||
      backupId === undefined
    ) {
      return NextResponse.json(
        { message: "Period, batchNumber, batchSize and backupId are required" },
        { status: 400 }
      );
    }

    const offset = (batchNumber - 1) * batchSize;

    await db.query("START TRANSACTION");

    try {
      await db.query(`CREATE TABLE IF NOT EXISTS temp_posting_log (
  nopel VARCHAR(255) PRIMARY KEY
);
`);
      const [customers] = await db.query<RowDataPacket[]>(
        `SELECT * FROM pelanggan_periode 
         WHERE periode = ? AND status = 1
         LIMIT ? OFFSET ?`,
        [selectedPeriod, batchSize, offset]
      );

      const results: any = {
        processed: 0,
        withUserTimTagih: 0,
        withoutUserTimTagih: 0,
        tagihanTdkAda: 0,
        details: [],
      };

      for (const customer of customers) {
        results.processed++;

        const [drd] = await db.query<RowDataPacket[]>(
          `SELECT id, no_pelanggan, rayon_id FROM drd 
           WHERE flaglunas = "0" AND flagrekening > 0 AND no_pelanggan = ?`,
          [customer.no_pelanggan]
        );

        if (drd && drd.length > 0) {
          const [userTimTagih] = await db.query<RowDataPacket[]>(
            `SELECT a.user_id, a.rayon_id, IFNULL(b.min_l, 0) AS minl, IFNULL(b.max_l, 0) AS maxl
             FROM plot_rute_tim_tagih a
             LEFT JOIN plot_tim_tagih b ON a.user_id = b.user_id
             WHERE a.rayon_id = ?
               AND ? >= IFNULL(b.min_l, 0)
               AND ? <= IFNULL(b.max_l, 0)
             LIMIT 1`,
            [customer.rayon_id, drd.length, drd.length]
          );

          if (userTimTagih && userTimTagih.length > 0) {
            const userIdTag = userTimTagih[0].user_id;
            results.withUserTimTagih++;

            const tagihanValue = drd.map((drd) => [
              drd.no_pelanggan,
              drd.id,
              userIdTag,
              selectedPeriod,
            ]);

            if (tagihanValue.length > 0) {
              await db.query(
                `INSERT IGNORE INTO tagihan_timtagih 
                 (no_pelanggan, drd_id, user_id, periode) 
                 VALUES ?`,
                [tagihanValue]
              );
            }

            await db.query(
              `UPDATE pelanggan_periode SET jmlrek = ?, flagposttimtagih = 1 WHERE id = ?`,
              [drd.length, customer.id]
            );

            results.details.push({
              noPel: customer.no_pelanggan,
              status: "IN",
              userTimTagihId: userIdTag,
              totalDRD: drd.length,
            });
          } else {
            results.withoutUserTimTagih++;

            await db.query(
              `UPDATE pelanggan_periode SET jmlrek = ?, flagposttimtagih = 0 WHERE id = ?`,
              [drd.length, customer.id]
            );

            results.details.push({
              noPel: customer.no_pelanggan,
              status: "OUT",
              totalDRD: drd.length,
            });
          }
        } else {
          results.tagihanTdkAda++;

          await db.query(
            `UPDATE pelanggan_periode SET jmlrek = 0, flagposttimtagih = 0 WHERE id = ?`,
            [customer.id]
          );

          results.details.push({
            noPel: customer.no_pelanggan,
            status: "NO_TAGIHAN",
          });
        }

        const query = "INSERT INTO temp_posting_log VALUES (?)";

        await db.query(query, customer.no_pelanggan);
      }

      const backupQuery = `
     UPDATE postingbatch_backup
SET batchNumber = ?, status = ?
WHERE id = ?;
    `;
      await db.query<OkPacket>(backupQuery, [batchNumber, "RUNNING", backupId]);
      await updateProcessBatchLog({
        backup_id: backupId,
        tagihanTdkAda: results.tagihanTdkAda,
        nopelTagihanTdkAda: results.details
          .filter((data: any) => data.status === "NO_TAGIHAN")
          .map((data: any) => data.noPel),
        processed: results.processed,
        withoutUserTimTagih: results.withoutUserTimTagih,
        withUserTimTagih: results.withUserTimTagih,
      });
      await db.query("COMMIT");

      return NextResponse.json({
        status: 200,
        message: `Batch ${batchNumber} processed successfully`,
        data: results,
      });
    } catch (error) {
      // Rollback in case of error
      await db.query("ROLLBACK");
      throw error;
    }
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
