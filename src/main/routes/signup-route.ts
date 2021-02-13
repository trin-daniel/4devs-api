import { ExpressRouteAdapter } from '@main/adapters/express/express-route-adapter'
import { SignupControllerFactory } from '@main/factories/controllers/account/signup/signup-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', ExpressRouteAdapter(SignupControllerFactory()))
}
