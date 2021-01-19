import { MongoClient } from 'mongodb'

export const MongoHelper =
{
  client: null as MongoClient,
  uri: null as string,
  async connect (uri: string) {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri,
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

  async collection (name: string) {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  mapper<M = any> (collection: any): M {
    const { _id, ...obj } = collection
    return Object.assign({}, obj, { id: _id })
  }
}
