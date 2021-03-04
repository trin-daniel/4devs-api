import { Request } from '@Presentation/Protocols'
import { AuthMiddleware } from '@Presentation/Middlewares/Auth-Middleware'
import { AccessDeniedError } from '@Presentation/Errors'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { LoadAccountByTokenUseCase } from '@Application/Use-Cases/Account/Load-Account-By-Token-Use-Case'
import { AccountViewModel } from '@Presentation/View-Models'
import Faker from 'faker'

interface SutTypes {
  Sut: AuthMiddleware,
  LoadAccountByTokenUseCaseStub: LoadAccountByTokenUseCase
}

const MockRequest = (): Request =>
  (
    {
      headers:
        {
          'x-access-token': Faker.random.uuid()
        }
    }
  )

const MOCK_REQUEST_INSTANCE = MockRequest()

const MockAccount = (): AccountViewModel =>
  (
    {
      id: MOCK_REQUEST_INSTANCE.headers['x-access-token'],
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: Faker.internet.password()
    }
  )
const MOCK_ACCOUNT_INSTANCE = MockAccount()

const MockLoadAccountByToken = (): LoadAccountByTokenUseCase => {
  class LoadAccountByTokenUseCaseStub implements LoadAccountByTokenUseCase {
    async Load (token: string, role?: string): Promise<AccountViewModel> {
      return Promise.resolve(MOCK_ACCOUNT_INSTANCE)
    }
  }
  return new LoadAccountByTokenUseCaseStub()
}

const MakeSut = (role?: string): SutTypes => {
  const LoadAccountByTokenUseCaseStub = MockLoadAccountByToken()
  const Sut = new AuthMiddleware(LoadAccountByTokenUseCaseStub, role)
  return { Sut, LoadAccountByTokenUseCaseStub }
}

describe('Auth Middleware', () => {
  describe('#LoadAccountByTokenUseCase', () => {
    test('Should call LoadAccountByTokenUseCase with the correct values', async () => {
      const Role = 'admin'
      const { Sut, LoadAccountByTokenUseCaseStub } = MakeSut(Role)
      const LoadSpy = jest.spyOn(LoadAccountByTokenUseCaseStub, 'Load')
      const Request = MOCK_REQUEST_INSTANCE
      await Sut.handle(Request)
      expect(LoadSpy).toHaveBeenCalledWith(MOCK_REQUEST_INSTANCE.headers['x-access-token'], Role)
    })

    test('Should return 403 if no x-access-token property exists in headers', async () => {
      const { Sut } = MakeSut()
      const Request = MockRequest()
      const ExpectedData = Object.assign({}, Request.headers, delete Request.headers['x-access-token'])
      const Response = await Sut.handle(ExpectedData)
      expect(Response).toEqual(Forbidden(new AccessDeniedError()))
    })

    test('Should return 403 if LoadAccountByTokenUseCase returns null', async () => {
      const { Sut, LoadAccountByTokenUseCaseStub } = MakeSut()
      jest.spyOn(LoadAccountByTokenUseCaseStub, 'Load').mockResolvedValueOnce(null)
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Forbidden(new AccessDeniedError()))
    })

    test('Should return 200 if LoadAccountByTokenUseCase returns an account', async () => {
      const { Sut } = MakeSut()
      const response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(response).toEqual(Ok({ account_id: MOCK_ACCOUNT_INSTANCE.id }))
    })

    test('Should return 500 if LoadAccountByTokenUseCase throws exception', async () => {
      const { Sut, LoadAccountByTokenUseCaseStub } = MakeSut()
      jest.spyOn(LoadAccountByTokenUseCaseStub, 'Load').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })
})
