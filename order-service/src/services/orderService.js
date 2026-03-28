let orders = [];

exports.create = async ({ userId, productName, quantity }) => {
  if (!userId || !productName || !quantity) {
    throw new Error("Missing fields");
  }

  const order = {
    id: Date.now(),
    userId,
    productName,
    quantity,
    status: "CREATED"
  };

  orders.push(order);

  return {
    message: "Order created",
    order
  };
};

exports.getAll = async () => {
  return orders;
};