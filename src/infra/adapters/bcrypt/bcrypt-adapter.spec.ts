import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

interface SutTypes {
  sut: BcryptAdapter,
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return { sut, salt }
}

describe('Bcrypt Adapter', () => {
  test('Should call the hash method of the bcrypt library with the correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
