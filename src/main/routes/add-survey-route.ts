import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { AddSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { Auth } from '../middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', Auth('admin'), expressRouteAdapter(AddSurveyControllerFactory()))
}
