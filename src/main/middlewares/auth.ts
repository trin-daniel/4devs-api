import { ExpressMiddlewareAdapter } from '@main/adapters/express/express-middleware-adapter'
import { AuthMiddlewareFactory } from '@main/factories/middlewares/auth-middleware-factory'

export const Auth = (role?: string) => ExpressMiddlewareAdapter(AuthMiddlewareFactory(role))
