import { SurveyDTO } from '@Application/DTOS'
import { Surveys } from '@Application/Entities'
import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@Data/Protocols/Database/Survey'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { QueryBuilder } from '@Infra/Database/Mongo/Helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements
AddSurveyRepository,
LoadSurveysRepository,
LoadSurveyByIdRepository {
  async Add (data: SurveyDTO): Promise<void> {
    const Collection = await MongoHelper.collection('surveys')
    await Collection.insertOne(data)
  }

  async LoadAll (account_id: string): Promise<Surveys[]> {
    const Collection = await MongoHelper.collection('surveys')
    const Query = new QueryBuilder()
      .Lookup({
        from: 'survey-results',
        foreignField: 'survey_id',
        localField: '_id',
        as: 'result'
      })
      .Project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.account_id', new ObjectId(account_id)]
                }
              }
            }
          }, 1]
        }
      })
      .Build()
    const Surveys = await Collection.aggregate(Query).toArray()
    return Surveys && Surveys.map(items => MongoHelper.mapper(items))
  }

  async LoadById (id: string): Promise<Surveys> {
    const Collection = await MongoHelper.collection('surveys')
    const Survey = await Collection.findOne({ _id: new ObjectId(id) }) as Surveys
    return Survey && MongoHelper.mapper(Survey)
  }
}
