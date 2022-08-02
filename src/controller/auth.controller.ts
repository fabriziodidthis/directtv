import {Request, Response} from 'express'
import { CreateSessionInput } from '../schema/auth.schema'
import { findSessionById, signAccessToken, signRefreshToken } from '../service/auth.service'
import { findUserByEmail, findUserByID } from '../service/user.service'
import { verifyJWT } from '../utils/jwt'

const messageInvalid = 'Invalid email and/or password'
const verifyEmail = 'Please, check your email'

/**
 * Validate and login the user into the application
 * @param request email and password 
 * @param response 
 * @returns a token to allow the user use the application
 */
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

/**
 * Refresh the access token
 * @param request user ID
 * @returns a new token to be used after token expiration
 */
export async function refreshAccessTokenHandler(request: Request, response: Response) {

  const notPossibleToRefreshMessage = 'Not possible to refresh your access token this time.'
  const refreshToken = request.header('x-refresh') as string

  const decoded = verifyJWT<{session: string}>(refreshToken, process.env.REFRESH_TOKEN_PUBLIC_KEY)

  if(!decoded){
    return response.status(401).json({
      message: notPossibleToRefreshMessage
    })
  }

  // This session comes from 'refreshToken' method in signRefreshToken
  const session = await findSessionById(decoded.session)

  if(!session || !session.valid){
    return response.status(401).json({
      message: notPossibleToRefreshMessage
    })
  }

  // As long this is a Promise and not an object, you need to use await here
  const user = await findUserByID(String(session.user))

  if(!user){
    return response.status(401).json({
      message: notPossibleToRefreshMessage
    })
  }

  const accessToken = signAccessToken(user)

  return response.json({
    message: 'Valid user session',
    accessToken
  })
}