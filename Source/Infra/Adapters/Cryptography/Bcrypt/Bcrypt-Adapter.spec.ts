import { BcryptAdapter } from '@Infra/Adapters/Cryptography/Bcrypt/Bcrypt-Adapter'
import Bcrypt from 'bcrypt'

type SutTypes = {Sut: BcryptAdapter, Salt: number}

const makeSut = (): SutTypes => {
  const Salt = 12
  const Sut = new BcryptAdapter(Salt)
  return { Sut, Salt }
}

jest.mock('bcrypt', () => ({
  async hash (value: string): Promise<string> {
    return Promise.resolve('hash')
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

describe('Bcrypt Adapter', () => {
  describe('#Hasher', () => {
    test('Should call the hash method of the bcrypt library with the correct values', async () => {
      const { Sut, Salt } = makeSut()
      const HashSpy = jest.spyOn(Bcrypt, 'hash')
      await Sut.Hash('any_value')
      expect(HashSpy).toHaveBeenCalledWith('any_value', Salt)
    })

    test('Should return a hash on success', async () => {
      const { Sut } = makeSut()
      const HashText = await Sut.Hash('any_value')
      expect(HashText).toBe('hash')
    })

    test('Should throw if hash method of the bcrypt library throws', async () => {
      const { Sut } = makeSut()
      jest.spyOn(Bcrypt, 'hash').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Hash('any_value')
      await expect(PromiseRejected).rejects.toThrow()
    })
  })

  describe('#HashCompare', () => {
    test('Should call the bcrypt library compare method with the correct values', async () => {
      const { Sut } = makeSut()
      const CompareSpy = jest.spyOn(Bcrypt, 'compare')
      await Sut.Compare('any_password', 'any_hash')
      expect(CompareSpy).toHaveBeenCalledWith('any_password', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const { Sut } = makeSut()
      const IsValid = await Sut.Compare('any_password', 'any_hash')
      expect(IsValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const { Sut } = makeSut()
      jest.spyOn(Bcrypt, 'compare').mockResolvedValueOnce(false)
      const IsValid = await Sut.Compare('any_password', 'any_hash')
      expect(IsValid).toBe(false)
    })

    test('Should throw if compare method throws', async () => {
      const { Sut } = makeSut()
      jest.spyOn(Bcrypt, 'compare').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Compare('any_password', 'any_hash')
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
