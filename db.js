import pkg from "pg";
const { Pool } = pkg;

// DEBUG: confirm env loaded
console.log("DB URL:", process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});