import {Request, Response, NextFunction} from 'express'
import {AnyZodObject} from 'zod'

/**
 * Validating inputs from body request
 * @param schema Takes the body inputs and validates them against the User schema
 * @returns Errors on not validated inputs
 */
const validateResource = (schema: AnyZodObject) => (request:Request, response: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: request.body,
      query: request.query,
      params: request.params
    })
    // If the schema is validated, it can pass
    next()
  } catch (error: any) {
    return response.status(422).json({
      message: 'Some fields could not be validated',
      error: error.message
    })
    // return response.status(400).send(error.errors)
  }
}

export default validateResource