import { InvalidParamError } from '@Presentation/Errors'
import { EmailFieldValidation } from '@Validation/Components/Email-Field-Validation'

type SutTypes = {Sut: EmailFieldValidation}

const makeSut = (): SutTypes => {
  const Sut = new EmailFieldValidation('email')
  return { Sut }
}

const Data = () =>
  ({
    email: 'any_email@gmail.com'
  })

describe('Email Field Validation', () => {
  test('Should return an InvalidParamError if invalid e-mail address are provided', () => {
    const { Sut } = makeSut()
    const Error = Sut.Validate({ email: 'wrong_' })
    expect(Error).toEqual(new InvalidParamError('email'))
  })

  test('Should return null if valid e-mail address are provided', () => {
    const { Sut } = makeSut()
    const Input = Data()
    const Error = Sut.Validate(Input)
    expect(Error).toBeNull()
  })
})
