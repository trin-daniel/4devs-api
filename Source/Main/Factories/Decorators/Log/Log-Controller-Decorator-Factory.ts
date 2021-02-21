import { Controller } from '@Presentation/Protocols'
import { LogMongoRepository } from '@Infra/Database/Mongo/Repositories/Log-Error/Log-Mongo-Repository'
import { LogControllerDecorator } from '@Main/Decorators/Controllers/Log-Controller-Decorator'

export const LogControllerDecoratorFactory = (controller: Controller): Controller => {
  return new LogControllerDecorator(
    controller,
    new LogMongoRepository()
  )
}
