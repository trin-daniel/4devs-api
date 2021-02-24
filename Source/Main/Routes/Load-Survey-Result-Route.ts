import { Auth } from '@Main/Middlewares'
import { ExpressRouteAdapter } from '@Main/Adapters/Express/Express-Route-Adapter'
import { LoadSurveyResultControllerFactory } from '@Main/Factories/Controllers/Survey-Result/Load-Survey-Result/Load-Survey-Result-Controller-Factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.get('/surveys/:survey_id/results',
    Auth(), ExpressRouteAdapter(LoadSurveyResultControllerFactory())
  )
}
