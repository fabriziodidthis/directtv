import { setLogLevel } from "@typegoose/typegoose";
require('dotenv').config()
import express from 'express'
import connectDB from './utils/database'
import log from './utils/logger'
import router from './routes'
import deserializeUser from "./middlewares/deserializeUser";

setLogLevel("WARN");

const app = express()
app.use(express.json())
app.use(deserializeUser)
app.use(router)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  log.info(`Server up at http://localhost:${PORT}`)
  connectDB()
})