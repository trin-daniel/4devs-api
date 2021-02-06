import { Controller } from '../../../../presentation/contracts'
import { LogControllerDecorator } from '../../../decorators/controllers/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/database/mongo/repositories/log-error/log-mongo-repository'

export const logControllerDecoratorFactory = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
