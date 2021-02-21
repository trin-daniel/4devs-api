import { ExpressRouteAdapter } from '@Main/Adapters/Express/Express-Route-Adapter'
import { SignUpControllerFactory } from '@Main/Factories/Controllers/Account/Sign-Up/Sign-Up-Controller-Factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/sign-up',
    ExpressRouteAdapter(SignUpControllerFactory())
  )
}
