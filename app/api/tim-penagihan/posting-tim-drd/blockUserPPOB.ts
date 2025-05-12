import getConnection from "@/lib/db";

export async function blockPpobUsers(isActive: boolean) {
  const db = await getConnection();

  //   await db.query(`UPDATE users set is_active=? where is_user_ppob=true`, [
  //     isActive,
  //   ]);

  return true;
}
