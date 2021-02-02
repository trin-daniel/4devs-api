import { AddAccountRepository, LoadAccountByEmailRepository, UpdateTokenRepository } from '../../../../../data/contracts'
import { Account } from '../../../../../domain/entities'
import { AccountDTO } from '../../../../../domain/data-transfer-objects'
import { MongoHelper } from '../../helper/mongo-helper'

export class AccountRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateTokenRepository {
  public async add (data: AccountDTO): Promise<Account> {
    const collection = await MongoHelper.collection('accounts')
    const { ops } = await collection.insertOne(data)
    const [res] = ops
    return MongoHelper.mapper<Account>(res)
  }

  public async loadByEmail (email: string): Promise<Account> {
    const collection = await MongoHelper.collection('accounts')
    const account = await collection.findOne({ email })
    return account && MongoHelper.mapper<Account>(account)
  }

  public async updateToken (id: string, token: string): Promise<void> {
    const collection = await MongoHelper.collection('accounts')
    await collection.updateOne(
      { _id: id },
      { $set: { token } }
    )
    Promise.resolve()
  }
}
