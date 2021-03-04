import { InvalidParamError } from '@Presentation/Errors'
import { EmailFieldValidation } from '@Validation/Components/Email-Field-Validation'
import Faker from 'faker'

type SutTypes = {Sut: EmailFieldValidation}

const makeSut = (): SutTypes => {
  const Sut = new EmailFieldValidation('email')
  return { Sut }
}

const Email = () => ({ email: Faker.internet.email() })

describe('Email Field Validation', () => {
  test('Should return an InvalidParamError if invalid e-mail address are provided', () => {
    const { Sut } = makeSut()
    const Error = Sut.Validate({ email: 'wrong_' })
    expect(Error).toEqual(new InvalidParamError('email'))
  })

  test('Should return null if valid e-mail address are provided', () => {
    const { Sut } = makeSut()
    const Input = Email()
    const Error = Sut.Validate(Input)
    expect(Error).toBeNull()
  })
})
