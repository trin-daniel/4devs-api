import { Auth } from '@main/middlewares/auth'
import { ExpressRouteAdapter } from '@main/adapters/express/express-route-adapter'
import { LoadSurveysControllerFactory } from '@main/factories/controllers/survey/load-surveys/load-surveys-controller'
import { Router } from 'express'

export default (router: Router): void => {
  router.get('/surveys', Auth(), ExpressRouteAdapter(LoadSurveysControllerFactory()))
}
