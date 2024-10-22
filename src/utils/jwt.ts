import jwt, { JwtPayload } from 'jsonwebtoken';

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token);
    return decoded as JwtPayload;
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};