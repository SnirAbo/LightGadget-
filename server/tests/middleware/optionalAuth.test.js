process.env.JWT_SECRET = 'test-secret';

const jwt = require('jsonwebtoken');
const optionalAuth = require('../../middleware/optionalAuth');

describe('optionalAuth', () => {
  test('sets req.user to null and continues when no token is given', () => {
    const req = { headers: {} };
    const next = jest.fn();

    optionalAuth(req, {}, next);

    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('sets req.user to null and continues when token is invalid', () => {
    const req = { headers: { 'x-access-token': 'garbage' } };
    const next = jest.fn();

    optionalAuth(req, {}, next);

    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('sets req.user to null when token is signed with a wrong secret', () => {
    const token = jwt.sign({ id: 'u1' }, 'wrong');
    const req = { headers: { 'x-access-token': token } };
    const next = jest.fn();

    optionalAuth(req, {}, next);

    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('attaches decoded payload when token is valid', () => {
    const token = jwt.sign({ id: 'u42' }, 'test-secret');
    const req = { headers: { 'x-access-token': token } };
    const next = jest.fn();

    optionalAuth(req, {}, next);

    expect(req.user).toMatchObject({ id: 'u42' });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
