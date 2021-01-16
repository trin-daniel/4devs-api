import app from './config/app'
import { log } from 'debug'

log('app:server')

app.listen(process.env.PORT || 3333, log(`Application running at http://localhost:${process.env.PORT || 3333}`))
