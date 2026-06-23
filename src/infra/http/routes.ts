import { authRouter } from '../../modules/Auth/infra/http/auth.routes.js';
import { userRouter } from '../../modules/User/infra/http/user.routes.js';
import { resetPasswordRouter } from '../../modules/ResetPassword/infra/http/resetPassword.routes.js';
import { userClientRouter } from '../../modules/UserClient/infra/http/userClient.routes.js';

export const routes = [authRouter, userRouter, resetPasswordRouter, userClientRouter];
