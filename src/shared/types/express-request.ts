//import { Request } from 'express';

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace Express {
    interface Request {
      tokenUserId: string;
    }
  }
}

export {};
