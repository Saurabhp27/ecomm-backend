const pool = require('../config/db.js');

const createOrder = async (orderData) => {
  const { user_id, product_name, quantity, price } = orderData;
  const query = `
    INSERT INTO orders (user_id, product_name, quantity, price)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [user_id, product_name, quantity, price];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getOrdersByUser = async (userId) => {
  const query = `
    SELECT * FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = { createOrder, getOrdersByUser };