export interface Decrypter {
  Decrypt(value: string): Promise<string>
}
