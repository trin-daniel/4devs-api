import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail: (): boolean => {
    return true
  }
}))

interface SutTypes {
  sut: EmailValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter()
  return { sut }
}

describe('Email Validator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const { sut } = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isEmail = sut.isEmail('invalid_email@gmail.com')
    expect(isEmail).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const { sut } = makeSut()
    const isEmail = sut.isEmail('any_email@gmail.com')
    expect(isEmail).toBe(true)
  })

  test('Should call validator with correct e-mail address', () => {
    const { sut } = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isEmail('any_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
