import { Account } from '@Application/Entities'
import { AccountDTO } from '@Application/DTOS'
import { AddAccountService } from '@Data/Services/Account/Add-Account/Add-Account-Service'
import { Hasher } from '@Data/Protocols/Cryptography'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@Data/Protocols/Database/Account'

const MockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async Hash (value: string): Promise<string> {
      return Promise.resolve('hash')
    }
  }
  return new HasherStub()
}

const MockAccount = (): Account => (
  {
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  }
)

const Data = (): Omit<Account, 'id'> => ({
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

const MockAccountRepository = (): AddAccountRepository => {
  class AccountRepositoryStub implements AddAccountRepository {
    public Add (data: AccountDTO): Promise<Account> {
      return Promise.resolve(MockAccount())
    }
  }
  return new AccountRepositoryStub()
}

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async LoadByEmail (data: string): Promise<Account> {
      return Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

type SutTypes = {Sut: AddAccountService, HasherStub: Hasher, AccountRepositoryStub: AddAccountRepository, LoadAccountByEmailRepositoryStub: LoadAccountByEmailRepository }

const makeSut = (): SutTypes => {
  const LoadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const AccountRepositoryStub = MockAccountRepository()
  const HasherStub = MockHasher()
  const Sut = new AddAccountService(HasherStub, AccountRepositoryStub, LoadAccountByEmailRepositoryStub)
  return { Sut, HasherStub, AccountRepositoryStub, LoadAccountByEmailRepositoryStub }
}

describe('Add Account Service', () => {
  describe('#LoadAccountByEmailRepository', () => {
    test('Should call LoadAccountByEmailRepository with correct e-mail address', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail')
      await Sut.Add(Data())
      expect(loadByEmailSpy).toHaveBeenCalledWith(Data().email)
    })

    test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = makeSut()
      jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail').mockResolvedValue(MockAccount())
      const Account = await Sut.Add(Data())
      expect(Account).toBeNull()
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = makeSut()
      jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail').mockRejectedValue(new Error())
      const RejectedPromise = Sut.Add(Data())
      await expect(RejectedPromise).rejects.toThrow()
    })
  })

  describe('#Hasher', () => {
    test('Should call Hasher with correct value', async () => {
      const { Sut, HasherStub } = makeSut()
      const HashSpy = jest.spyOn(HasherStub, 'Hash')
      await Sut.Add(Data())
      expect(HashSpy).toHaveBeenCalledWith(Data().password)
    })

    test('Should throw if Hasher throws', async () => {
      const { Sut, HasherStub } = makeSut()
      jest.spyOn(HasherStub, 'Hash').mockRejectedValue(new Error())
      const PromiseRejected = Sut.Add(Data())
      await expect(PromiseRejected).rejects.toThrow()
    })
  })

  describe('#AddAccountRepository', () => {
    test('Should call method add of AccountRepository with correct values', async () => {
      const { Sut, AccountRepositoryStub } = makeSut()
      const AddSpy = jest.spyOn(AccountRepositoryStub, 'Add')
      const Account = Data()
      await Sut.Add(Account)
      expect(AddSpy).toHaveBeenCalledWith(Object.assign({}, Account, { password: 'hash' }))
    })

    test('Should throw if AccountRepository throws', async () => {
      const { Sut, AccountRepositoryStub } = makeSut()
      jest.spyOn(AccountRepositoryStub, 'Add').mockReturnValueOnce(Promise.reject(new Error()))
      const PromiseRejected = Sut.Add(Data())
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should return an account on success', async () => {
      const { Sut } = makeSut()
      const Account = await Sut.Add(Data())
      expect(Account).toEqual(MockAccount())
    })
  })
})
