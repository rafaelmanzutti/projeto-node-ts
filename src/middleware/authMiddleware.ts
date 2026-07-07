import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import jwt from 'jsonwebtoken';
import { env } from '../shared/config/env.js';

interface JwtPayloadCustom {
  payload: {
    id: string;
  };
}

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
      // O verify valida a assinatura E já devolve os dados decodificados com segurança
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayloadCustom;
      const userId = decoded.payload.id;

      // Validação do ID do parâmetro usando a variável do try para comparar
      const paramsId = req.params.id;
      if (paramsId && userId !== paramsId) {
        return res.status(403).json({ message: 'Acesso negado.' });
      }

      // Injeta o ID verificado no Request (o TS não vai reclamar graças ao server.ts)
      req.tokenUserId = userId;

      return next();
    } catch {
      // Se a assinatura falhar, cairá aqui e bloqueará a requisição imediatamente
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  }
}
