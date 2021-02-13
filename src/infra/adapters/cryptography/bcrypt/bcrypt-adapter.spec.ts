import { BcryptAdapter } from '@infra/adapters/cryptography/bcrypt/bcrypt-adapter'
import bcrypt from 'bcrypt'

type SutTypes = {
  sut: BcryptAdapter,
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return { sut, salt }
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
      const { sut, salt } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a hash on success', async () => {
      const { sut } = makeSut()
      const hashText = await sut.hash('any_value')
      expect(hashText).toBe('hash')
    })

    test('Should throw if hash method of the bcrypt library throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('#HashCompare', () => {
    test('Should call the bcrypt library compare method with the correct values', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_password', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const { sut } = makeSut()
      const isValid = await sut.compare('any_password', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))
      const isValid = await sut.compare('any_password', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Should throw if compare method throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.compare('any_password', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
