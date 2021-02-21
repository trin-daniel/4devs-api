import { MissingParamError } from '@Presentation/Errors'
import { RequiredFieldValidator } from '@Validation/Components/Required-Field-Validation'

type SutTypes = {Sut: RequiredFieldValidator}
const makeSut = (): SutTypes => {
  const Sut = new RequiredFieldValidator('name')
  return { Sut }
}

const Data = () =>
  ({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmation: 'any_password'
  })

describe('Required Field Validation', () => {
  test('Should return an MissingParamError if any field not provided', () => {
    const { Sut } = makeSut()
    const ObjectBase = Data()
    const Input = Object.assign({}, ObjectBase, delete ObjectBase.name)
    const Error = Sut.Validate(Input)
    expect(Error).toEqual(new MissingParamError('name'))
  })

  test('Should return null if all fields are provided', () => {
    const { Sut } = makeSut()
    const Input = Data()
    const Error = Sut.Validate(Input)
    expect(Error).toBeNull()
  })
})
