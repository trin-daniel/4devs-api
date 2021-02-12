import { ExpressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { LoadSurveysControllerFactory } from '../factories/controllers/survey/load-surveys/load-surveys-controller'
import { AuthMiddlewareFactory } from '../factories/middlewares/auth-middleware-factory'
import { Router } from 'express'

export default (router: Router): void => {
  const auth = ExpressMiddlewareAdapter(AuthMiddlewareFactory())
  router.get('/surveys', auth, expressRouteAdapter(LoadSurveysControllerFactory()))
}
