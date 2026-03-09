import XLSX from "xlsx";
import { pool } from "./db.js";

export async function uploadExcel(req, res) {
  const wb = XLSX.read(req.file.buffer);
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

  for (const row of sheet) {
    const {
      cust_id,
      transaction_id,
      customer_name,
      customer_email,
      order_value,
      value_paid,
      latest_date_of_payment
    } = row;

    const customer = await pool.query(
      `INSERT INTO customers(user_id,cust_id,name,email)
       VALUES($1,$2,$3,$4)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [req.user.id, cust_id, customer_name, customer_email]
    );

    const customerId =
      customer.rows[0]?.id ||
      (await pool.query(
        "SELECT id FROM customers WHERE cust_id=$1 AND user_id=$2",
        [cust_id, req.user.id]
      )).rows[0].id;

    await pool.query(
      `INSERT INTO transactions
       (user_id,customer_id,transaction_id,order_value,value_paid,latest_date_of_payment)
       VALUES($1,$2,$3,$4,$5,$6)`,
      [
        req.user.id,
        customerId,
        transaction_id,
        order_value,
        value_paid,
        latest_date_of_payment
      ]
    );
  }

  res.send("Excel processed");
}