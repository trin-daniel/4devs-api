import { SurveyDTO } from '@domain/dtos'
import { Surveys } from '@domain/entities'
import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import
{
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@data/contracts'

export class SurveyMongoRepository implements
AddSurveyRepository,
LoadSurveysRepository,
LoadSurveyByIdRepository {
  async add (data: SurveyDTO): Promise<void> {
    const collection = await MongoHelper.collection('surveys')
    await collection.insertOne(data)
  }

  async loadAll (): Promise<Surveys[]> {
    const collection = await MongoHelper.collection('surveys')
    const surveys = await collection.find().toArray() as Surveys[]
    return surveys
  }

  async loadById (id: string): Promise<Surveys> {
    const collection = await MongoHelper.collection('surveys')
    const survey = await collection.findOne({ _id: id }) as Surveys
    return survey
  }
}
