import { Account } from '@Application/Entities'
import { AccountDTO, AuthenticationDTO } from '@Application/DTOS'
import { SignUpController } from '@Presentation/Controllers/Account/Sign-Up/Sign-Up-Controller'
import { EmailInUseError, ServerError } from '@Presentation/Errors'
import { Request, Validation } from '@Presentation/Protocols'
import { BadRequest, Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { AddAccountUseCase } from '@Application/Use-Cases/Account/Add-Account-Use-Case'
import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'

type SutTypes = {Sut: SignUpController, AddAccountUseCaseStub: AddAccountUseCase, ValidationComponentStub: Validation, AuthenticationUseCaseStub: AuthenticationUseCase}

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
const MockAddAccountUseCase = (): AddAccountUseCase => {
  class AddAccountUseCaseStub implements AddAccountUseCase {
    public async Add (data: AccountDTO): Promise<Account> {
      return Promise.resolve(MockAccount())
    }
  }
  return new AddAccountUseCaseStub()
}

const MockValidation = (): Validation => {
  class ValidationComponentStub implements Validation {
    Validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidationComponentStub()
}

const MockAuthenticationUseCase = (): AuthenticationUseCase => {
  class AuthenticationUseCaseStub implements AuthenticationUseCase {
    async Auth (data: AuthenticationDTO): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationUseCaseStub()
}

const makeSut = (): SutTypes => {
  const AuthenticationUseCaseStub = MockAuthenticationUseCase()
  const ValidationComponentStub = MockValidation()
  const AddAccountUseCaseStub = MockAddAccountUseCase()
  const Sut = new SignUpController(ValidationComponentStub, AddAccountUseCaseStub, AuthenticationUseCaseStub)
  return { Sut, ValidationComponentStub, AddAccountUseCaseStub, AuthenticationUseCaseStub }
}

describe('SignUp Controller', () => {
  describe('#Validation', () => {
    test('Should call Validation with correct value', async () => {
      const { Sut, ValidationComponentStub } = makeSut()
      const ValidateSpy = jest.spyOn(ValidationComponentStub, 'Validate')
      const { body } = MockRequest()
      await Sut.handle({ body })
      expect(ValidateSpy).toHaveBeenCalledWith(body)
    })

    test('Should return 400 if Validation returns an error', async () => {
      const { Sut, ValidationComponentStub } = makeSut()
      jest.spyOn(ValidationComponentStub, 'Validate').mockReturnValueOnce(new Error())
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(BadRequest(new Error()))
    })
  })

  describe('#AddAccountUseCase', () => {
    test('Should call AddAccountUseCase with correct values', async () => {
      const { Sut, AddAccountUseCaseStub } = makeSut()
      const AddSpy = jest.spyOn(AddAccountUseCaseStub, 'Add')
      const Request = MockRequest()
      await Sut.handle(Request)
      const Data = Object.assign({}, Request.body, delete Request.body.confirmation)
      expect(AddSpy).toHaveBeenCalledWith(Data)
    })

    test('Should return 403 if AddAccountUseCase returns null', async () => {
      const { Sut, AddAccountUseCaseStub } = makeSut()
      jest.spyOn(AddAccountUseCaseStub, 'Add').mockReturnValueOnce(Promise.resolve(null))
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Forbidden(new EmailInUseError()))
    })

    test('Should return 500 if AddAccountUseCase throws', async () => {
      const { Sut, AddAccountUseCaseStub } = makeSut()
      jest.spyOn(AddAccountUseCaseStub, 'Add').mockRejectedValueOnce(new Error())
      const request = MockRequest()
      const response = await Sut.handle(request)
      expect(response).toEqual(ServerErrorHelper(new Error()))
    })
  })

  describe('#AuthenticationUseCase', () => {
    test('Should call Authentication with correct credentials', async () => {
      const { Sut, AuthenticationUseCaseStub } = makeSut()
      const AuthSpy = jest.spyOn(AuthenticationUseCaseStub, 'Auth')
      const Request = MockRequest()
      const { body: { email, password } } = Request
      await Sut.handle(Request)
      expect(AuthSpy).toHaveBeenCalledWith({ email, password })
    })

    test('Should return 500 if Authentication throws exception', async () => {
      const { Sut, AuthenticationUseCaseStub } = makeSut()
      jest.spyOn(AuthenticationUseCaseStub, 'Auth').mockReturnValueOnce(Promise.reject(new Error()))
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })

    test('Should return 200 on success', async () => {
      const { Sut } = makeSut()
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Ok({ token: 'any_token' }))
    })
  })
})
