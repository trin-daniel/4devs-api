import { Auth } from '@Main/Middlewares'
import { ExpressRouteAdapter } from '@Main/Adapters/Express/Express-Route-Adapter'
import { AddSurveyControllerFactory } from '@Main/Factories/Controllers/Survey/Add-Survey/Add-Survey-Controller-Factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', Auth('admin'),
    ExpressRouteAdapter(AddSurveyControllerFactory())
  )
}
