import express, { Express } from 'express'
import { resolve } from 'path'

export default (app: Express) => {
  app.use('/api/static', express.static(resolve(__dirname, '../../Static')))
}
