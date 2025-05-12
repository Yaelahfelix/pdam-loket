import { OkPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { NextRequest } from "next/server";

type CreateProcessBatchLogInput = {
  backup_id: number;
};

type UpdateProcessBatchLogInput = {
  backup_id: number;
  processed?: number;
  tagihanTdkAda?: number;
  withUserTimTagih?: number;
  withoutUserTimTagih?: number;
  nopelTagihanTdkAda?: string[];
};

async function ensureTableExists(): Promise<void> {
  const db = await getConnection();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sipamit_billing.processbatch_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      backup_id INT NOT NULL UNIQUE,
      processed INT,
      tagihanTdkAda INT,
      withUserTimTagih INT,
      withoutUserTimTagih INT,
      nopelTagihanTdkAda JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (backup_id) REFERENCES sipamit_billing.postingbatch_backup(id) ON DELETE CASCADE
    )
  `;
  await db.query(createTableQuery);
}

export async function createProcessBatchLog(
  data: CreateProcessBatchLogInput
): Promise<{ success: boolean; message: string; insertedId?: number }> {
  try {
    const db = await getConnection();
    await ensureTableExists();

    const { backup_id } = data;

    const insertQuery = `
      INSERT INTO sipamit_billing.processbatch_log (backup_id)
      VALUES (?)
    `;
    const [insertResult] = await db.query<OkPacket>(insertQuery, [backup_id]);

    if (insertResult.affectedRows > 0) {
      return {
        success: true,
        message: "Log has been created",
        insertedId: insertResult.insertId,
      };
    } else {
      return { success: false, message: "Failed to create log" };
    }
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function updateProcessBatchLog(
  data: UpdateProcessBatchLogInput
): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getConnection();
    await ensureTableExists();

    const { backup_id } = data;

    if (!backup_id) {
      return { success: false, message: "ID is required for updates" };
    }

    // First, fetch the existing record
    const selectQuery = `
      SELECT 
        processed,
        tagihanTdkAda,
        withUserTimTagih,
        withoutUserTimTagih,
        nopelTagihanTdkAda
      FROM sipamit_billing.processbatch_log
      WHERE backup_id = ?
    `;
    const [rows] = await db.query(selectQuery, [backup_id]);
    const records = rows as any[];

    if (records.length === 0) {
      return {
        success: false,
        message: "Failed to update log. Log ID not found.",
      };
    }

    console.log(records);
    const existingData = records[0];
    let existingNopelArray: string[] = [];

    if (existingData.nopelTagihanTdkAda) {
      existingNopelArray = existingData.nopelTagihanTdkAda;
    }

    const updatedData = {
      processed: data.processed
        ? existingData.processed + data.processed
        : existingData.processed,
      tagihanTdkAda: data.tagihanTdkAda
        ? existingData.tagihanTdkAda + data.tagihanTdkAda
        : existingData.tagihanTdkAda,
      withUserTimTagih: data.withUserTimTagih
        ? existingData.withUserTimTagih + data.withUserTimTagih
        : existingData.withUserTimTagih,
      withoutUserTimTagih: data.withoutUserTimTagih
        ? existingData.withoutUserTimTagih + data.withoutUserTimTagih
        : existingData.withoutUserTimTagih,
    };

    let updatedNopelArray: string[] = existingNopelArray;

    if (data.nopelTagihanTdkAda && Array.isArray(data.nopelTagihanTdkAda)) {
      updatedNopelArray = existingNopelArray.concat(data.nopelTagihanTdkAda);
    }

    const updateQuery = `
      UPDATE sipamit_billing.processbatch_log
      SET
        processed = ?,
        tagihanTdkAda = ?,
        withUserTimTagih = ?,
        withoutUserTimTagih = ?,
        nopelTagihanTdkAda = ?
      WHERE backup_id = ?
    `;

    console.log(updatedData);
    const [updateResult] = await db.query<OkPacket>(updateQuery, [
      updatedData.processed,
      updatedData.tagihanTdkAda,
      updatedData.withUserTimTagih,
      updatedData.withoutUserTimTagih,
      JSON.stringify(updatedNopelArray),
      backup_id,
    ]);

    if (updateResult.affectedRows > 0) {
      return { success: true, message: "Log updated successfully" };
    } else {
      return {
        success: false,
        message: "Failed to update log. No changes were made.",
      };
    }
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
}
