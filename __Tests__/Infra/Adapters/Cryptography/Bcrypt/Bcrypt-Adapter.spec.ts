import { BcryptAdapter } from '@Infra/Adapters/Cryptography/Bcrypt/Bcrypt-Adapter'
import Bcrypt from 'bcrypt'
import Faker from 'faker'

interface SutTypes {
  Sut: BcryptAdapter,
  Salt: number
}

const MOCKED_VALUE = Faker.random.uuid()
const EXPECTED_HASH = Faker.random.uuid()

const MakeSut = (): SutTypes => {
  const Salt = 12
  const Sut = new BcryptAdapter(Salt)
  return { Sut, Salt }
}

jest.mock('bcrypt', () => ({
  async hash (value: string): Promise<string> {
    return Promise.resolve(EXPECTED_HASH)
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

describe('Bcrypt Adapter', () => {
  describe('#Hasher', () => {
    test('Should call the hash method of the bcrypt library with the correct values', async () => {
      const { Sut, Salt } = MakeSut()
      const HashSpy = jest.spyOn(Bcrypt, 'hash')
      await Sut.Hash(MOCKED_VALUE)
      expect(HashSpy).toHaveBeenCalledWith(MOCKED_VALUE, Salt)
    })

    test('Should return a hash on success', async () => {
      const { Sut } = MakeSut()
      const HashText = await Sut.Hash(MOCKED_VALUE)
      expect(HashText).toBe(EXPECTED_HASH)
    })

    test('Should throw if hash method of the bcrypt library throws', async () => {
      const { Sut } = MakeSut()
      jest.spyOn(Bcrypt, 'hash').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Hash(MOCKED_VALUE)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })

  describe('#HashCompare', () => {
    test('Should call the bcrypt library compare method with the correct values', async () => {
      const { Sut } = MakeSut()
      const CompareSpy = jest.spyOn(Bcrypt, 'compare')
      await Sut.Compare(MOCKED_VALUE, EXPECTED_HASH)
      expect(CompareSpy).toHaveBeenCalledWith(MOCKED_VALUE, EXPECTED_HASH)
    })

    test('Should return true when compare succeeds', async () => {
      const { Sut } = MakeSut()
      const IsValid = await Sut.Compare(MOCKED_VALUE, EXPECTED_HASH)
      expect(IsValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const { Sut } = MakeSut()
      jest.spyOn(Bcrypt, 'compare').mockResolvedValueOnce(false)
      const IsValid = await Sut.Compare(MOCKED_VALUE, EXPECTED_HASH)
      expect(IsValid).toBe(false)
    })

    test('Should throw if compare method throws', async () => {
      const { Sut } = MakeSut()
      jest.spyOn(Bcrypt, 'compare').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Compare(MOCKED_VALUE, EXPECTED_HASH)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
