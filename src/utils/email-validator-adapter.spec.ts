import { EmailValidatorAdapter } from './email-validator-adapter'

describe('Email Validator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isEmail = sut.isEmail('invalid_email@gmail.com')
    expect(isEmail).toBe(false)
  })
})
