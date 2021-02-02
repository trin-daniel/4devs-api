export default {
  HOST: process.env.MONGO_URL || 'mongodb://localhost:27017/4devs-api',
  PORT: process.env.PORT || 3333,
  SECRET_KEY: process.env.JWT_SECRET || 'TJ001ERFG'
}
