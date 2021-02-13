import { InvalidParamError } from '@presentation/errors'
import { EmailValidator } from '@validation/contracts/email-validator'
import { EmailFieldValidator } from '@validation/validators/email-field-validator'

type SutTypes = {
  sut: EmailFieldValidator,
  emailValidatorStub: EmailValidator
}

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isEmail (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailFieldValidator('email', emailValidatorStub)
  return { sut, emailValidatorStub }
}

const data = () =>
  ({
    email: 'any_email@gmail.com'
  })

describe('Email field Validator', () => {
  test('Should return an InvalidParamError if invalid e-mail address are provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)
    const input = data()
    const error = sut.validate(input)
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should return null if valid e-mail address are provided', () => {
    const { sut } = makeSut()
    const input = data()
    const error = sut.validate(input)
    expect(error).toBeNull()
  })
})
