import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('authenticate middleware - non bypass flow', () => {
  beforeEach(() => {
    process.env.BYPASS_AUTH = 'false';
    vi.resetModules();
  });

  it('returns 401 when authorization header missing', async () => {
    vi.doMock('../../src/config/db.js', () => ({
      firebaseAdmin: null,
      supabase: null,
    }));

    const { authenticate } = await import('../../src/middleware/auth.js');

    const req = { headers: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await authenticate(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 500 when firebase admin missing', async () => {
    vi.doMock('../../src/config/db.js', () => ({
      firebaseAdmin: null,
      supabase: null,
    }));

    const { authenticate } = await import('../../src/middleware/auth.js');

    const req = {
      headers: {
        authorization: 'Bearer token123',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await authenticate(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('returns 500 when supabase missing', async () => {
    const firebaseAdmin = {
      auth: () => ({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'firebase-user',
        }),
      }),
    };

    vi.doMock('../../src/config/db.js', () => ({
      firebaseAdmin,
      supabase: null,
    }));

    const { authenticate } = await import('../../src/middleware/auth.js');

    const req = {
      headers: {
        authorization: 'Bearer token123',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await authenticate(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('returns 403 when profile not found', async () => {
    const firebaseAdmin = {
      auth: () => ({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'firebase-user',
        }),
      }),
    };

    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: () =>
                Promise.resolve({
                  data: null,
                  error: null,
                }),
            }),
          }),
        }),
      }),
    };

    vi.doMock('../../src/config/db.js', () => ({
      firebaseAdmin,
      supabase,
    }));

    const { authenticate } = await import('../../src/middleware/auth.js');

    const req = {
      headers: {
        authorization: 'Bearer token123',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await authenticate(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 500 when database query fails', async () => {
    const firebaseAdmin = {
      auth: () => ({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'firebase-user',
        }),
      }),
    };

    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: () =>
                Promise.resolve({
                  data: null,
                  error: {
                    message: 'db failure',
                  },
                }),
            }),
          }),
        }),
      }),
    };

    vi.doMock('../../src/config/db.js', () => ({
      firebaseAdmin,
      supabase,
    }));

    const { authenticate } = await import('../../src/middleware/auth.js');

    const req = {
      headers: {
        authorization: 'Bearer token123',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await authenticate(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('authenticates valid firebase user', async () => {
    const firebaseAdmin = {
      auth: () => ({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'firebase-user',
        }),
      }),
    };

    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: () =>
                Promise.resolve({
                  data: {
                    id: 'user-1',
                    firebase_uid: 'firebase-user',
                    role: 'driver',
                    full_name: 'John',
                    phone: '9999999999',
                  },
                  error: null,
                }),
            }),
          }),
        }),
      }),
    };

    vi.doMock('../../src/config/db.js', () => ({
      firebaseAdmin,
      supabase,
    }));

    const { authenticate } = await import('../../src/middleware/auth.js');

    const req = {
      headers: {
        authorization: 'Bearer token123',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.role).toBe('driver');
  });

  it('returns 401 when firebase throws', async () => {
    const firebaseAdmin = {
      auth: () => ({
        verifyIdToken: vi.fn().mockRejectedValue(
          new Error('invalid token')
        ),
      }),
    };

    vi.doMock('../../src/config/db.js', () => ({
      firebaseAdmin,
      supabase: {},
    }));

    const { authenticate } = await import('../../src/middleware/auth.js');

    const req = {
      headers: {
        authorization: 'Bearer token123',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await authenticate(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });
});