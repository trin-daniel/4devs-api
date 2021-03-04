import { AccountDTO } from '@Presentation/DTOS'
import { MissingParamError } from '@Presentation/Errors'
import { RequiredFieldValidator } from '@Validation/Components/Required-Field-Validation'
import Faker from 'faker'

interface SutTypes {Sut: RequiredFieldValidator}
const makeSut = (): SutTypes => {
  const Sut = new RequiredFieldValidator('name')
  return { Sut }
}
const PASSWORD_FREZEED = Faker.internet.password()
const MockAccountDTO = (): AccountDTO =>
  ({
    name: Faker.internet.userName(),
    email: Faker.internet.email(),
    password: PASSWORD_FREZEED,
    confirmation: PASSWORD_FREZEED
  })

describe('Required Field Validation', () => {
  test('Should return an MissingParamError if any field not provided', () => {
    const { Sut } = makeSut()
    const ObjectBase = MockAccountDTO()
    const Input = Object.assign({}, ObjectBase, delete ObjectBase.name)
    const Error = Sut.Validate(Input)
    expect(Error).toEqual(new MissingParamError('name'))
  })

  test('Should return null if all fields are provided', () => {
    const { Sut } = makeSut()
    const Input = MockAccountDTO()
    const Error = Sut.Validate(Input)
    expect(Error).toBeNull()
  })
})
