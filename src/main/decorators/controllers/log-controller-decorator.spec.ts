import { LogControllerDecorator } from './log-controller-decorator'
import { Controller, Request, Response } from '../../../presentation/contracts'
import { serverError } from '../../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../../data/contracts'

const mockController = (): Controller => {
  class ControllerSutb implements Controller {
    public async handle (request: Request): Promise<Response> {
      return Promise.resolve(
        {
          statusCode: 200,
          body:
          {
            name: 'any_name',
            email: 'any_email@gmail.com',
            password: 'any_password',
            confirmation: 'another_password'
          }
        }
      )
    }
  }
  return new ControllerSutb()
}

const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositorySutb implements LogErrorRepository {
    async logError (): Promise<void> {}
  }
  return new LogErrorRepositorySutb()
}

interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = mockLogErrorRepository()
  const controllerStub = mockController()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('Log Controller Decorator', () => {
  test('Should call any controller implementation with correct values', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'another_password'
      }
    }
    await sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'another_password'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual({ ...request, statusCode: 200 })
  })

  test('Should call  LogErrorRepository if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const error = new Error('Internal Server Error')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(serverError(error)))
    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'another_password'
      }
    }
    await sut.handle(request)
    expect(logErrorSpy).toHaveBeenCalledWith(error.stack)
  })
})
