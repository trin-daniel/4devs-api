import { ExpressRouteAdapter } from '@Main/Adapters/Express/Express-Route-Adapter'
import { SaveSurveyResultControllerFactory } from '@Main/Factories/Controllers/Survey-Result/Save-Survey-Result/Save-Survey-Result-Controller-Factory'
import { Auth } from '@Main/Middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:survey_id/results',
    Auth(),
    ExpressRouteAdapter(SaveSurveyResultControllerFactory())
  )
}
