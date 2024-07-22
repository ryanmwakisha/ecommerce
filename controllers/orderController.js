const { Order, OrderItem, Product } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;
    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const order = await Order.create({ userId, totalAmount });
    await Promise.all(
      items.map(item => OrderItem.create({ ...item, orderId: order.id }))
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
