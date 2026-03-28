const orderService = require("../services/orderService");

exports.createOrder = async (req, res) => {
  try {
    const data = await orderService.create(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const data = await orderService.getAll();
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};