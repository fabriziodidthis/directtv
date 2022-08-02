import { NextFunction, Request, Response } from "express";

const requireUser = function(request: Request, response: Response, next: NextFunction){
  const user = response.locals.user

  if(!user){
    return response.status(403).json({
      message: 'You are not allowed to access this URL'
    })
  }

  return next()
}

export default requireUser