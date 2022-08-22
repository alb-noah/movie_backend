import express, { Application } from 'express'
import cors                     from 'cors'
import { PUBLIC_PATH }          from './config'
import { applyRoutes }          from './Routes'

export const app: Application = express()

app.use(cors())
app.use(express.json());
app.use(express.static(PUBLIC_PATH))
app.use(express.urlencoded({ extended: true }))

app.use(applyRoutes())
