import { Account } from '@Application/Entities'
import { AccountDTO } from '@Application/DTOS'
import { AddAccountService } from '@Data/Services/Account/Add-Account/Add-Account-Service'
import { Hasher } from '@Data/Protocols/Cryptography'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@Data/Protocols/Database/Account'
import Faker from 'faker'

const EXPECTED_HASH = Faker.random.uuid()
const MockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async Hash (value: string): Promise<string> {
      return Promise.resolve(EXPECTED_HASH)
    }
  }
  return new HasherStub()
}

const MockAccount = (): Account =>
  (
    {
      id: Faker.random.uuid(),
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: EXPECTED_HASH
    }
  )
const MOCK_ACCOUNT_INSTANCE = MockAccount()

const AccountWithoutId = (): Account => ({ ...MOCK_ACCOUNT_INSTANCE })
const MOCK_ACCOUNT_WITHOUT_ID = AccountWithoutId()

const MockAccountRepository = (): AddAccountRepository => {
  class AccountRepositoryStub implements AddAccountRepository {
    public Add (data: AccountDTO): Promise<Account> {
      return Promise.resolve(MOCK_ACCOUNT_INSTANCE)
    }
  }
  return new AccountRepositoryStub()
}

const MockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async LoadByEmail (data: string): Promise<Account> {
      return Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  Sut: AddAccountService,
  HasherStub: Hasher,
  AccountRepositoryStub: AddAccountRepository,
  LoadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const MakeSut = (): SutTypes => {
  const LoadAccountByEmailRepositoryStub = MockLoadAccountByEmailRepository()
  const AccountRepositoryStub = MockAccountRepository()
  const HasherStub = MockHasher()
  const Sut = new AddAccountService(
    HasherStub,
    AccountRepositoryStub,
    LoadAccountByEmailRepositoryStub
  )
  return {
    Sut,
    HasherStub,
    AccountRepositoryStub,
    LoadAccountByEmailRepositoryStub
  }
}

describe('Add Account Service', () => {
  describe('#LoadAccountByEmailRepository', () => {
    test('Should call LoadAccountByEmailRepository with correct e-mail address', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = MakeSut()
      const loadByEmailSpy = jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail')
      await Sut.Add(MOCK_ACCOUNT_WITHOUT_ID)
      expect(loadByEmailSpy).toHaveBeenCalledWith(MOCK_ACCOUNT_WITHOUT_ID.email)
    })

    test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = MakeSut()
      jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail').mockResolvedValue(MockAccount())
      const Account = await Sut.Add(MOCK_ACCOUNT_WITHOUT_ID)
      expect(Account).toBeNull()
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = MakeSut()
      jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail').mockRejectedValue(new Error())
      const RejectedPromise = Sut.Add(MOCK_ACCOUNT_WITHOUT_ID)
      await expect(RejectedPromise).rejects.toThrow()
    })
  })

  describe('#Hasher', () => {
    test('Should call Hasher with correct value', async () => {
      const { Sut, HasherStub } = MakeSut()
      const HashSpy = jest.spyOn(HasherStub, 'Hash')
      await Sut.Add(MOCK_ACCOUNT_WITHOUT_ID)
      expect(HashSpy).toHaveBeenCalledWith(MOCK_ACCOUNT_WITHOUT_ID.password)
    })

    test('Should throw if Hasher throws', async () => {
      const { Sut, HasherStub } = MakeSut()
      jest.spyOn(HasherStub, 'Hash').mockRejectedValue(new Error())
      const PromiseRejected = Sut.Add(MOCK_ACCOUNT_WITHOUT_ID)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })

  describe('#AddAccountRepository', () => {
    test('Should call method add of AccountRepository with correct values', async () => {
      const { Sut, AccountRepositoryStub } = MakeSut()
      const AddSpy = jest.spyOn(AccountRepositoryStub, 'Add')
      const Account = AccountWithoutId()
      await Sut.Add(Account)
      expect(AddSpy).toHaveBeenCalledWith(Account)
    })

    test('Should throw if AccountRepository throws', async () => {
      const { Sut, AccountRepositoryStub } = MakeSut()
      jest.spyOn(AccountRepositoryStub, 'Add').mockReturnValueOnce(Promise.reject(new Error()))
      const PromiseRejected = Sut.Add(MOCK_ACCOUNT_WITHOUT_ID)
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should return an account on success', async () => {
      const { Sut } = MakeSut()
      const Account = await Sut.Add(MOCK_ACCOUNT_WITHOUT_ID)
      expect(Account).toEqual(MOCK_ACCOUNT_INSTANCE)
    })
  })
})
