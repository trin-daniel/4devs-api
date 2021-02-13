import { MissingParamError } from '@presentation/errors'
import { RequiredFieldValidator } from '@validation/validators/required-field-validator'

interface SutTypes {
  sut: RequiredFieldValidator
}
const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidator('name')
  return { sut }
}

const data = () =>
  ({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmation: 'any_password'
  })

describe('Required Field Validator', () => {
  test('Should return an MissingParamError if any field not provided', () => {
    const { sut } = makeSut()
    const objectBase = data()
    const input = Object.assign({}, objectBase, delete objectBase.name)
    const error = sut.validate(input)
    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should return null if all fields are provided', () => {
    const { sut } = makeSut()
    const input = data()
    const error = sut.validate(input)
    expect(error).toBeNull()
  })
})
