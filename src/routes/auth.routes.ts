import express from 'express'
import { createSessionHandler, refreshAccessTokenHandler } from '../controller/auth.controller'
import validateResource from '../middlewares/validateResource'
import { createSessionSchema } from '../schema/auth.schema'

const router = express.Router()

router.post('/sessions', validateResource(createSessionSchema), createSessionHandler)

router.post('/sessions/refresh', refreshAccessTokenHandler)

export default router