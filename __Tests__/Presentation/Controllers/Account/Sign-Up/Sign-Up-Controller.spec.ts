import { SignUpController } from '@Presentation/Controllers/Account/Sign-Up/Sign-Up-Controller'
import { EmailInUseError } from '@Presentation/Errors'
import { Request, Validation } from '@Presentation/Protocols'
import { BadRequest, Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { AddAccountUseCase } from '@Application/Use-Cases/Account/Add-Account-Use-Case'
import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { AccountViewModel, AuthenticationViewModel } from '@Presentation/View-Models'
import { AccountDTO, AuthenticationDTO } from '@Presentation/DTOS'
import Faker from 'faker'

interface SutTypes {
  Sut: SignUpController,
  AddAccountUseCaseStub: AddAccountUseCase,
  ValidationStub: Validation,
  AuthenticationUseCaseStub: AuthenticationUseCase
}

const PASSWORD_FREZEED = Faker.internet.password()
const MockRequest = (): Request<AccountDTO> =>
  (
    {
      body:
      {
        name: Faker.internet.userName(),
        email: Faker.internet.email(),
        password: PASSWORD_FREZEED,
        confirmation: PASSWORD_FREZEED
      }
    }
  )
const MOCK_REQUEST_INSTANCE = MockRequest()

const MockAccount = (): AccountViewModel =>
  (
    {
      id: Faker.random.uuid(),
      name: MOCK_REQUEST_INSTANCE.body.name,
      email: MOCK_REQUEST_INSTANCE.body.email,
      password: Faker.internet.password()
    }
  )
const EXPECTED_ACCOUNT = MockAccount()

const MockAddAccountUseCase = (): AddAccountUseCase => {
  class AddAccountUseCaseStub implements AddAccountUseCase {
    public async Add (data: AccountDTO): Promise<AccountViewModel> {
      return Promise.resolve(EXPECTED_ACCOUNT)
    }
  }
  return new AddAccountUseCaseStub()
}

const MockValidation = (): Validation => {
  class ValidationStub implements Validation {
    Validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidationStub()
}
const Expected_Authentication = (): AuthenticationViewModel =>
  (
    {
      token: Faker.random.uuid(),
      name: Faker.internet.userName()
    }
  )

const EXPECTED_AUTHENTICATION_INSTANCE = Expected_Authentication()

const MockAuthenticationUseCase = (): AuthenticationUseCase => {
  class AuthenticationUseCaseStub implements AuthenticationUseCase {
    async Auth (data: AuthenticationDTO): Promise<AuthenticationViewModel> {
      return Promise.resolve(EXPECTED_AUTHENTICATION_INSTANCE)
    }
  }
  return new AuthenticationUseCaseStub()
}

const MakeSut = (): SutTypes => {
  const AuthenticationUseCaseStub = MockAuthenticationUseCase()
  const ValidationStub = MockValidation()
  const AddAccountUseCaseStub = MockAddAccountUseCase()
  const Sut = new SignUpController(
    ValidationStub,
    AddAccountUseCaseStub,
    AuthenticationUseCaseStub
  )
  return {
    Sut,
    ValidationStub,
    AddAccountUseCaseStub,
    AuthenticationUseCaseStub
  }
}

describe('SignUp Controller', () => {
  describe('#Validation', () => {
    test('Should call Validation with correct value', async () => {
      const { Sut, ValidationStub } = MakeSut()
      const ValidateSpy = jest.spyOn(ValidationStub, 'Validate')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(ValidateSpy).toHaveBeenCalledWith(MOCK_REQUEST_INSTANCE.body)
    })

    test('Should return 400 if Validation returns an error', async () => {
      const { Sut, ValidationStub } = MakeSut()
      jest.spyOn(ValidationStub, 'Validate').mockReturnValueOnce(new Error())
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(BadRequest(new Error()))
    })
  })

  describe('#AddAccountUseCase', () => {
    test('Should call AddAccountUseCase with correct values', async () => {
      const { Sut, AddAccountUseCaseStub } = MakeSut()
      const AddSpy = jest.spyOn(AddAccountUseCaseStub, 'Add')
      const Request = MOCK_REQUEST_INSTANCE
      await Sut.handle(Request)
      const Data = Object.assign({}, Request.body, delete Request.body.confirmation)
      expect(AddSpy).toHaveBeenCalledWith(Data)
    })

    test('Should return 403 if AddAccountUseCase returns null', async () => {
      const { Sut, AddAccountUseCaseStub } = MakeSut()
      jest.spyOn(AddAccountUseCaseStub, 'Add').mockReturnValueOnce(Promise.resolve(null))
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Forbidden(new EmailInUseError()))
    })

    test('Should return 500 if AddAccountUseCase throws', async () => {
      const { Sut, AddAccountUseCaseStub } = MakeSut()
      jest.spyOn(AddAccountUseCaseStub, 'Add').mockRejectedValueOnce(new Error())
      const response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(response).toEqual(ServerErrorHelper(new Error()))
    })
  })

  describe('#AuthenticationUseCase', () => {
    test('Should call Authentication with correct credentials', async () => {
      const { Sut, AuthenticationUseCaseStub } = MakeSut()
      const AuthSpy = jest.spyOn(AuthenticationUseCaseStub, 'Auth')
      const Request = MOCK_REQUEST_INSTANCE
      const { body: { email, password } } = Request
      await Sut.handle(Request)
      expect(AuthSpy).toHaveBeenCalledWith({ email, password })
    })

    test('Should return 500 if Authentication throws exception', async () => {
      const { Sut, AuthenticationUseCaseStub } = MakeSut()
      jest.spyOn(AuthenticationUseCaseStub, 'Auth').mockReturnValueOnce(Promise.reject(new Error()))
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })

    test('Should return 200 on success', async () => {
      const { Sut } = MakeSut()
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Ok(EXPECTED_AUTHENTICATION_INSTANCE))
    })
  })
})
