

const pool = require('../config/db.js');

const insertOrder = async (client, user_id, total_price) => {
  const result = await client.query(
    `INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *;`,
    [user_id, total_price]
  );
  return result.rows[0];
};

const insertOrderItems = async (client, order_id, items) => {
  const insertedItems = [];

  for (const item of items) {
    const { product_name, quantity, price } = item;
    const result = await client.query(
      `INSERT INTO order_items (order_id, product_name, quantity, price)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [order_id, product_name, quantity, price]
    );
    insertedItems.push(result.rows[0]);
  }

  return insertedItems;
};

const findOrdersByUser = async (userId) => {
  const query = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      o.created_at,
      oi.product_name,
      oi.quantity,
      oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = { insertOrder, insertOrderItems, findOrdersByUser };