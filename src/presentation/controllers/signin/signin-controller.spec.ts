import { SigninController } from './signin-controller'
import { EmailValidator } from '../../contracts/email-validator'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Request } from '../../contracts'

interface SutTypes {
  sut: SigninController,
  emailValidatorStub: EmailValidator
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

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new SigninController(emailValidatorStub)
  return { sut, emailValidatorStub }
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
})
