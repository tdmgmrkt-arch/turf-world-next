import pg from "pg";

const DATABASE_URL = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;
const SESSION_ID = "payses_01KV9BPBJFNABHBZFDNKA7JZR8";

if (!DATABASE_URL) {
  console.error("ERROR: set DATABASE_URL env var first");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const sessionRes = await client.query(
  `SELECT * FROM payment_session WHERE id = $1`,
  [SESSION_ID],
);
console.log("\n--- payment_session ---");
console.log(sessionRes.rows);

const PAYMENT_COLLECTION_ID = "pay_col_01KV9BPBDECR9TRXD1Q62DR8PS";

const tablesRes = await client.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND (table_name LIKE '%cart%' OR table_name LIKE '%payment%' OR table_name LIKE '%order%')
  ORDER BY table_name
`);
console.log("\n--- relevant tables ---");
console.log(tablesRes.rows.map((r) => r.table_name));

const linkRes = await client.query(
  `
    SELECT * FROM cart_payment_collection
    WHERE payment_collection_id = $1
  `,
  [PAYMENT_COLLECTION_ID],
).catch((e) => ({ error: e.message }));
console.log("\n--- cart_payment_collection link ---");
console.log(linkRes.rows || linkRes);

const orderLinkRes = await client.query(
  `
    SELECT * FROM order_payment_collection
    WHERE payment_collection_id = $1
  `,
  [PAYMENT_COLLECTION_ID],
).catch((e) => ({ error: e.message }));
console.log("\n--- order_payment_collection link ---");
console.log(orderLinkRes.rows || orderLinkRes);

const pcRes = await client.query(
  `SELECT * FROM payment_collection WHERE id = $1`,
  [PAYMENT_COLLECTION_ID],
);
console.log("\n--- payment_collection ---");
console.log(pcRes.rows);

await client.end();
