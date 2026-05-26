import jwt from 'jsonwebtoken';

export class TokenAuthUtils {
  public static async jwtGenerate(userPayload: {
    id: string;
    name: string | null;
    email: string;
    password?: string;
  }) {
    const payload = userPayload;
    delete payload.password;

    const acessToken = jwt.sign({ payload }, '04wear90rcv5e4var1v', {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ payload: { id: payload.id } }, 'b14y871qqqqn97y9n841n3s');

    return { acessToken, refreshToken };
  }
}
