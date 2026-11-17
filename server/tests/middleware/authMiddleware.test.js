process.env.JWT_SECRET = 'test-secret';

const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authMiddleware', () => {
  test('returns 401 when no token is provided', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 for a malformed token', () => {
    const req = { headers: { 'x-access-token': 'not-a-jwt' } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 for a token signed with a different secret', () => {
    const token = jwt.sign({ id: 'u1' }, 'other-secret');
    const req = { headers: { 'x-access-token': token } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 for an expired token', () => {
    const token = jwt.sign({ id: 'u1' }, 'test-secret', { expiresIn: -10 });
    const req = { headers: { 'x-access-token': token } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next and attaches decoded payload to req.user for a valid token', () => {
    const token = jwt.sign({ id: 'u1', role: 'admin' }, 'test-secret');
    const req = { headers: { 'x-access-token': token } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toMatchObject({ id: 'u1', role: 'admin' });
    expect(res.status).not.toHaveBeenCalled();
  });
});
