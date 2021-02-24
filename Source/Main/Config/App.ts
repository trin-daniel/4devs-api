import SetupMiddlewares from '@Main/Config/Middlewares'
import SetupRoutes from '@Main/Config/Routes'
import SetupSwagger from '@Main/Config/Swagger'
import express from 'express'
import SetupStaticFiles from './Static-Files'

const App = express()
SetupStaticFiles(App)
SetupSwagger(App)
SetupMiddlewares(App)
SetupRoutes(App)
export default App
