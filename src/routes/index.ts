import express, {Request, Response} from 'express'
import user from './user.routes'
import auth from './auth.routes'

const router = express.Router()

router.get('/health', (request: Request, response: Response) => {
  response.status(200).json({
    message: 'Application up and running'
  })
})

router.use(user)
router.use(auth)

export default router