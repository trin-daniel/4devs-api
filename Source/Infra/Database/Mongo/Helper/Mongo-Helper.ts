import { MongoClient } from 'mongodb'

export const MongoHelper =
{
  Client: null as MongoClient,
  Uri: null as string,
  async connect (uri: string) {
    this.Uri = uri
    this.Client = await MongoClient.connect(this.Uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
  },
  async disconnect () {
    await this.Client.close()
    this.Client = null
  },

  async collection (name: string) {
    if (!this.Client?.isConnected()) {
      await this.connect(this.Uri)
    }
    return this.Client.db().collection(name)
  },

  mapper<M = any> (collection: any): M {
    const { _id, ...obj } = collection
    return Object.assign({}, obj, { id: _id })
  }
}
