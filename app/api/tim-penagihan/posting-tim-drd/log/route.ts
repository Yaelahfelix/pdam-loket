import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, OkPacket } from "mysql2";
import getConnection from "@/lib/db";
import { verifyAuth } from "@/lib/session";

type ProcessBatchLogInput = {
  id?: number;
  backup_id: number;
  processed: number;
  tagihanTdkAda: number;
  withUserTimTagih: number;
  withoutUserTimTagih: number;
  nopelTagihanTdkAda: string[];
};

export const POST = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const requestData = await request.json();
    const data = requestData;
    const { backup_id } = data;

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

    const insertQuery = `
      INSERT INTO sipamit_billing.processbatch_log (backup_id)
      VALUES (?)
    `;
    const [insertResult] = await db.query<OkPacket>(insertQuery, [backup_id]);

    return NextResponse.json({
      status: 200,
      message: "Log has been created",
      insertedID: insertResult.insertId,
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

export const PUT = async (request: NextRequest) => {
  try {
    const db = await getConnection();
    const authResult = await verifyAuth(request);

    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const requestData = await request.json();
    const data: ProcessBatchLogInput = requestData;
    const {
      id,
      processed,
      tagihanTdkAda,
      withUserTimTagih,
      withoutUserTimTagih,
      nopelTagihanTdkAda,
    } = data;

    if (!id) {
      return NextResponse.json(
        { message: "ID is required for updates" },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE sipamit_billing.processbatch_log
      SET
        processed = ?,
        tagihanTdkAda = ?,
        withUserTimTagih = ?,
        withoutUserTimTagih = ?,
        nopelTagihanTdkAda = ?
      WHERE id = ?
    `;

    const [updateResult] = await db.query<OkPacket>(updateQuery, [
      processed ?? null,
      tagihanTdkAda ?? null,
      withUserTimTagih ?? null,
      withoutUserTimTagih ?? null,
      JSON.stringify(nopelTagihanTdkAda ?? []),
      id,
    ]);

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { message: "Log entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Log updated successfully",
      updatedID: id,
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
