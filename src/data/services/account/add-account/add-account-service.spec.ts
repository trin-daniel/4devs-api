import { AddAccountService } from './add-account-service'
import { Account } from '../../../../domain/entities'
import { AccountDTO } from '../../../../domain/data-transfer-objects'
import { AddAccountRepository, Hasher } from '../../../contracts'

const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hash')
    }
  }
  return new HasherStub()
}

const mockAccountRepository = (): AddAccountRepository => {
  class AccountRepositoryStub implements AddAccountRepository {
    public add (data: AccountDTO): Promise<Account> {
      return Promise.resolve(
        {
          id: '507f1f77bcf86cd799439011',
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'hash'
        }
      )
    }
  }
  return new AccountRepositoryStub()
}

interface SutTypes {
  sut: AddAccountService,
  hasherStub: Hasher,
  accountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const accountRepositoryStub = mockAccountRepository()
  const hasherStub = mockHasher()
  const sut = new AddAccountService(hasherStub, accountRepositoryStub)
  return { sut, hasherStub, accountRepositoryStub }
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

  test('Should call method add of AccountRepository with correct values', async () => {
    const { sut, accountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(accountRepositoryStub, 'add')
    const data =
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    }
    await sut.add(data)
    expect(addSpy).toHaveBeenCalledWith(Object.assign({}, data, { password: 'hash' }))
  })

  test('Should throw if AccountRepository throws', async () => {
    const { sut, accountRepositoryStub } = makeSut()
    jest.spyOn(accountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const data =
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    }
    const promise = sut.add(data)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const data =
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    }
    const account = await sut.add(data)
    expect(account).toEqual(
      {
        id: '507f1f77bcf86cd799439011',
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
    )
  })
})
