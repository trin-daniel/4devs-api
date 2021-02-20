import { ExpressRouteAdapter } from '@main/adapters/express/express-route-adapter'
import { signinControllerFactory } from '@main/factories/controllers/account/sign-in/sign-in-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signin', ExpressRouteAdapter(signinControllerFactory()))
}
