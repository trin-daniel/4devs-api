import { SigninController } from './signin-controller'
import { Authentication } from '../../../domain/use-cases/authentication'
import { AuthenticationDTO } from '../../../domain/data-transfer-objects'
import { Request } from '../../contracts'
import { EmailValidator } from '../../contracts/email-validator'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Validator } from '../../contracts/validator'

interface SutTypes {
  sut: SigninController,
  emailValidatorStub: EmailValidator,
  authenticationStub: Authentication,
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
    email: 'any_email@gmail.com',
    password: 'any_password'
  }
})

const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (data: AuthenticationDTO): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
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
  const authenticationStub = mockAuthentication()
  const emailValidatorStub = mockEmailValidator()
  const sut = new SigninController(emailValidatorStub, authenticationStub, validatorStub)
  return { sut, emailValidatorStub, authenticationStub, validatorStub }
}

describe('Signin Controller', () => {
  test('Should return 400 if no email address is provided', async () => {
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

  test('Should return 500 if EmailValidator throws exception', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockImplementationOnce(() => { throw new ServerError() })
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new ServerError()))
  })

  test('Should call Authentication with correct credentials', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = mockRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok({ token: 'any_token' }))
  })

  test('Should return 500 if Authentication throws exception', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new ServerError()))
  })

  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new Error()))
  })
})
