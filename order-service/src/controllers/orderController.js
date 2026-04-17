const orderService = require('../services/orderService.js');

const createOrder = async (req, res) => {
  try {
    const userId = req.headers['x-user-id']; // from gateway
    const order = await orderService.createOrder({
      user_id: userId,
      ...req.body,
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const orders = await orderService.getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

module.exports = { createOrder, getOrders };