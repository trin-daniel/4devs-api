import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateTokenRepository
} from '@data/contracts'
import { Account } from '@domain/entities'
import { AccountDTO } from '@domain/dtos'
import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'

export class AccountMongoRepository implements
AddAccountRepository,
LoadAccountByEmailRepository,
UpdateTokenRepository,
LoadAccountByTokenRepository {
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

  public async loadByToken (token: string, role?: string): Promise<Account> {
    const collection = await MongoHelper.collection('accounts')
    const account = await collection.findOne({ token, $or: [{ role }, { role: 'admin' }] })
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
