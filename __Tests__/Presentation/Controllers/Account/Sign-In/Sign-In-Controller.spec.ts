import { SignInController } from '@Presentation/Controllers/Account/Sign-In/Sign-In-Controller'
import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { AuthenticationDTO } from '@Application/DTOS'
import { Request, Validation } from '@Presentation/Protocols'
import { ServerError } from '@Presentation/Errors'
import { BadRequest, Ok, ServerErrorHelper, Unauthorized } from '@Presentation/Helpers/Http-Helper'
import { Authentication } from '@Application/Entities'

type SutTypes = {Sut: SignInController, AuthenticationUseCaseStub: AuthenticationUseCase, ValidationComponentStub: Validation}

const MockRequest = (): Request => (
  {
    body: { email: 'any_email@gmail.com', password: 'any_password' }
  }
)

const MockAuthentication = (): AuthenticationUseCase => {
  class AuthenticationUseCaseStub implements AuthenticationUseCase {
    async Auth (data: AuthenticationDTO): Promise<Authentication> {
      return Promise.resolve({ token: 'any_token', name: 'any_name' })
    }
  }
  return new AuthenticationUseCaseStub()
}

const MockValidation = (): Validation => {
  class ValidationComponentStub implements Validation {
    Validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidationComponentStub()
}

const makeSut = (): SutTypes => {
  const ValidationComponentStub = MockValidation()
  const AuthenticationUseCaseStub = MockAuthentication()
  const Sut = new SignInController(ValidationComponentStub, AuthenticationUseCaseStub)
  return { Sut, AuthenticationUseCaseStub, ValidationComponentStub }
}

describe('SignIn Controller', () => {
  describe('#Validation', () => {
    test('Should call Validation with correct value', async () => {
      const { Sut, ValidationComponentStub } = makeSut()
      const validateSpy = jest.spyOn(ValidationComponentStub, 'Validate')
      const { body } = MockRequest()
      await Sut.handle({ body })
      expect(validateSpy).toHaveBeenCalledWith(body)
    })

    test('Should return 400 if Validation returns an error', async () => {
      const { Sut, ValidationComponentStub } = makeSut()
      jest.spyOn(ValidationComponentStub, 'Validate').mockReturnValueOnce(new Error())
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(BadRequest(new Error()))
    })
  })

  describe('#Authentication-UseCase', () => {
    test('Should call Authentication with correct credentials', async () => {
      const { Sut, AuthenticationUseCaseStub } = makeSut()
      const AuthSpy = jest.spyOn(AuthenticationUseCaseStub, 'Auth')
      const { body } = MockRequest()
      await Sut.handle({ body })
      expect(AuthSpy).toHaveBeenCalledWith(body)
    })

    test('Should return 401 if invalid credentials are provided', async () => {
      const { Sut, AuthenticationUseCaseStub } = makeSut()
      jest.spyOn(AuthenticationUseCaseStub, 'Auth').mockReturnValueOnce(Promise.resolve(null))
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Unauthorized())
    })

    test('Should return 200 on success', async () => {
      const { Sut } = makeSut()
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Ok({ token: 'any_token', name: 'any_name' }))
    })

    test('Should return 500 if AuthenticationUseCase throws exception', async () => {
      const { Sut, AuthenticationUseCaseStub } = makeSut()
      jest.spyOn(AuthenticationUseCaseStub, 'Auth').mockReturnValueOnce(Promise.reject(new Error()))
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new ServerError()))
    })
  })
})
