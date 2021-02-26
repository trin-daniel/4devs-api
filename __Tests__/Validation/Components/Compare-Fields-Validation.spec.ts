import { InvalidParamError } from '@Presentation/Errors'
import { CompareFieldsValidation } from '@Validation/Components/Compare-Fields-Validation'

type SutTypes = {Sut: CompareFieldsValidation}

const makeSut = (): SutTypes => {
  const Sut = new CompareFieldsValidation('password', 'confirmation')
  return { Sut }
}

const Data = () =>
  ({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmation: 'any_password'
  })

describe('Compare Fields Validation', () => {
  test('Should return an InvalidParamError if comparison fails', () => {
    const { Sut } = makeSut()
    const ObjectBase = Data()
    const Input = Object.assign({}, ObjectBase, ObjectBase.confirmation = 'wrong_confimration')
    const Error = Sut.Validate(Input)
    expect(Error).toEqual(new InvalidParamError('confirmation'))
  })

  test('Should return null if fields comparison succeeds', () => {
    const { Sut } = makeSut()
    const Input = Data()
    const Error = Sut.Validate(Input)
    expect(Error).toBeNull()
  })
})
