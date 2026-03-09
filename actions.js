export async function addRecord(req, res) {
  const { cust_id, transaction_id, order_value } = req.body;

  await pool.query(
    `INSERT INTO transactions(user_id,customer_id,transaction_id,order_value,value_paid)
     SELECT $1,id,$2,$3,0 FROM customers WHERE cust_id=$4`,
    [req.user.id, transaction_id, order_value, cust_id]
  );

  res.send("Record added");
}

export async function updatePayment(req, res) {
  const { transaction_id, amount } = req.body;

  await pool.query(
    `UPDATE transactions
     SET value_paid = value_paid + $1,
         latest_date_of_payment = CURRENT_DATE
     WHERE transaction_id=$2 AND user_id=$3`,
    [amount, transaction_id, req.user.id]
  );

  res.send("Payment updated");
}

export async function freeze(req, res) {
  const { cust_id, transaction_id } = req.body;

  if (cust_id) {
    await pool.query(
      "UPDATE customers SET status='FROZEN' WHERE cust_id=$1 AND user_id=$2",
      [cust_id, req.user.id]
    );
  }

  if (transaction_id) {
    await pool.query(
      "UPDATE transactions SET status='FROZEN' WHERE transaction_id=$1 AND user_id=$2",
      [transaction_id, req.user.id]
    );
  }

  res.send("Frozen");
}

export const report = async (req, res) => {
  try {
    // dummy response for now
    res.json({
      total_customers: 0,
      total_debt: 0,
      customers: []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};