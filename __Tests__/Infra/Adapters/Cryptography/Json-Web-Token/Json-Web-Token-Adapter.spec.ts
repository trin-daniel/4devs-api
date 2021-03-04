import { JsonWebTokenAdapter } from '@Infra/Adapters/Cryptography/Json-Web-Token/Json-Web-Token-Adapter'
import Jsonwebtoken from 'jsonwebtoken'
import Faker from 'faker'

interface SutTypes {
  Sut: JsonWebTokenAdapter,
  KEY_SECRET: string
}

const MOCKED_ID = Faker.random.uuid()
const EXPECTED_TOKEN = Faker.random.uuid()

const MakeSut = (): SutTypes => {
  const KEY_SECRET = 'random_key'
  const Sut = new JsonWebTokenAdapter(KEY_SECRET)
  return { Sut, KEY_SECRET }
}

jest.mock('jsonwebtoken', () => {
  return {
    async sign (): Promise<string> {
      return Promise.resolve(EXPECTED_TOKEN)
    },
    async verify (): Promise<string> {
      return Promise.resolve(MOCKED_ID)
    }
  }
})

describe('Json Web Token Adapter', () => {
  describe('#Sign', () => {
    test('Should call the sign method with correct values', async () => {
      const { Sut, KEY_SECRET } = MakeSut()
      const SignSpy = jest.spyOn(Jsonwebtoken, 'sign')
      await Sut.Encrypt(MOCKED_ID)
      expect(SignSpy).toHaveBeenCalledWith({ id: MOCKED_ID }, KEY_SECRET, { expiresIn: '2d' })
    })

    test('Should return a token when sign succeeds', async () => {
      const { Sut } = MakeSut()
      const Token = await Sut.Encrypt(MOCKED_ID)
      expect(Token).toBe(EXPECTED_TOKEN)
    })

    test('Should throw if sign method throws', async () => {
      const { Sut } = MakeSut()
      jest.spyOn(Jsonwebtoken, 'sign').mockImplementationOnce(() => { throw new Error() })
      const PromiseRejected = Sut.Encrypt(MOCKED_ID)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })

  describe('#Verify', () => {
    test('Should call verify with correct values', async () => {
      const { Sut, KEY_SECRET } = MakeSut()
      const VerifySpy = jest.spyOn(Jsonwebtoken, 'verify')
      await Sut.Decrypt(EXPECTED_TOKEN)
      expect(VerifySpy).toHaveBeenCalledWith(EXPECTED_TOKEN, KEY_SECRET)
    })

    test('Should return a value when verify succeeds', async () => {
      const { Sut } = MakeSut()
      const ID = await Sut.Decrypt(EXPECTED_TOKEN)
      expect(ID).toBe(MOCKED_ID)
    })

    test('Should throw if verify method throws', async () => {
      const { Sut } = MakeSut()
      jest.spyOn(Jsonwebtoken, 'verify').mockImplementationOnce(() => { throw new Error() })
      const PromiseRejected = Sut.Decrypt(EXPECTED_TOKEN)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
