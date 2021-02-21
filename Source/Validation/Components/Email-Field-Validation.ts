import { Validation } from '@Presentation/Protocols/Validation'
import { InvalidParamError } from '@Presentation/Errors'

export class EmailFieldValidation implements Validation {
  constructor (
    private readonly FieldName: string
  ) {}

  Validate (input: {[key: string]: any}): Error | null {
    const regex = /\w{1,}(\d){0,}(\.|_){0,}(\w){0,}@(gmail|outlook|uol|yahoo|hotmail)\.(com|gov|net)(\.br){0,1}/gm
    if (!regex.test(input[this.FieldName])) {
      return new InvalidParamError(this.FieldName)
    }
    return null
  }
}
