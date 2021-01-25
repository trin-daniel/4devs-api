import { AuthenticationDTO } from '../data-transfer-objects/authentication-dto'
export interface Authentication {
   auth (data: AuthenticationDTO): Promise<string>
}
