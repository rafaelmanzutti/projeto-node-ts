import jwt from 'jsonwebtoken';
import { env } from '../../../shared/config/env.js';

export class TokenAuthUtils {
  public static async jwtGenerate(userPayload: { id: string; name: string | null; email: string }) {
    const accessToken = jwt.sign({ payload: userPayload }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ payload: { id: userPayload.id } }, env.JWT_REFRESH_SECRET);

    return { accessToken, refreshToken };
  }
}
