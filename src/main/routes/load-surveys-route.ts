import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { LoadSurveysControllerFactory } from '../factories/controllers/survey/load-surveys/load-surveys-controller'
import { Router } from 'express'
import { Auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.get('/surveys', Auth(), expressRouteAdapter(LoadSurveysControllerFactory()))
}
