import { MongoClient } from 'mongodb'

export const MongoHelper =
{
  client: null as MongoClient,
  async connect (uri: string) {
    this.client = await MongoClient.connect(uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
  },
  async disconnect () {
    await this.client.close()
    this.client = null
  },

  collection (name: string) {
    return this.client.db().collection(name)
  }
}