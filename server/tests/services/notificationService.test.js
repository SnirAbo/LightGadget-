const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: (...args) => mockSendMail(...args) })),
}));

process.env.NOTIFY_EMAIL_USER = 'shop@test.com';
process.env.OWNER_EMAIL = 'owner@test.com';

const { sendOrderEmails } = require('../../services/notificationService');

const baseOrder = {
  _id: 'o1',
  phoneNumber: '0501234567',
  address: 'Herzl 1',
  city: 'Tel Aviv',
  postalCode: '12345',
  totalPrice: 260,
  shippingCost: 60,
  items: [
    { title: 'Lamp', quantity: 2, price: 100 },
  ],
};
const customer = { name: 'Dan', email: 'dan@test.com' };

let errorSpy;
beforeEach(() => {
  mockSendMail.mockReset();
  mockSendMail.mockResolvedValue({});
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => errorSpy.mockRestore());

describe('sendOrderEmails', () => {
  test('sends two emails: one to the owner and one to the customer', async () => {
    await sendOrderEmails(baseOrder, customer);

    expect(mockSendMail).toHaveBeenCalledTimes(2);
    expect(mockSendMail.mock.calls[0][0].to).toBe('owner@test.com');
    expect(mockSendMail.mock.calls[1][0].to).toBe('dan@test.com');
    expect(mockSendMail.mock.calls[0][0].from).toContain('shop@test.com');
  });

  test('owner email contains customer, address, items and totals', async () => {
    await sendOrderEmails(baseOrder, customer);
    const { html } = mockSendMail.mock.calls[0][0];

    expect(html).toContain('Dan');
    expect(html).toContain('dan@test.com');
    expect(html).toContain('0501234567');
    expect(html).toContain('Herzl 1, Tel Aviv 12345');
    expect(html).toContain('Lamp');
    expect(html).toContain('₪200'); // line total 100 * 2
    expect(html).toContain('₪260');
    expect(html).toContain('₪60');
  });

  test('customer email greets the customer and shows the total', async () => {
    await sendOrderEmails(baseOrder, customer);
    const { html } = mockSendMail.mock.calls[1][0];

    expect(html).toContain('Dan');
    expect(html).toContain('Lamp');
    expect(html).toContain('₪260');
  });

  test('omits postal code when not provided', async () => {
    await sendOrderEmails({ ...baseOrder, postalCode: undefined }, customer);
    const { html } = mockSendMail.mock.calls[0][0];

    expect(html).toContain('Herzl 1, Tel Aviv<');
    expect(html).not.toContain('undefined');
  });

  test('shows shipping cost line only when shippingCost > 0', async () => {
    await sendOrderEmails({ ...baseOrder, shippingCost: 0, totalPrice: 200 }, customer);

    for (const call of mockSendMail.mock.calls) {
      expect(call[0].html).not.toContain('מתוכם משלוח');
    }
  });

  test('renders a row for every item', async () => {
    const items = [
      { title: 'Lamp', quantity: 1, price: 10 },
      { title: 'Bulb', quantity: 3, price: 5 },
    ];
    await sendOrderEmails({ ...baseOrder, items }, customer);
    const { html } = mockSendMail.mock.calls[0][0];

    expect(html).toContain('Lamp');
    expect(html).toContain('Bulb');
    expect(html).toContain('₪15'); // 5 * 3
  });

  test('still emails the customer when the owner email fails', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('smtp down'));

    await expect(sendOrderEmails(baseOrder, customer)).resolves.toBeUndefined();

    expect(mockSendMail).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledWith('Owner email failed:', 'o1', 'smtp down');
  });

  test('does not throw when the customer email fails', async () => {
    mockSendMail.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('bad address'));

    await expect(sendOrderEmails(baseOrder, customer)).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledWith('Customer email failed:', 'o1', 'bad address');
  });
});
