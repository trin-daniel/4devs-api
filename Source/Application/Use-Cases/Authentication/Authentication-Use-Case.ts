import { Authentication } from '@Application/Entities'
import { AuthenticationDTO } from '@Application/DTOS/Authentication/Authentication-DTO'

export interface AuthenticationUseCase {
   Auth(data: AuthenticationDTO): Promise<Authentication>
}
