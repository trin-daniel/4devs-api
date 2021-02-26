import { LogErrorRepository } from '@Data/Protocols/Database/Log'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'

export class LogMongoRepository implements LogErrorRepository {
  async LogError (error: string): Promise<void> {
    const CurrentDate = new Date()
    const Collection = await MongoHelper.collection('error')
    await Collection.insertOne(
      {
        error,
        date: Intl.DateTimeFormat('pt-br').format(CurrentDate),
        hours: CurrentDate.toLocaleTimeString('pt-br')
      }
    )
  }
}
