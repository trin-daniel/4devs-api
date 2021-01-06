import { SignupController } from './signup-controller'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../contracts'

interface SutTypes {
  sut: SignupController,
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    public isEmail (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignupController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
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
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
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
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
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
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
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
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('confirmation'))
  })

  test('Should call EmailValidator with correct e-mail address', () => {
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
    sut.handle(request)
    expect(isEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  test('Should return 400 if an invalid e-mail address is provided', () => {
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
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })
})
