import { SurveyDTO } from '../../../../../domain/dtos'
import { AddSurveyRepository } from '../../../../../data/contracts'
import { MongoHelper } from '../../helper/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (data: SurveyDTO): Promise<void> {
    const collection = await MongoHelper.collection('surveys')
    await collection.insertOne(data)
  }
}
