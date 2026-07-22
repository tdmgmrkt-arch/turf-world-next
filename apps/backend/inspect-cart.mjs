import pg from "pg";

const DATABASE_URL = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;
const CART_ID = "cart_01KV9BP7FNKG8SA853EPMFCYJ2";

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const cart = await client.query(`SELECT * FROM cart WHERE id = $1`, [CART_ID]);
console.log("\n--- cart ---");
console.log(cart.rows);

const addrs = await client.query(
  `
    SELECT a.*
    FROM cart_address a
    JOIN cart c ON (c.shipping_address_id = a.id OR c.billing_address_id = a.id)
    WHERE c.id = $1
  `,
  [CART_ID],
);
console.log("\n--- addresses ---");
console.log(addrs.rows);

const items = await client.query(
  `SELECT id, title, product_title, quantity, unit_price FROM cart_line_item WHERE cart_id = $1`,
  [CART_ID],
);
console.log("\n--- line items ---");
console.log(items.rows);

const shipping = await client.query(
  `SELECT * FROM cart_shipping_method WHERE cart_id = $1`,
  [CART_ID],
);
console.log("\n--- shipping methods ---");
console.log(shipping.rows);

await client.end();
