import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, OkPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";
import { PostingBatchBackup } from "@/app/(app)/admin/tim-penagihan/posting-tim-penagihan/types";
import { createProcessBatchLog } from "../logHandler";

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const requestData = await request.json();
    const data: PostingBatchBackup = requestData;

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS sipamit_billing.postingbatch_backup (
        id INT AUTO_INCREMENT PRIMARY KEY,
        selectedPeriod VARCHAR(20) NOT NULL,
        totalPelanggan INT NOT NULL,
        totalBatches INT NOT NULL,
        batchSize INT NOT NULL,
        flagPostUlang TINYINT NOT NULL,
        batchNumber INT,
        status ENUM('ERROR', 'RUNNING', 'INIT', 'SUCCESS') NOT NULL DEFAULT 'INIT',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(createTableQuery);

    const insertQuery = `
      INSERT INTO sipamit_billing.postingbatch_backup 
        (selectedPeriod, totalPelanggan, totalBatches, batchSize, flagPostUlang)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query<OkPacket>(insertQuery, [
      data.selectedPeriod,
      data.totalPelanggan,
      data.totalBatches,
      data.batchSize,
      data.flagPostUlang,
    ]);

    if (result.affectedRows > 0) {
      createProcessBatchLog({ backup_id: result.insertId });
      return NextResponse.json({
        status: 200,
        message: "Backup created successfully",
        backupID: result.insertId,
      });
    } else {
      return NextResponse.json({
        status: 500,
        message: "Failed to insert backup data",
      });
    }
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
