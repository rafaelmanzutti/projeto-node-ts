import { authRouter } from '../../modules/Auth/infra/http/auth.routes.js';
import { userRouter } from '../../modules/User/infra/http/user.routes.js';

export const routes = [authRouter, userRouter];
