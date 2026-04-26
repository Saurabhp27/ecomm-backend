const pool = require('../config/db');
const redisClient = require('../config/redis');
const { insertOrder, insertOrderItems, findOrdersByUser } = require('../repositories/orderRepository');

const createOrder = async (orderData) => {
  const { user_id, items } = orderData;
  const client = await pool.connect();

  try {
    if (!user_id) throw new Error('user_id is required');
    if (!items || items.length === 0) throw new Error('items cannot be empty');

    for (const item of items) {
      if (!item.product_name) throw new Error('product_name is required for each item');
      if (item.quantity <= 0) throw new Error('quantity must be greater than 0');
      if (item.price <= 0) throw new Error('price must be greater than 0');
    }

    const total_price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    await client.query('BEGIN');
    const order = await insertOrder(client, user_id, total_price);
    const items_list = await insertOrderItems(client, order.id, items);
    await client.query('COMMIT');

    // Invalidate cache for this user since orders have changed
    await redisClient.del(`orders:${user_id}`);

    return { ...order, items: items_list };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getOrdersByUser = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  const cacheKey = `orders:${userId}`;

  // Step 1 - check cache first
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Step 2 - fetch from DB via repository
  const rows = await findOrdersByUser(userId);

  // Step 3 - group flat rows into nested structure
  const ordersMap = {};
  for (const row of rows) {
    if (!ordersMap[row.order_id]) {
      ordersMap[row.order_id] = {
        id: row.order_id,
        total_price: row.total_price,
        created_at: row.created_at,
        items: []
      };
    }
    ordersMap[row.order_id].items.push({
      product_name: row.product_name,
      quantity: row.quantity,
      price: row.price
    });
  }

  const orders = Object.values(ordersMap);

  // Step 4 - store in cache with 60 seconds expiry
  await redisClient.setEx(cacheKey, 60, JSON.stringify(orders));

  return orders;
};

module.exports = { createOrder, getOrdersByUser };