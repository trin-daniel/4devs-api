import { LogErrorRepository } from '../../../../../data/contracts'
import { MongoHelper } from '../../helper/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (error: string): Promise<void> {
    const currentDate = new Date()
    const collection = await MongoHelper.collection('error')
    await collection.insertOne(
      {
        error,
        date: Intl.DateTimeFormat('pt-br').format(currentDate),
        hours: currentDate.toLocaleTimeString('pt-br')
      }
    )
  }
}
