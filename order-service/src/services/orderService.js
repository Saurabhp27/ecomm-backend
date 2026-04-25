const pool = require('../config/db');
const { insertOrder, insertOrderItems, findOrdersByUser } = require('../repositories/orderRepository');

const createOrder = async (orderData) => {
  const { user_id, items } = orderData;

  const client = await pool.connect();

  try{

    if (!user_id) throw new Error('user_id is required');
    if (!items || items.length === 0) throw new Error('items cannot be empty');

    for (const item of items) {
      if (!item.product_name) throw new Error('product_name is required for each item');
      if (item.quantity <= 0) throw new Error('quantity must be greater than 0');
      if (item.price <= 0) throw new Error('price must be greater than 0');
    }

    const total_price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    await client.query('BEGIN');
    // Step 1 - create the order
    const order = await insertOrder(client, user_id, total_price);
    // Step 2 - insert all items under that order
    const items_list = await insertOrderItems(client, order.id, items);

    await client.query('COMMIT');

    return { ...order, items: items_list };
  }
  catch (err){
    await client.query('ROLLBACK');
    throw err;
  }finally{
    client.release();
  }
  
};

const getOrdersByUser = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  const rows = await findOrdersByUser(userId);

  // Group flat rows into nested orders with items array
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

  // Convert the map to an array
  return Object.values(ordersMap);
};

module.exports = { createOrder, getOrdersByUser };