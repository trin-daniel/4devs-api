import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { SignupControllerFactory } from '../factories/controllers/signup/signup-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(SignupControllerFactory()))
}
