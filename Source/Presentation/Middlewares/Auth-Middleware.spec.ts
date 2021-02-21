import { Account } from '@Application/Entities'
import { Request } from '@Presentation/Protocols'
import { AuthMiddleware } from '@Presentation/Middlewares/Auth-Middleware'
import { AccessDeniedError } from '@Presentation/Errors'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { LoadAccountByTokenUseCase } from '@Application/Use-Cases/Account/Load-Account-By-Token-Use-Case'

type SutTypes = {Sut: AuthMiddleware, LoadAccountByTokenUseCaseStub: LoadAccountByTokenUseCase}

const MockRequest = (): Request => (
  {
    headers:
    {
      'x-access-token': 'any_token'
    }
  }
)

const MockAccount = (): Account => (
  {
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  }
)

const MockLoadAccountByToken = (): LoadAccountByTokenUseCase => {
  class LoadAccountByTokenUseCaseStub implements LoadAccountByTokenUseCase {
    async Load (token: string, role?: string): Promise<Account> {
      return Promise.resolve(MockAccount())
    }
  }
  return new LoadAccountByTokenUseCaseStub()
}

const makeSut = (role?: string): SutTypes => {
  const LoadAccountByTokenUseCaseStub = MockLoadAccountByToken()
  const Sut = new AuthMiddleware(LoadAccountByTokenUseCaseStub, role)
  return { Sut, LoadAccountByTokenUseCaseStub }
}

describe('Auth Middleware', () => {
  describe('#LoadAccountByTokenUseCase', () => {
    test('Should call LoadAccountByTokenUseCase with the correct values', async () => {
      const Role = 'admin'
      const { Sut, LoadAccountByTokenUseCaseStub } = makeSut(Role)
      const LoadSpy = jest.spyOn(LoadAccountByTokenUseCaseStub, 'Load')
      const Request = MockRequest()
      await Sut.handle(Request)
      expect(LoadSpy).toHaveBeenCalledWith(Request.headers['x-access-token'], Role)
    })

    test('Should return 403 if no x-access-token property exists in headers', async () => {
      const { Sut } = makeSut()
      const Request = MockRequest()
      const RequestWithoutToken = Object.assign({}, Request.headers, delete Request.headers['x-access-token'])
      const Response = await Sut.handle(RequestWithoutToken)
      expect(Response).toEqual(Forbidden(new AccessDeniedError()))
    })

    test('Should return 403 if LoadAccountByTokenUseCase returns null', async () => {
      const { Sut, LoadAccountByTokenUseCaseStub } = makeSut()
      jest.spyOn(LoadAccountByTokenUseCaseStub, 'Load').mockResolvedValueOnce(null)
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Forbidden(new AccessDeniedError()))
    })

    test('Should return 200 if LoadAccountByTokenUseCase returns an account', async () => {
      const { Sut } = makeSut()
      const response = await Sut.handle(MockRequest())
      expect(response).toEqual(Ok({ account_id: '507f1f77bcf86cd799439011' }))
    })

    test('Should return 500 if LoadAccountByTokenUseCase throws exception', async () => {
      const { Sut, LoadAccountByTokenUseCaseStub } = makeSut()
      jest.spyOn(LoadAccountByTokenUseCaseStub, 'Load').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })
})
