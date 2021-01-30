import { ValidatorComposite } from './validator-composite'
import { Validator } from '../../presentation/contracts/validator'
import { InvalidParamError, MissingParamError } from '../../presentation/errors'

interface SutTypes {
  sut: ValidatorComposite,
  validatorsStub: Validator[]
}

const data = () =>
  ({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmation: 'any_password'
  })

const mockValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validatorsStub = [mockValidator(), mockValidator()]
  const sut = new ValidatorComposite(validatorsStub)
  return { sut, validatorsStub }
}

describe('Validator Composite', () => {
  test('Should return the first error if more then one validators fails', () => {
    const { sut, validatorsStub } = makeSut()
    jest.spyOn(validatorsStub[0], 'validate').mockReturnValueOnce(new MissingParamError('name'))
    jest.spyOn(validatorsStub[1], 'validate').mockReturnValueOnce(new InvalidParamError('email'))
    const error = sut.validate(data)
    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should return null if all validators succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate(data)
    expect(error).toBeNull()
  })
})
