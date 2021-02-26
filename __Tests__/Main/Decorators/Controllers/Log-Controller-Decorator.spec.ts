import { Account } from '@Application/Entities'
import { Controller, Request, Response } from '@Presentation/Protocols'
import { Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { LogControllerDecorator } from '@Main/Decorators/Controllers/Log-Controller-Decorator'
import { LogErrorRepository } from '@Data/Protocols/Database/Log'

const MockController = (): Controller => {
  class ControllerSutb implements Controller {
    public async handle (request: Request): Promise<Response> {
      return Promise.resolve(Ok(MockAccount())
      )
    }
  }
  return new ControllerSutb()
}

const MockRequest = (): Request => ({
  body:
  {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    confirmation: 'any_password'
  }
})

const MockAccount = (): Account => (
  {
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  }
)

const MockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositorySutb implements LogErrorRepository {
    async LogError (): Promise<void> {}
  }
  return new LogErrorRepositorySutb()
}

type SutTypes = {Sut: LogControllerDecorator, ControllerStub: Controller, LogErrorRepositoryStub: LogErrorRepository}

const makeSut = (): SutTypes => {
  const LogErrorRepositoryStub = MockLogErrorRepository()
  const ControllerStub = MockController()
  const Sut = new LogControllerDecorator(ControllerStub, LogErrorRepositoryStub)
  return { Sut, ControllerStub, LogErrorRepositoryStub }
}

describe('Log Controller Decorator', () => {
  describe('#Controller', () => {
    test('Should call any controller implementation with correct values', async () => {
      const { Sut, ControllerStub } = makeSut()
      const HandleSpy = jest.spyOn(ControllerStub, 'handle')
      await Sut.handle(MockRequest())
      expect(HandleSpy).toHaveBeenCalledWith(MockRequest())
    })

    test('Should return the same result of the controller', async () => {
      const { Sut } = makeSut()
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Ok(MockAccount()))
    })

    test('Should call LogErrorRepository if controller returns a server error', async () => {
      const { Sut, ControllerStub, LogErrorRepositoryStub } = makeSut()
      const ErrorMsg = new Error('Internal Server Error')
      jest.spyOn(ControllerStub, 'handle').mockResolvedValue(ServerErrorHelper(ErrorMsg))
      const logErrorSpy = jest.spyOn(LogErrorRepositoryStub, 'LogError')
      const Request = MockRequest()
      await Sut.handle(Request)
      expect(logErrorSpy).toHaveBeenCalledWith(ErrorMsg.stack)
    })
  })
})
