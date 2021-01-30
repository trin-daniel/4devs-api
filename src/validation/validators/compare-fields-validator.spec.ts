import { CompareFieldsValidator } from './compare-fields-validator'
import { InvalidParamError } from '../../presentation/errors'

interface SutTypes {
  sut: CompareFieldsValidator
}
const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidator('password', 'confirmation')
  return { sut }
}

const data = () =>
  ({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmation: 'any_password'
  })

describe('Compare Fields Validator', () => {
  test('Should return an InvalidParamError if comparison fails', () => {
    const { sut } = makeSut()
    const objectBase = data()
    const input = Object.assign({}, objectBase, objectBase.confirmation = 'wrong_confimration')
    const error = sut.validate(input)
    expect(error).toEqual(new InvalidParamError('confirmation'))
  })
})
