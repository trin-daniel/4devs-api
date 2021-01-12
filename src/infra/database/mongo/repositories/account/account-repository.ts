import { AddAccountRepository } from '../../../../../data/contracts'
import { Account } from '../../../../../domain/entities'
import { AccountDTO } from '../../../../../domain/data-transfer-objects'
import { MongoHelper } from '../../helper/mongo-helper'

export class AccountRepository implements AddAccountRepository {
  public async add (data: AccountDTO): Promise<Account> {
    const collection = await MongoHelper.collection('accounts')
    const { ops } = await collection.insertOne(data)
    const [res] = ops
    const { _id, ...obj } = res
    const account = Object.assign({}, obj, { id: _id })
    return account
  }
}
