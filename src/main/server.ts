import express from 'express'
import { log } from 'debug'
log('app:server')
const app = express()

app.listen(process.env.PORT || 3333, log(`Application running at http://localhost:${process.env.PORT || 3333}`))
