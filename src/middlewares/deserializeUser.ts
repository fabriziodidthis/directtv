import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

const deserializeUser =async (request: Request, response: Response, next: NextFunction) => {
  const accessToken = (request.headers.authorization || '').replace(/^Bearer\s/,'')

  if(!accessToken) {
    return next()
  }

  const decoded = verifyJWT(accessToken, process.env.ACCESS_TOKEN_PUBLIC_KEY)

  if(decoded){
    response.locals.user = decoded
  }

  return next()
}

export default deserializeUser