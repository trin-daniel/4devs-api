import { AddAccountService } from './add-account-service'
import { Hasher } from '../../../contracts'

const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hash')
    }
  }
  return new HasherStub()
}

interface SutTypes {
  sut: AddAccountService,
  hasherStub: Hasher
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const sut = new AddAccountService(hasherStub)
  return { sut, hasherStub }
}

describe('Add Account Service', () => {
  test('Should call Hasher with correct value', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const data =
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    }
    await sut.add(data)
    expect(hashSpy).toHaveBeenCalledWith(data.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const data =
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    }
    const promise = sut.add(data)
    await expect(promise).rejects.toThrow()
  })
})
