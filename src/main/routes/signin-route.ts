import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { signinControllerFactory } from '../factories/controllers/account/signin/signin-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signin', expressRouteAdapter(signinControllerFactory()))
}
