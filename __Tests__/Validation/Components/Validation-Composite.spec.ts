import { AccountDTO } from '@Presentation/DTOS'
import { Validation } from '@Presentation/Protocols/Validation'
import { InvalidParamError, MissingParamError } from '@Presentation/Errors'
import { ValidationComposite } from '@Validation/Components/Validation-Composite'
import Faker from 'faker'

interface SutTypes {
  Sut: ValidationComposite,
  ValidationStub: Validation[]
}

const PASSWORD_FREZEED = Faker.internet.password()
const MockAccountDTO = (): AccountDTO =>
  (
    {
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: PASSWORD_FREZEED,
      confirmation: PASSWORD_FREZEED
    }
  )
const MOCK_ACCOUNT_INSTANCE = MockAccountDTO()

const MockValidation = (): Validation => {
  class ValidationStub implements Validation {
    Validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidationStub()
}

const MakeSut = (): SutTypes => {
  const ValidationStub = [MockValidation(), MockValidation()]
  const Sut = new ValidationComposite(ValidationStub)
  return { Sut, ValidationStub }
}

describe('Validation Composite', () => {
  test('Should return the first error if more then one validation fails', () => {
    const { Sut, ValidationStub } = MakeSut()
    jest.spyOn(ValidationStub[0], 'Validate').mockReturnValueOnce(new MissingParamError('name'))
    jest.spyOn(ValidationStub[1], 'Validate').mockReturnValueOnce(new InvalidParamError('email'))
    const Error = Sut.Validate(MOCK_ACCOUNT_INSTANCE)
    expect(Error).toEqual(new MissingParamError('name'))
  })

  test('Should return null if all validators succeeds', () => {
    const { Sut } = MakeSut()
    const Error = Sut.Validate(MOCK_ACCOUNT_INSTANCE)
    expect(Error).toBeNull()
  })
})
