import crypto from 'crypto';

// Simple JWT-like token generator (for demo purposes)
export const generateToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  const signature = crypto
    .createHmac('sha256', 'hrms-secret-key')
    .update(`${header}.${body}`)
    .digest('base64');

  return `${header}.${body}.${signature}`;
};

export const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', 'hrms-secret-key')
      .update(`${header}.${body}`)
      .digest('base64');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(atob(body));
    return payload;
  } catch (error) {
    return null;
  }
};

export const hashPassword = (password) => {
  // Simple hash for demo (use bcrypt in production)
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};
