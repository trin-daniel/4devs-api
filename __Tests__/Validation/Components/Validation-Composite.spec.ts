import { ValidationComposite } from '@Validation/Components/Validation-Composite'
import { Validation } from '@Presentation/Protocols/Validation'
import { InvalidParamError, MissingParamError } from '@Presentation/Errors'

type SutTypes = {Sut: ValidationComposite, ValidationComponentStub: Validation[]}

const Data = () =>
  ({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmation: 'any_password'
  })

const MockValidation = (): Validation => {
  class ValidationComponentStub implements Validation {
    Validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidationComponentStub()
}

const makeSut = (): SutTypes => {
  const ValidationComponentStub = [MockValidation(), MockValidation()]
  const Sut = new ValidationComposite(ValidationComponentStub)
  return { Sut, ValidationComponentStub }
}

describe('Validator Composite', () => {
  test('Should return the first error if more then one validation fails', () => {
    const { Sut, ValidationComponentStub } = makeSut()
    jest.spyOn(ValidationComponentStub[0], 'Validate').mockReturnValueOnce(new MissingParamError('name'))
    jest.spyOn(ValidationComponentStub[1], 'Validate').mockReturnValueOnce(new InvalidParamError('email'))
    const Error = Sut.Validate(Data())
    expect(Error).toEqual(new MissingParamError('name'))
  })

  test('Should return null if all validators succeeds', () => {
    const { Sut } = makeSut()
    const Error = Sut.Validate(Data())
    expect(Error).toBeNull()
  })
})
