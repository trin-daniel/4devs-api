import { InvalidParamError } from '@Presentation/Errors'
import { CompareFieldsValidation } from '@Validation/Components/Compare-Fields-Validation'
import Faker from 'faker'

interface SutTypes {Sut: CompareFieldsValidation}

const MakeSut = (): SutTypes => {
  const Sut = new CompareFieldsValidation('password', 'confirmation')
  return { Sut }
}
const PASSWORD_FREZEED = Faker.internet.password()
const AccountDTO = () =>
  ({
    name: Faker.internet.userName(),
    email: Faker.internet.email(),
    password: PASSWORD_FREZEED,
    confirmation: PASSWORD_FREZEED
  })

describe('Compare Fields Validation', () => {
  test('Should return an InvalidParamError if comparison fails', () => {
    const { Sut } = MakeSut()
    const ObjectBase = AccountDTO()
    const Input = Object.assign({}, ObjectBase, ObjectBase.confirmation = 'wrong_confimration')
    const Error = Sut.Validate(Input)
    expect(Error).toEqual(new InvalidParamError('confirmation'))
  })

  test('Should return null if fields comparison succeeds', () => {
    const { Sut } = MakeSut()
    const Input = AccountDTO()
    const Error = Sut.Validate(Input)
    expect(Error).toBeNull()
  })
})
