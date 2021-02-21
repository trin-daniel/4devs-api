import SetupMiddlewares from '@Main/Config/Middlewares'
import SetupRoutes from '@Main/Config/Routes'
import SetupSwagger from '@Main/Config/Swagger'
import express from 'express'

const App = express()
SetupSwagger(App)
SetupMiddlewares(App)
SetupRoutes(App)
export default App
