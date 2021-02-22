import { SurveyDTO } from '@Application/DTOS'
import { Surveys } from '@Application/Entities'
import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@Data/Protocols/Database'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements
AddSurveyRepository,
LoadSurveysRepository,
LoadSurveyByIdRepository {
  async Add (data: SurveyDTO): Promise<void> {
    const Collection = await MongoHelper.collection('surveys')
    await Collection.insertOne(data)
  }

  async LoadAll (): Promise<Surveys[]> {
    const Collection = await MongoHelper.collection('surveys')
    const Surveys = await Collection.find().toArray() as Surveys[]
    return Surveys.map(item => MongoHelper.mapper(item)) as Surveys[]
  }

  async LoadById (id: string): Promise<Surveys> {
    const Collection = await MongoHelper.collection('surveys')
    const Survey = await Collection.findOne({ _id: new ObjectId(id) }) as Surveys
    return Survey && MongoHelper.mapper(Survey)
  }
}
