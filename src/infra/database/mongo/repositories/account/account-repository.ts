import { AddAccountRepository } from '../../../../../data/contracts'
import { Account } from '../../../../../domain/entities'
import { AccountDTO } from '../../../../../domain/data-transfer-objects'
import { MongoHelper } from '../../helper/mongo-helper'

export class AccountRepository implements AddAccountRepository {
  public async add (data: AccountDTO): Promise<Account> {
    const collection = MongoHelper.collection('accounts')
    const { ops } = await collection.insertOne(data)
    const [res] = ops
    return MongoHelper.mapper<Account>(res)
  }
}
