import { ExpressRouteAdapter } from '@main/adapters/express/express-route-adapter'
import { SaveSurveyResultControllerFactory } from '@main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { Auth } from '@main/middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:survey_id/results',
    Auth(),
    ExpressRouteAdapter(
      SaveSurveyResultControllerFactory()
    )
  )
}
