import { ExpressRouteAdapter } from '@Main/Adapters/Express/Express-Route-Adapter'
import { signinControllerFactory } from '@Main/Factories/Controllers/Account/Sign-In/Sign-In-Controller-Factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/sign-in',
    ExpressRouteAdapter(signinControllerFactory())
  )
}
