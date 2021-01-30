import { EmailValidator } from '../../presentation/contracts/email-validator'
import { Validator } from '../../presentation/contracts/validator'
import { InvalidParamError } from '../../presentation/errors'

export class EmailFieldValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: {[key: string]: any}): Error | null {
    const isEmail = this.emailValidator.isEmail(this.fieldName)
    return !isEmail
      ? new InvalidParamError(this.fieldName)
      : null
  }
}
