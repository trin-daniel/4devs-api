import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateTokenRepository } from '@Data/Protocols/Database'
import { Account } from '@Application/Entities'
import { AccountDTO } from '@Application/DTOS'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'

export class AccountMongoRepository implements
AddAccountRepository,
LoadAccountByEmailRepository,
UpdateTokenRepository,
LoadAccountByTokenRepository {
  public async Add (data: AccountDTO): Promise<Account> {
    const Collection = await MongoHelper.collection('accounts')
    const { ops } = await Collection.insertOne(data)
    const [res] = ops
    return MongoHelper.mapper<Account>(res)
  }

  public async LoadByEmail (email: string): Promise<Account> {
    const Collection = await MongoHelper.collection('accounts')
    const Account = await Collection.findOne({ email })
    return Account && MongoHelper.mapper<Account>(Account)
  }

  public async LoadByToken (token: string, role?: string): Promise<Account> {
    const Collection = await MongoHelper.collection('accounts')
    const Account = await Collection.findOne({ token, $or: [{ role }, { role: 'admin' }] })
    return Account && MongoHelper.mapper<Account>(Account)
  }

  public async UpdateToken (id: string, token: string): Promise<void> {
    const Collection = await MongoHelper.collection('accounts')
    await Collection.updateOne(
      { _id: id },
      { $set: { token } }
    )
  }
}
