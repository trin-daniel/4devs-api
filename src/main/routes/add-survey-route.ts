import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { AddSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { Router } from 'express'
import { AuthMiddlewareFactory } from '../factories/middlewares/auth-middleware-factory'
import { ExpressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'

export default (router: Router): void => {
  const auth = ExpressMiddlewareAdapter(AuthMiddlewareFactory('admin'))
  router.post('/surveys', auth, expressRouteAdapter(AddSurveyControllerFactory()))
}
