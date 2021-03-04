import { Account } from '@Application/Entities'
import { Controller, Request, Response } from '@Presentation/Protocols'
import { Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { LogControllerDecorator } from '@Main/Decorators/Controllers/Log-Controller-Decorator'
import { LogErrorRepository } from '@Data/Protocols/Database/Log'
import Faker from 'faker'

interface SutTypes {
  Sut: LogControllerDecorator,
  ControllerStub: Controller,
  LogErrorRepositoryStub: LogErrorRepository
}

const PASSWORD_FREZEED = Faker.internet.password()
const MockRequest = (): Request =>
  ({
    body:
    {
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: PASSWORD_FREZEED,
      confirmation: PASSWORD_FREZEED
    }
  })
const MOCK_REQUEST_INSTANCE = MockRequest()
const MockAccount = (): Account => (
  {
    id: Faker.random.uuid(),
    name: MOCK_REQUEST_INSTANCE.body.name,
    email: MOCK_REQUEST_INSTANCE.body.email,
    password: MOCK_REQUEST_INSTANCE.body.password
  }
)
const MOCK_ACCOUNT_INSTANCE = MockAccount()
const MockController = (): Controller => {
  class ControllerSutb implements Controller {
    public async handle (request: Request): Promise<Response> {
      return Promise.resolve(Ok(MOCK_ACCOUNT_INSTANCE)
      )
    }
  }
  return new ControllerSutb()
}

const MockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositorySutb implements LogErrorRepository {
    async LogError (): Promise<void> {}
  }
  return new LogErrorRepositorySutb()
}

const MakeSut = (): SutTypes => {
  const LogErrorRepositoryStub = MockLogErrorRepository()
  const ControllerStub = MockController()
  const Sut = new LogControllerDecorator(ControllerStub, LogErrorRepositoryStub)
  return { Sut, ControllerStub, LogErrorRepositoryStub }
}

describe('Log Controller Decorator', () => {
  describe('#Controller', () => {
    test('Should call any controller implementation with correct values', async () => {
      const { Sut, ControllerStub } = MakeSut()
      const HandleSpy = jest.spyOn(ControllerStub, 'handle')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(HandleSpy).toHaveBeenCalledWith(MOCK_REQUEST_INSTANCE)
    })

    test('Should return the same result of the controller', async () => {
      const { Sut } = MakeSut()
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Ok(MOCK_ACCOUNT_INSTANCE))
    })

    test('Should call LogErrorRepository if controller returns a server error', async () => {
      const { Sut, ControllerStub, LogErrorRepositoryStub } = MakeSut()
      const ErrorMsg = new Error('Internal Server Error')
      jest.spyOn(ControllerStub, 'handle').mockResolvedValue(ServerErrorHelper(ErrorMsg))
      const logErrorSpy = jest.spyOn(LogErrorRepositoryStub, 'LogError')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(logErrorSpy).toHaveBeenCalledWith(ErrorMsg.stack)
    })
  })
})
