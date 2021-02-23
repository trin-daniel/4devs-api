import { SurveyResultDTO } from '@Application/DTOS'
import { SurveyResult } from '@Application/Entities'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@Data/Protocols/Database'
import { MongoHelper, QueryBuilder } from '@Infra/Database/Mongo/Helper'
import { ObjectId } from 'mongodb'

export class SurveyResultRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async LoadBySurveyId (survey_id: string): Promise<SurveyResult> {
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
        total: {
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
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        }
      })
      .Project({
        _id: 0,
        survey_id: '$_id.survey_id',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: ['$$item', {
                count: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: '$count',
                    else: 0
                  }
                },
                percent: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: {
                      $multiply: [{
                        $divide: ['$count', '$_id.total']
                      }, 100]
                    },
                    else: 0
                  }
                }
              }]
            }
          }
        }
      })
      .Group({
        _id: {
          survey_id: '$survey_id',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .Project({
        _id: 0,
        survey_id: '$_id.survey_id',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .Unwind({
        path: '$answers'
      })
      .Group({
        _id: {
          survey_id: '$survey_id',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        }
      })
      .Project({
        _id: 0,
        survey_id: '$_id.survey_id',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: '$percent'
        }
      })
      .Sort({
        'answer.count': -1
      })
      .Group({
        _id: {
          survey_id: '$survey_id',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
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

  async Save (data: SurveyResultDTO): Promise<void> {
    const { account_id, survey_id, answer, date } = data
    const Collection = await MongoHelper.collection('survey-results')
    await Collection.findOneAndUpdate(
      { account_id: new ObjectId(account_id), survey_id: new ObjectId(survey_id) },
      { $set: { answer, date } },
      { upsert: true }
    )
  }
}
