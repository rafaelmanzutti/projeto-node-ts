import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import jwt from 'jsonwebtoken';
import { env } from '../shared/config/env.js';

export class AuthMiddleware {
  public static async authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Token de autenticação é obrigatório.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Formato inválido. Use: Bearer <token>' });
    }

    const ZTokenSchema = z.string().min(25, { message: 'Token é obrigatório' });

    const validation = ZTokenSchema.safeParse(token);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validation.error.issues,
      });
    }
    try {
      jwt.verify(token, env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    const paramsId = req.params.id;
    const decode = (jwt.decode(token) as { payload: { id: string } }).payload;
    if (paramsId && decode.id !== paramsId) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    next();
  }
}
