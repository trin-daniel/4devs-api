import { EmailValidator } from '../contracts/email-validator'
import { Validator } from '../../presentation/contracts/validator'
import { InvalidParamError } from '../../presentation/errors'

export class EmailFieldValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: {[key: string]: any}): Error | null {
    const isEmail = this.emailValidator.isEmail(input[this.fieldName])
    return !isEmail
      ? new InvalidParamError(this.fieldName)
      : null
  }
}
