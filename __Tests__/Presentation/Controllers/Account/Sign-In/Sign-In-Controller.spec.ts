import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { SignInController } from '@Presentation/Controllers/Account/Sign-In/Sign-In-Controller'
import { Request, Validation } from '@Presentation/Protocols'
import { ServerError } from '@Presentation/Errors'
import { BadRequest, Ok, ServerErrorHelper, Unauthorized } from '@Presentation/Helpers/Http-Helper'
import { AuthenticationDTO } from '@Presentation/DTOS'
import { AuthenticationViewModel } from '@Presentation/View-Models'
import Faker from 'faker'

interface SutTypes {
  Sut: SignInController,
  AuthenticationUseCaseStub: AuthenticationUseCase,
  ValidationStub: Validation
}

const MockRequest = (): Request =>
  ({
    body: {
      email: Faker.internet.email(),
      password: Faker.internet.password()
    }
  })

const Expected_Authentication = (): AuthenticationViewModel =>
  ({
    token: Faker.random.uuid(),
    name: Faker.internet.userName()
  })

const MOCK_REQUEST_INSTANCE = MockRequest()
const EXPECTED_AUTHENTICATION_INSTANCE = Expected_Authentication()

const MockAuthentication = (): AuthenticationUseCase => {
  class AuthenticationUseCaseStub implements AuthenticationUseCase {
    async Auth (data: AuthenticationDTO): Promise<AuthenticationViewModel> {
      return Promise.resolve(EXPECTED_AUTHENTICATION_INSTANCE)
    }
  }
  return new AuthenticationUseCaseStub()
}

const MockValidation = (): Validation => {
  class ValidationStub implements Validation {
    Validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidationStub()
}

const MakeSut = (): SutTypes => {
  const ValidationStub = MockValidation()
  const AuthenticationUseCaseStub = MockAuthentication()
  const Sut = new SignInController(ValidationStub, AuthenticationUseCaseStub)
  return { Sut, AuthenticationUseCaseStub, ValidationStub }
}

describe('SignIn Controller', () => {
  describe('#Validation', () => {
    test('Should call Validation with correct value', async () => {
      const { Sut, ValidationStub } = MakeSut()
      const validateSpy = jest.spyOn(ValidationStub, 'Validate')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(validateSpy).toHaveBeenCalledWith(MOCK_REQUEST_INSTANCE.body)
    })

    test('Should return 400 if Validation returns an error', async () => {
      const { Sut, ValidationStub } = MakeSut()
      jest.spyOn(ValidationStub, 'Validate').mockReturnValueOnce(new Error())
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(BadRequest(new Error()))
    })
  })

  describe('#Authentication-Use-Case', () => {
    test('Should call Authentication with correct credentials', async () => {
      const { Sut, AuthenticationUseCaseStub } = MakeSut()
      const AuthSpy = jest.spyOn(AuthenticationUseCaseStub, 'Auth')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(AuthSpy).toHaveBeenCalledWith(MOCK_REQUEST_INSTANCE.body)
    })

    test('Should return 401 if invalid credentials are provided', async () => {
      const { Sut, AuthenticationUseCaseStub } = MakeSut()
      jest.spyOn(AuthenticationUseCaseStub, 'Auth').mockReturnValueOnce(Promise.resolve(null))
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Unauthorized())
    })

    test('Should return 200 on success', async () => {
      const { Sut } = MakeSut()
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Ok(EXPECTED_AUTHENTICATION_INSTANCE))
    })

    test('Should return 500 if AuthenticationUseCase throws exception', async () => {
      const { Sut, AuthenticationUseCaseStub } = MakeSut()
      jest.spyOn(AuthenticationUseCaseStub, 'Auth').mockReturnValueOnce(Promise.reject(new Error()))
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(ServerErrorHelper(new ServerError()))
    })
  })
})
