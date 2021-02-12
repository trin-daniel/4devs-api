import { SurveyDTO } from '../../../../../domain/dtos'
import { AddSurveyRepository, LoadSurveysRepository } from '../../../../../data/contracts'
import { MongoHelper } from '../../helper/mongo-helper'
import { Surveys } from '../../../../../domain/entities'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (data: SurveyDTO): Promise<void> {
    const collection = await MongoHelper.collection('surveys')
    await collection.insertOne(data)
  }

  async loadAll (): Promise<Surveys[]> {
    const collection = await MongoHelper.collection('surveys')
    const surveys = await collection.find().toArray() as Surveys[]
    return surveys
  }
}
