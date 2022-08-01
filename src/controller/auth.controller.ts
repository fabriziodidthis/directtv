import {Request, Response} from 'express'
import { CreateSessionInput } from '../schema/auth.schema'
import { signAccessToken, signRefreshToken } from '../service/auth.service'
import { findUserByEmail } from '../service/user.service'

const messageInvalid = 'Invalid email and/or password'
const verifyEmail = 'Please, check your email'

export async function createSessionHandler(request: Request<{},{}, CreateSessionInput>, response: Response) {
  const {email, password} = request.body

  const user = await findUserByEmail(email)

  if(!user){
    return response.status(200).json({
      message: messageInvalid
    })
  }

  if(!user.verifiedUser){
    return response.status(200).json({
      message: verifyEmail
    })
  }

  const userIsValid = await user.validatePassword(password)

  if(!userIsValid){
    return response.status(200).json({
      message: messageInvalid
    })
  }

  // Sign the access token
const accessToken = signAccessToken(user)

  // Sign the refresh token
const refreshToken = await signRefreshToken({userID: user._id })

  // Send the tokens
  return response.send({accessToken, refreshToken})

}