import axios from "axios";

export async function sendEmail(to, amount) {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      to: [{ email: to }],
      subject: "Pending Payment Reminder",
      htmlContent: `<p>Your pending amount is ₹${amount}</p>`,
      sender: { email: "no-reply@debtmanager.com" }
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
}