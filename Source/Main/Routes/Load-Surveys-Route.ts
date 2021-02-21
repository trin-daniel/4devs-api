import { Auth } from '@Main/Middlewares'
import { ExpressRouteAdapter } from '@Main/Adapters/Express/Express-Route-Adapter'
import { LoadSurveysControllerFactory } from '@Main/Factories/Controllers/Survey/Load-Surveys/Load-Surveys-Controller'
import { Router } from 'express'

export default (router: Router): void => {
  router.get('/surveys', Auth(),
    ExpressRouteAdapter(LoadSurveysControllerFactory())
  )
}
