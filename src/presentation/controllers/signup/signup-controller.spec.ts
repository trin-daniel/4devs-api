import { SignupController } from './signup-controller'
import { Account } from '../../../domain/entities'
import { AddAccount } from '../../../domain/usecases/add-account'
import { AccountDTO } from '../../../domain/data-transfer-objects'
import { EmailValidator } from '../../contracts/email-validator'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'

interface SutTypes {
  sut: SignupController,
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isEmail (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    public async add (data: AccountDTO): Promise<Account> {
      const account =
       {
         id: '507f1f77bcf86cd799439011',
         name: 'any_name',
         email: 'any_email@gmail.com',
         password: 'hash'
       }
      return Promise.resolve(account)
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const emailValidatorStub = mockEmailValidator()
  const sut = new SignupController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
}

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        email: 'any_email@gmail.com.br',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        name: 'any_name',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        confirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('confirmation'))
  })

  test('Should return 400 if password confirmation fails', async () => {
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
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('confirmation'))
  })

  test('Should call EmailValidator with correct e-mail address', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isEmailSpy = jest.spyOn(emailValidatorStub, 'isEmail')
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'another_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    await sut.handle(request)
    expect(isEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  test('Should return 400 if an invalid e-mail address is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'invalid_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockImplementationOnce(() => { throw new Error() })
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    await sut.handle(request)
    const data = Object.assign({}, request.body, delete request.body.confirmation)
    expect(addSpy).toHaveBeenCalledWith(data)
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => Promise.reject(new Error()))
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      {
        id: '507f1f77bcf86cd799439011',
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      })
  })
})
