import { AddAccountService } from './add-account-service'
import { Account } from '../../../../domain/entities'
import { AccountDTO } from '../../../../domain/data-transfer-objects'
import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '../../../contracts'

const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hash')
    }
  }
  return new HasherStub()
}

const mockAccount = (): Account => (
  {
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  }
)

const data = (): Omit<Account, 'id'> => ({
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

const mockAccountRepository = (): AddAccountRepository => {
  class AccountRepositoryStub implements AddAccountRepository {
    public add (data: AccountDTO): Promise<Account> {
      return Promise.resolve(mockAccount())
    }
  }
  return new AccountRepositoryStub()
}

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async loadByEmail (data: string): Promise<Account> {
      return Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: AddAccountService,
  hasherStub: Hasher,
  accountRepositoryStub: AddAccountRepository,
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const accountRepositoryStub = mockAccountRepository()
  const hasherStub = mockHasher()
  const sut = new AddAccountService(hasherStub, accountRepositoryStub, loadAccountByEmailRepositoryStub)
  return { sut, hasherStub, accountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('Add Account Service', () => {
  test('Should call LoadAccountByEmailRepository with correct e-mail address', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(data())
    expect(loadByEmailSpy).toHaveBeenCalledWith(data().email)
  })

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccount()))
    const account = await sut.add(data())
    expect(account).toBeNull()
  })

  test('Should call Hasher with correct value', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(data())
    expect(hashSpy).toHaveBeenCalledWith(data().password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(data())
    await expect(promise).rejects.toThrow()
  })

  test('Should call method add of AccountRepository with correct values', async () => {
    const { sut, accountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(accountRepositoryStub, 'add')
    const account = data()
    await sut.add(account)
    expect(addSpy).toHaveBeenCalledWith(Object.assign({}, account, { password: 'hash' }))
  })

  test('Should throw if AccountRepository throws', async () => {
    const { sut, accountRepositoryStub } = makeSut()
    jest.spyOn(accountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(data())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(data())
    expect(account).toEqual(mockAccount())
  })
})
