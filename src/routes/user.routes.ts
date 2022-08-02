import express from 'express'
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler } from '../controller/user.controller'
import requireUser from '../middlewares/requireUser'
import validateResource from '../middlewares/validateResource'
import { createUserSchema, forgotPasswordSchema, resetPasswordschema, verifyUserSchema } from '../schema/user.schema'

const router = express.Router()

router.post('/users',validateResource(createUserSchema), createUserHandler)

router.post('/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler)

router.post('/users/forgotPassword', validateResource(forgotPasswordSchema), forgotPasswordHandler)

router.post('/users/resetPassword/:id/:passwordResetCode', validateResource(resetPasswordschema), resetPasswordHandler)

router.get('/users/me', requireUser, getCurrentUserHandler)

export default router