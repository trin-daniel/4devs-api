import { AddAccountRepository, LoadAccountByEmailRepository } from '../../../../../data/contracts'
import { Account } from '../../../../../domain/entities'
import { AccountDTO } from '../../../../../domain/data-transfer-objects'
import { MongoHelper } from '../../helper/mongo-helper'

export class AccountRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  public async add (data: AccountDTO): Promise<Account> {
    const collection = await MongoHelper.collection('accounts')
    const { ops } = await collection.insertOne(data)
    const [res] = ops
    return MongoHelper.mapper<Account>(res)
  }

  async loadByEmail (email: string): Promise<Account> {
    const collection = await MongoHelper.collection('accounts')
    const account = await collection.findOne({ email })
    return account && MongoHelper.mapper<Account>(account)
  }
}
