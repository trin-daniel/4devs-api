import { SigninController } from './signin-controller'
import { EmailValidator } from '../../contracts/email-validator'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

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

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new SigninController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Signin Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        password: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        email: 'any_email@gmail.com'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isEmailSpy = jest.spyOn(emailValidatorStub, 'isEmail')
    const request =
    {
      body:
      {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    await sut.handle(request)
    expect(isEmailSpy).toHaveBeenCalledWith(request.body.email)
  })
})
