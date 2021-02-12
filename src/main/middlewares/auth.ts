import { ExpressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { AuthMiddlewareFactory } from '../factories/middlewares/auth-middleware-factory'

export const Auth = (role?: string) => ExpressMiddlewareAdapter(AuthMiddlewareFactory(role))
