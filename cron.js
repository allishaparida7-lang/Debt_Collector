import cron from "node-cron";
import { pool } from "./db.js";
import { sendEmail } from "./email.js";

cron.schedule("0 9 * * *", async () => {
  const rows = await pool.query(
    `SELECT c.email,
            (t.order_value - t.value_paid) AS pending
     FROM transactions t
     JOIN customers c ON c.id=t.customer_id
     WHERE t.status!='FROZEN'
     AND CURRENT_DATE - t.latest_date_of_payment > 37
     AND t.order_value > t.value_paid`
  );

  for (const r of rows.rows) {
    await sendEmail(r.email, r.pending);
  }
});