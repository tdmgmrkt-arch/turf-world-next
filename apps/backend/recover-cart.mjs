import pg from "pg";

const DATABASE_URL = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;
const BACKEND_URL = "https://turf-worldbackend-production.up.railway.app";
const CART_ID = "cart_01KV9BP7FNKG8SA853EPMFCYJ2";
const DRY_RUN = process.env.DRY_RUN !== "false";

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const keys = await client.query(`
  SELECT id, token, title, revoked_at
  FROM api_key
  WHERE type = 'publishable' AND revoked_at IS NULL
`);
console.log("\n--- publishable api keys ---");
console.log(keys.rows);

await client.end();

if (keys.rows.length === 0) {
  console.error("No publishable keys found");
  process.exit(1);
}

const pubKey = keys.rows[0].token;
console.log(`\nUsing key: ${keys.rows[0].title} (${pubKey.slice(0, 12)}...)`);

if (DRY_RUN) {
  console.log("\n⚠️  DRY RUN — not calling /complete. Set DRY_RUN=false to actually recover.");
  console.log(`\nWould POST: ${BACKEND_URL}/store/carts/${CART_ID}/complete`);
  process.exit(0);
}

console.log(`\n>>> Calling POST ${BACKEND_URL}/store/carts/${CART_ID}/complete ...`);
const res = await fetch(`${BACKEND_URL}/store/carts/${CART_ID}/complete`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-publishable-api-key": pubKey,
  },
});

const text = await res.text();
console.log(`\nStatus: ${res.status}`);
console.log(`Body: ${text}`);
