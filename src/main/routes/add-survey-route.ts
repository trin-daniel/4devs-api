import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { AddSurveyControllerFactory } from '../factories/controllers/add-survey/add-survey-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', expressRouteAdapter(AddSurveyControllerFactory()))
}
