export default {
  HOST: process.env.MONGO_URL || 'mongodb://mongo:27017/4devs-api',
  PORT: process.env.PORT || 3333,
  SECRET_KEY: process.env.JWT_SECRET || '6aa7f23840b6e71111708daa1f23ff8a2d86697004ee51fb7fda8c0383af6e4b'
}
