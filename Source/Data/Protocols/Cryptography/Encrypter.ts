export interface Encrypter {
  Encrypt (value: string): Promise<string>
}
