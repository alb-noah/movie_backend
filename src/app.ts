import express, {Application} from 'express'
import {applyRoutes}          from './Routes'

export const app: Application = express()

app.use(applyRoutes())
