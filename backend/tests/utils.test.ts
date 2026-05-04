import mongoose from 'mongoose';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { generateToken, verifyToken } from '../src/lib/jwt.js';
import { authMiddleware, errorHandler } from '../src/middleware/auth.js';
import { connectDB, disconnectDB } from '../src/lib/db.js';

describe('backend utilities', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/interview-test';
  });

  it('generates and verifies jwt tokens', () => {
    const token = generateToken('user-123');
    const decoded = verifyToken(token);

    expect(decoded).toMatchObject({ userId: 'user-123' });
  });

  it('auth middleware rejects missing and invalid tokens', () => {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const next = vi.fn();

    authMiddleware({ headers: {} } as any, { status, json } as any, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('auth middleware accepts valid tokens', () => {
    const token = generateToken('user-123');
    const next = vi.fn();

    authMiddleware(
      { headers: { authorization: `Bearer ${token}` } } as any,
      { status: vi.fn(), json: vi.fn() } as any,
      next
    );

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('error handler returns error details', () => {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();

    errorHandler({ status: 418, message: 'Teapot' }, {} as any, { status, json } as any, vi.fn());

    expect(status).toHaveBeenCalledWith(418);
    expect(json).toHaveBeenCalledWith({ error: 'Teapot' });
  });

  it('connects and disconnects from mongo', async () => {
    const connectSpy = vi.spyOn(mongoose, 'connect').mockResolvedValueOnce(mongoose as any);
    const disconnectSpy = vi.spyOn(mongoose, 'disconnect').mockResolvedValueOnce(undefined);

    await connectDB();
    await disconnectDB();

    expect(connectSpy).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});