import { LogControllerDecorator } from './log-controller-decorator'
import { Controller, Request, Response } from '../../../presentation/contracts'

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

interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const sut = new LogControllerDecorator(controllerStub)
  return { sut, controllerStub }
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
})
