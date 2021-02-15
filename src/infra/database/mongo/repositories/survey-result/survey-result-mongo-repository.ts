import { SurveyResultDTO } from '@domain/dtos'
import { SurveyResult } from '@domain/entities'
import { SaveSurveyResultRepository } from '@data/contracts'
import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyResultRepository implements SaveSurveyResultRepository {
  async save (data: SurveyResultDTO): Promise<SurveyResult> {
    const { account_id, survey_id, answer, date } = data
    const collection = await MongoHelper.collection('survey-results')
    const surveyResult = await collection.findOneAndUpdate(
      { account_id: new ObjectId(account_id), survey_id: new ObjectId(survey_id) },
      { $set: { answer, date } },
      { upsert: true, returnOriginal: false }
    )
    const { value } = surveyResult
    return value && MongoHelper.mapper(value)
  }
}
