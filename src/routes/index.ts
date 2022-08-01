import express from 'express'
import user from './user.routes'
import auth from './auth.routes'
import health from './health.routes'

const router = express.Router()

router.use(user)
router.use(auth)
router.use(health)

export default router