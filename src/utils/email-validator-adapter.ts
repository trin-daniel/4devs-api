import { EmailValidator } from '../presentation/contracts/email-validator'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  public isEmail (email: string): boolean {
    return validator.isEmail(email)
  }
}
