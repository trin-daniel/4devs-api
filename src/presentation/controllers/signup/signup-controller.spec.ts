import { SignupController } from './signup-controller'
import { Account } from '../../../domain/entities'
import { AddAccount } from '../../../domain/use-cases/add-account'
import { AccountDTO } from '../../../domain/data-transfer-objects'
import { EmailValidator } from '../../contracts/email-validator'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { Request } from '../../contracts'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Validator } from '../../contracts/validator'

interface SutTypes {
  sut: SignupController,
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount,
  validatorStub: Validator
}

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isEmail (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const mockRequest = (): Request => ({
  body:
  {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    confirmation: 'any_password'
  }
})

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

const mockValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const addAccountStub = mockAddAccount()
  const emailValidatorStub = mockEmailValidator()
  const sut = new SignupController(emailValidatorStub, addAccountStub, validatorStub)
  return { sut, emailValidatorStub, addAccountStub, validatorStub }
}

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const data = mockRequest()
    const request = Object.assign({}, delete data.body.name, { body: { ...data.body } })
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const data = mockRequest()
    const request = Object.assign({}, delete data.body.email, { body: { ...data.body } })
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const data = mockRequest()
    const request = Object.assign({}, delete data.body.password, { body: { ...data.body } })
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const data = mockRequest()
    const request = Object.assign({}, delete data.body.confirmation, { body: { ...data.body } })
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('confirmation')))
  })

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const data = mockRequest()
    const request = Object.assign({}, { body: { ...data.body, confirmation: 'another_password' } })
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new InvalidParamError('confirmation')))
  })

  test('Should call EmailValidator with correct e-mail address', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isEmailSpy = jest.spyOn(emailValidatorStub, 'isEmail')
    const request = mockRequest()
    await sut.handle(request)
    expect(isEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  test('Should return 400 if an invalid e-mail address is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)
    const data = mockRequest()
    const request = Object.assign({}, { body: { ...data.body, email: 'invalid_email@gmail.com' } })
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockImplementationOnce(() => { throw new Error() })
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new ServerError()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request = mockRequest()
    await sut.handle(request)
    const data = Object.assign({}, request.body, delete request.body.confirmation)
    expect(addSpy).toHaveBeenCalledWith(data)
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => Promise.reject(new Error()))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    const result = Object.assign({}, request.body,
      {
        id: '507f1f77bcf86cd799439011',
        password: 'hash'
      },
      delete request.body.confirmation
    )
    expect(response).toEqual(ok(result))
  })

  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
