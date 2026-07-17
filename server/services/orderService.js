const orderRepo = require('../repositories/orderRepo');
const Product = require('../models/productModel');

const getAllOrders = () => orderRepo.getAllOrders();
const getById    = (id)  => orderRepo.getById(id);
const getByUser  = (user) => orderRepo.getByUser(user);
const updateOrder = (id, obj) => orderRepo.updateOrder(id, obj);
const deleteOrder = (id)      => orderRepo.deleteOrder(id);

const addOrder = async (obj) => {
  const { items, shippingCost, ...rest } = obj;

  // Fetch authoritative prices from DB — never trust client-supplied prices.
  const ids = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids } });
  const byId = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

  const authorizedItems = items.map(({ product, quantity }) => {
    const p = byId[product.toString()];
    if (!p) throw new Error(`Product ${product} not found`);
    return { product, quantity, title: p.title, price: p.price };
  });

  const itemsTotal = authorizedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cost = Number(shippingCost) >= 0 ? Number(shippingCost) : 0;

  return orderRepo.addOrder({
    ...rest,
    items: authorizedItems,
    shippingCost: cost,
    totalPrice: itemsTotal + cost,
  });
};

module.exports = { getAllOrders, getById, getByUser, addOrder, updateOrder, deleteOrder };
