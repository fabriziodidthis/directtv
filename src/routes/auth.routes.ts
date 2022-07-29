import express,{Request, Response} from 'express'

const router = express.Router()

router.post('/users', (request: Request, response: Response) => {
  response.status(200).json({
    message: 'User'
  })
})


export default router