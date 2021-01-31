import { AuthenticationService } from './authentication-service'
import { Account } from '../../../../domain/entities'
import { AuthenticationDTO } from '../../../../domain/data-transfer-objects'
import { LoadAccountByEmailRepository } from '../../../contracts'

interface SutTypes {
  sut: AuthenticationService,
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
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
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const sut = new AuthenticationService(loadAccountByEmailRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub }
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
})
