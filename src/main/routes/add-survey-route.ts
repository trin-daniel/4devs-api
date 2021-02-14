import { Auth } from '@main/middlewares'
import { ExpressRouteAdapter } from '@main/adapters/express/express-route-adapter'
import { AddSurveyControllerFactory } from '@main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', Auth('admin'), ExpressRouteAdapter(AddSurveyControllerFactory()))
}
