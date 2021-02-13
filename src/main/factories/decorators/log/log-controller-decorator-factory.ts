import { Controller } from '@presentation/contracts'
import { LogMongoRepository } from '@infra/database/mongo/repositories/log-error/log-mongo-repository'
import { LogControllerDecorator } from '@main/decorators/controllers/log-controller-decorator'

export const LogControllerDecoratorFactory = (controller: Controller): Controller => {
  return new LogControllerDecorator(
    controller,
    new LogMongoRepository()
  )
}
