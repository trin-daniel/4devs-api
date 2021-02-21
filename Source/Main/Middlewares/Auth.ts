import { ExpressMiddlewareAdapter } from '@Main/Adapters/Express/Express-Middleware-Adapter'
import { AuthMiddlewareFactory } from '@Main/Factories/Middlewares/Auth-Middleware-Factory'

export const Auth = (role?: string) => ExpressMiddlewareAdapter(AuthMiddlewareFactory(role))
