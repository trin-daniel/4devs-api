import { AuthenticationService } from './authentication-service'
import { Account } from '../../../../domain/entities'
import { AuthenticationDTO } from '../../../../domain/data-transfer-objects'
import { HashCompare, LoadAccountByEmailRepository } from '../../../contracts'

interface SutTypes {
  sut: AuthenticationService,
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  hashCompareStub: HashCompare
}

const mockHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (password: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashCompareStub()
}

const mockCredentials = (): AuthenticationDTO =>
  ({
    email: 'any_email@gmail.com',
    password: 'any_password'
  })

const mockAccount = (): Account =>
  ({
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  })

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async loadByEmail (data: string): Promise<Account> {
      return Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hashCompareStub = mockHashCompare()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const sut = new AuthenticationService(loadAccountByEmailRepositoryStub, hashCompareStub)
  return { sut, loadAccountByEmailRepositoryStub, hashCompareStub }
}

describe('Authentication Service', () => {
  test('Should call LoadAccountByEmailRepository with correct e-mail address', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const data = mockCredentials()
    await sut.auth(data)
    expect(loadByEmailSpy).toHaveBeenCalledWith(data.email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const data = mockCredentials()
    const promise = sut.auth(data)
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const data = mockCredentials()
    const token = await sut.auth(data)
    expect(token).toBeNull()
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    const data = mockCredentials()
    await sut.auth(data)
    expect(compareSpy).toHaveBeenCalledWith(data.password, 'hash')
  })

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const data = mockCredentials()
    const promise = sut.auth(data)
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const data = mockCredentials()
    const token = await sut.auth(data)
    expect(token).toBeNull()
  })
})
