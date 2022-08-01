import express, {Request, Response} from 'express'
const router = express.Router()

/**
 * Application health check
 */
router.get('/health', (request: Request, response: Response) => {
  response.status(200).json({
    message: 'Application up and running'
  })
})

export default router