jest.mock('../../repositories/orderRepo', () => ({
  getAllOrders: jest.fn(),
  getById: jest.fn(),
  getByUser: jest.fn(),
  addOrder: jest.fn(),
  updateOrder: jest.fn(),
  deleteOrder: jest.fn(),
}));

jest.mock('../../models/productModel', () => ({
  find: jest.fn(),
}));

const orderRepo = require('../../repositories/orderRepo');
const Product = require('../../models/productModel');
const orderService = require('../../services/orderService');

const product = (id, title, price, quantity) => ({
  _id: { toString: () => id },
  title,
  price,
  quantity,
});

beforeEach(() => {
  jest.clearAllMocks();
  orderRepo.addOrder.mockImplementation(async (o) => o);
});

describe('orderService pass-through methods', () => {
  test('delegate to the repository', async () => {
    orderRepo.getAllOrders.mockResolvedValue(['a']);
    orderRepo.getById.mockResolvedValue({ id: 1 });
    orderRepo.getByUser.mockResolvedValue(['u']);
    orderRepo.updateOrder.mockResolvedValue({ ok: true });
    orderRepo.deleteOrder.mockResolvedValue({ deleted: true });

    expect(await orderService.getAllOrders()).toEqual(['a']);
    expect(await orderService.getById('1')).toEqual({ id: 1 });
    expect(await orderService.getByUser('user1')).toEqual(['u']);
    expect(await orderService.updateOrder('1', { status: 'x' })).toEqual({ ok: true });
    expect(await orderService.deleteOrder('1')).toEqual({ deleted: true });

    expect(orderRepo.getById).toHaveBeenCalledWith('1');
    expect(orderRepo.getByUser).toHaveBeenCalledWith('user1');
    expect(orderRepo.updateOrder).toHaveBeenCalledWith('1', { status: 'x' });
    expect(orderRepo.deleteOrder).toHaveBeenCalledWith('1');
  });
});

describe('orderService.addOrder', () => {
  test('uses DB prices and titles, ignoring client-supplied prices', async () => {
    Product.find.mockResolvedValue([product('p1', 'Lamp', 100, 10)]);

    const result = await orderService.addOrder({
      user: 'u1',
      shippingOption: 'pickup',
      items: [{ product: 'p1', quantity: 2, price: 1, title: 'hacked' }],
    });

    expect(result.items).toEqual([
      { product: 'p1', quantity: 2, title: 'Lamp', price: 100 },
    ]);
    expect(result.totalPrice).toBe(200);
  });

  test('queries products by the ids of the ordered items', async () => {
    Product.find.mockResolvedValue([
      product('p1', 'Lamp', 10, 5),
      product('p2', 'Bulb', 5, 5),
    ]);

    await orderService.addOrder({
      items: [
        { product: 'p1', quantity: 1 },
        { product: 'p2', quantity: 1 },
      ],
    });

    expect(Product.find).toHaveBeenCalledWith({ _id: { $in: ['p1', 'p2'] } });
  });

  test('adds 60 shipping cost when shippingOption is "paid"', async () => {
    Product.find.mockResolvedValue([product('p1', 'Lamp', 100, 10)]);

    const result = await orderService.addOrder({
      shippingOption: 'paid',
      items: [{ product: 'p1', quantity: 1 }],
    });

    expect(result.shippingCost).toBe(60);
    expect(result.totalPrice).toBe(160);
  });

  test.each(['free', 'pickup', undefined])(
    'shipping is free when shippingOption is %p',
    async (option) => {
      Product.find.mockResolvedValue([product('p1', 'Lamp', 100, 10)]);

      const result = await orderService.addOrder({
        shippingOption: option,
        items: [{ product: 'p1', quantity: 1 }],
      });

      expect(result.shippingCost).toBe(0);
      expect(result.totalPrice).toBe(100);
    }
  );

  test('sums multiple items correctly', async () => {
    Product.find.mockResolvedValue([
      product('p1', 'Lamp', 100, 10),
      product('p2', 'Bulb', 15, 10),
    ]);

    const result = await orderService.addOrder({
      shippingOption: 'paid',
      items: [
        { product: 'p1', quantity: 2 },
        { product: 'p2', quantity: 3 },
      ],
    });

    expect(result.totalPrice).toBe(100 * 2 + 15 * 3 + 60);
  });

  test('passes through other order fields and strips shippingOption', async () => {
    Product.find.mockResolvedValue([product('p1', 'Lamp', 100, 10)]);

    await orderService.addOrder({
      user: 'u1',
      address: 'Somewhere 1',
      shippingOption: 'paid',
      items: [{ product: 'p1', quantity: 1 }],
    });

    const saved = orderRepo.addOrder.mock.calls[0][0];
    expect(saved.user).toBe('u1');
    expect(saved.address).toBe('Somewhere 1');
    expect(saved).not.toHaveProperty('shippingOption');
  });

  test('throws when a product does not exist', async () => {
    Product.find.mockResolvedValue([]);

    await expect(
      orderService.addOrder({ items: [{ product: 'missing', quantity: 1 }] })
    ).rejects.toThrow('Product missing not found');
    expect(orderRepo.addOrder).not.toHaveBeenCalled();
  });

  test('throws when requested quantity exceeds stock', async () => {
    Product.find.mockResolvedValue([product('p1', 'Lamp', 100, 2)]);

    await expect(
      orderService.addOrder({ items: [{ product: 'p1', quantity: 3 }] })
    ).rejects.toThrow('Not enough stock for Lamp (only 2 left)');
    expect(orderRepo.addOrder).not.toHaveBeenCalled();
  });

  test('allows ordering exactly the available stock', async () => {
    Product.find.mockResolvedValue([product('p1', 'Lamp', 100, 3)]);

    await expect(
      orderService.addOrder({ items: [{ product: 'p1', quantity: 3 }] })
    ).resolves.toBeDefined();
  });
});
