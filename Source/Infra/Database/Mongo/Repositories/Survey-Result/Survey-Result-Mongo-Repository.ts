import { SurveyResultDTO } from '@Application/DTOS'
import { SurveyResult } from '@Application/Entities'
import { SaveSurveyResultRepository } from '@Data/Protocols/Database'
import { MongoHelper, QueryBuilder } from '@Infra/Database/Mongo/Helper'
import { ObjectId } from 'mongodb'

export class SurveyResultRepository implements SaveSurveyResultRepository {
  private async LoadSurvey (survey_id: string): Promise<SurveyResult> {
    const Collection = await MongoHelper.collection('survey-results')
    const Query = new QueryBuilder()
      .Match({
        survey_id: new ObjectId(survey_id)
      })
      .Group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      })
      .Unwind({
        path: '$data'
      })
      .Lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.survey_id',
        as: 'survey'
      })
      .Unwind({
        path: '$survey'
      })
      .Group({
        _id: {
          survey_id: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer']
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      })
      .Unwind({
        path: '$_id.answer'
      })
      .AddFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [{
            $divide: ['$count', '$_id.total']
          }, 100]
        }
      })
      .Group({
        _id: {
          survey_id: '$_id.survey_id',
          question: '$_id.question',
          date: '$_id.date'
        },
        answers: {
          $push: '$_id.answer'
        }
      })
      .Project({
        _id: 0,
        survey_id: '$_id.survey_id',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .Build()

    const ResultOperation = await Collection.aggregate(Query).toArray()
    return ResultOperation?.length && ResultOperation[0]
  }

  async Save (data: SurveyResultDTO): Promise<SurveyResult> {
    const { account_id, survey_id, answer, date } = data
    const Collection = await MongoHelper.collection('survey-results')
    await Collection.findOneAndUpdate(
      { account_id: new ObjectId(account_id), survey_id: new ObjectId(survey_id) },
      { $set: { answer, date } },
      { upsert: true }
    )
    const Survey = await this.LoadSurvey(survey_id)
    return Survey
  }
}
