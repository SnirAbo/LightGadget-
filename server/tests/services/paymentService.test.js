jest.mock('axios');

const axios = require('axios');

const loadService = (env = {}) => {
  jest.resetModules();
  process.env.I4U_BASE_URL = 'https://i4u.test';
  process.env.I4U_API_KEY = 'key123';
  process.env.CLIENT_URL = 'https://client.test';
  process.env.SERVER_URL = 'https://server.test';
  delete process.env.I4U_CC_TYPE;
  delete process.env.I4U_QA_MODE;
  Object.assign(process.env, env);
  // re-require axios mock after resetModules
  const mockedAxios = require('axios');
  const service = require('../../services/paymentService');
  return { service, mockedAxios };
};

const order = { _id: 'o1', totalPrice: 250 };
const customer = { fullName: 'Dan Cohen', phone: '0501234567', email: 'dan@x.com' };

describe('createPaymentPage', () => {
  test('posts the expected payload and returns url and paymentId', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({
      data: { d: { ClearingRedirectUrl: 'https://pay/1', PaymentId: 'pay1' } },
    });

    const result = await service.createPaymentPage(order, customer);

    expect(result).toEqual({ url: 'https://pay/1', paymentId: 'pay1' });
    const [url, payload] = mockedAxios.post.mock.calls[0];
    expect(url).toBe('https://i4u.test/ProcessApiRequestV2');
    expect(payload.request).toMatchObject({
      Invoice4UUserApiKey: 'key123',
      Sum: 250,
      Currency: 'NIS',
      FullName: 'Dan Cohen',
      Phone: '0501234567',
      Email: 'dan@x.com',
      OrderIdClientUsage: 'o1',
      ReturnUrl: 'https://client.test/payment/success',
      CallBackUrl: 'https://server.test/payments/webhook',
      CreditCardCompanyType: 15,
      IsQaMode: false,
    });
  });

  test('uses I4U_CC_TYPE env var and QA mode when configured', async () => {
    const { service, mockedAxios } = loadService({ I4U_CC_TYPE: '7', I4U_QA_MODE: 'true' });
    mockedAxios.post.mockResolvedValue({
      data: { d: { ClearingRedirectUrl: 'u', PaymentId: 'p' } },
    });

    await service.createPaymentPage(order, customer);

    const { request } = mockedAxios.post.mock.calls[0][1];
    expect(request.CreditCardCompanyType).toBe(7);
    expect(request.IsQaMode).toBe(true);
  });

  test('supports the ProcessApiRequestV2Result response shape', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({
      data: { ProcessApiRequestV2Result: { ClearingRedirectUrl: 'u2', PaymentId: 'p2' } },
    });

    await expect(service.createPaymentPage(order, customer)).resolves.toEqual({
      url: 'u2',
      paymentId: 'p2',
    });
  });

  test('throws with the first provider error message', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({
      data: { d: { Errors: [{ Error: 'Bad card' }, { Error: 'Other' }] } },
    });

    await expect(service.createPaymentPage(order, customer)).rejects.toThrow(
      'invoice4u error: Bad card'
    );
  });

  test('throws unknown error when the result is missing', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({ data: {} });

    await expect(service.createPaymentPage(order, customer)).rejects.toThrow(
      'invoice4u error: Unknown invoice4u error'
    );
  });

  test('propagates network errors', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockRejectedValue(new Error('network down'));

    await expect(service.createPaymentPage(order, customer)).rejects.toThrow('network down');
  });
});

describe('verifyClearing', () => {
  let errorSpy;
  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => errorSpy.mockRestore());

  test('queries the last 24 hours using WCF date format', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({ data: { d: [] } });
    const now = 1_700_000_000_000;
    const spy = jest.spyOn(Date, 'now').mockReturnValue(now);

    await service.verifyClearing({ clearingTraceId: 't', paymentId: 'p' });
    spy.mockRestore();

    const [url, payload] = mockedAxios.post.mock.calls[0];
    expect(url).toBe('https://i4u.test/GetClearingLogByParams');
    expect(payload.token).toBe('key123');
    expect(payload.searchParams).toEqual({
      FromDate: `/Date(${now - 24 * 60 * 60 * 1000})/`,
      ToDate: `/Date(${now})/`,
      IsSuccess: true,
    });
  });

  test('returns true when a successful log matches the clearingTraceId', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({
      data: { d: [{ IsSuccess: true, ClearingTraceId: 123, PaymentId: 'x' }] },
    });

    await expect(
      service.verifyClearing({ clearingTraceId: '123', paymentId: 'nope' })
    ).resolves.toBe(true);
  });

  test('returns true when a successful log matches the paymentId', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({
      data: { GetClearingLogByParamsResult: [{ IsSuccess: true, ClearingTraceId: 1, PaymentId: 55 }] },
    });

    await expect(
      service.verifyClearing({ clearingTraceId: 'zzz', paymentId: '55' })
    ).resolves.toBe(true);
  });

  test('returns false for credit (refund) logs', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({
      data: { d: [{ IsSuccess: true, IsCredit: true, ClearingTraceId: 1, PaymentId: 2 }] },
    });

    await expect(
      service.verifyClearing({ clearingTraceId: 1, paymentId: 2 })
    ).resolves.toBe(false);
  });

  test('returns false for unsuccessful logs', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({
      data: { d: [{ IsSuccess: false, ClearingTraceId: 1, PaymentId: 2 }] },
    });

    await expect(
      service.verifyClearing({ clearingTraceId: 1, paymentId: 2 })
    ).resolves.toBe(false);
  });

  test('returns false when no logs match or response is empty', async () => {
    const { service, mockedAxios } = loadService();
    mockedAxios.post.mockResolvedValue({ data: {} });

    await expect(
      service.verifyClearing({ clearingTraceId: 1, paymentId: 2 })
    ).resolves.toBe(false);
  });

  test('logs and rethrows request errors', async () => {
    const { service, mockedAxios } = loadService();
    const err = Object.assign(new Error('boom'), { response: { status: 500 } });
    mockedAxios.post.mockRejectedValue(err);

    await expect(
      service.verifyClearing({ clearingTraceId: 1, paymentId: 2 })
    ).rejects.toThrow('boom');
    expect(errorSpy).toHaveBeenCalledWith('CLEARING LOGS ERROR STATUS:', 500);
  });
});
