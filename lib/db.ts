import mysql, { Pool } from "mysql2/promise";

let pool: Pool | null = null;
const MAX_RETRIES = 3;

async function connectWithRetry(retries = 0): Promise<Pool> {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT!),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 5,
        queueLimit: 0,
        waitForConnections: true,
        connectTimeout: 20000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      });

      await pool.getConnection().then((conn) => {
        console.log("Database connection established successfully");
        conn.release();
      });
    }

    return pool;
  } catch (error) {
    console.error(`Connection attempt ${retries + 1} failed:`, error);

    pool = null;

    if (retries < MAX_RETRIES) {
      const delay = Math.pow(2, retries) * 1000;
      console.log(`Retrying in ${delay}ms...`);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(connectWithRetry(retries + 1));
        }, delay);
      });
    }

    throw new Error(
      `Failed to connect to database after ${MAX_RETRIES} attempts: ${error.message}`
    );
  }
}

async function getConnection() {
  return connectWithRetry();
}

export default getConnection;
